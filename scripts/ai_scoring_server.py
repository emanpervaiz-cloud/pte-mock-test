#!/usr/bin/env python3
"""
AI Scoring Server for PTE Mock Test
Flask server that handles n8n webhook requests and provides AI scoring
"""

import os
import json
import asyncio
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from ai_scoring_service import handle_n8n_request, PTEScoringService
import threading
import sys
import uuid
from dotenv import load_dotenv

import logging
from datetime import datetime

# Load environment variables
load_dotenv()

# Configure logging
os.makedirs('logs', exist_ok=True)
# Add a request_id to the log format
log_format = '%(asctime)s [%(levelname)s] [%(request_id)s] %(message)s'

class RequestIdFilter(logging.Filter):
    def filter(self, record):
        record.request_id = g.get('request_id', 'no-request-id')
        return True

logging.basicConfig(
    level=logging.INFO,
    format=log_format,
    handlers=[
        logging.FileHandler(f"logs/scoring_server_{datetime.now().strftime('%Y%m%d')}.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)
logger.addFilter(RequestIdFilter())


app = Flask(__name__)
# For production, restrict this to your frontend's domain
# Example: CORS(app, resources={r"/api/*": {"origins": "https://your-frontend.com"}})
CORS(app)  # Enable CORS for all routes

# --- asyncio and threading setup ---
def _run_async_loop(loop):
    """Sets the event loop for the current thread and runs it forever."""
    asyncio.set_event_loop(loop)
    loop.run_forever()

# Create and start a new thread for the asyncio event loop
event_loop = asyncio.new_event_loop()
loop_thread = threading.Thread(target=_run_async_loop, args=(event_loop,), daemon=True)
loop_thread.start()
logger.info("Asyncio event loop started in a background thread.")

def run_async_task(coro):
    """Submits a coroutine to the event loop and waits for the result."""
    future = asyncio.run_coroutine_threadsafe(coro, event_loop)
    return future.result() # This blocks the current thread until the coroutine is done

@app.before_request
def before_request_func():
    g.request_id = str(uuid.uuid4())

@app.route('/webhook/pte-scoring', methods=['POST'])
def webhook_handler():
    """
    Main webhook endpoint for n8n integration
    Handles all PTE scoring requests from n8n
    """
    if not request.is_json:
        logger.warning("Request received without JSON payload.")
        return jsonify({"error": "Request must be JSON", "success": False}), 415

    try:
        # Get JSON payload from n8n
        payload = request.get_json()
        
        logger.info(f"Received webhook request: {payload.get('action', 'unknown')}")
        
        # Process the request asynchronously
        result = run_async_task(handle_n8n_request(payload))
        
        logger.info(f"Processing completed, success: {result.get('success', False)}")
        
        status_code = 200 if result.get('success', False) else 400
        return jsonify(result), status_code
            
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": str(e),
            "result": None
        }), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "PTE AI Scoring Server",
        "timestamp": str(datetime.now())
    }), 200


def _run_evaluation(coroutine):
    """Helper to run an evaluation coroutine and format the response."""
    result = run_async_task(coroutine)
    return jsonify({
        "success": True,
        "result": result.details,
        "score": result.score,
        "feedback": result.feedback
    })

@app.route('/api/test-evaluation', methods=['POST'])
def test_evaluation():
    """Test endpoint for manual evaluation testing"""
    if not request.is_json:
        logger.warning("Test evaluation request received without JSON payload.")
        return jsonify({"error": "Request must be JSON", "success": False}), 415

    try:
        data = request.get_json()
        action = data.get('action')
        logger.info(f"Received test evaluation request for action: {action}")
        
        scoring_service = PTEScoringService()
        
        if action == 'evaluate_speaking':
            coro = scoring_service.evaluate_speaking(
                prompt=data.get('prompt', ''),
                transcript=data.get('transcript', ''),
                question_type=data.get('question_type', 'speaking')
            )
            return _run_evaluation(coro)
        
        elif action == 'evaluate_writing':
            coro = scoring_service.evaluate_writing(
                prompt=data.get('prompt', ''),
                response=data.get('response', ''),
                question_type=data.get('question_type', 'writing')
            )
            return _run_evaluation(coro)
        
        else:
            logger.warning(f"Unsupported action in test evaluation: {action}")
            return jsonify({
                "success": False,
                "error": f"Unsupported action: {action}"
            }), 400
            
    except Exception as e:
        logger.error(f"Test evaluation error: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

def run_server():
    """Run the Flask server"""
    port = int(os.environ.get('PORT', 5001))
    logger.info(f"Starting PTE AI Scoring Server on port {port}...")
    logger.info(f"Webhook endpoint: http://localhost:{port}/webhook/pte-scoring")
    
    # threaded=True is still useful for Flask to handle multiple requests concurrently,
    # even with the asyncio background thread.
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)


if __name__ == '__main__':
    # The dependency check is useful for standalone script execution.
    # In a containerized environment, this might be redundant.
    try:
        import flask
        from flask_cors import CORS
        import aiohttp
        import dotenv
    except ImportError as e:
        # Using logger might fail if basicConfig hasn't run, so print is safer here.
        print(f"ERROR: Missing dependency: {e}", file=sys.stderr)
        print("Please install required packages:", file=sys.stderr)
        print("pip install flask flask-cors aiohttp python-dotenv", file=sys.stderr)
        sys.exit(1)
    
    # Start the server
    run_server()