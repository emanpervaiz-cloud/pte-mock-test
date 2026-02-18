// Webhook Service for n8n Integration
// Handles sending exam results to n8n workflow

class WebhookService {
  constructor(webhookUrl) {
    this.webhookUrl = webhookUrl;
  }

  // Send exam results to n8n
  async sendResultsToN8n(userData, examData, scores) {
    const payload = {
      timestamp: new Date().toISOString(),
      userData: userData,
      examData: {
        ...examData,
        startedAt: examData.startedAt || new Date().toISOString(),
        completedAt: new Date().toISOString()
      },
      scores: scores,
      metadata: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
      }
    };

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Successfully sent results to n8n:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error sending results to n8n:', error);
      return { success: false, error: error.message };
    }
  }

  // Verify webhook endpoint
  async verifyEndpoint() {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error verifying webhook endpoint:', error);
      return false;
    }
  }

  // Send partial data during exam (for progress tracking)
  async sendProgressUpdate(userData, currentSection, progress) {
    const payload = {
      eventType: 'exam_progress',
      timestamp: new Date().toISOString(),
      userData: userData,
      currentSection: currentSection,
      progress: progress,
      metadata: {
        userAgent: navigator.userAgent,
        platform: navigator.platform
      }
    };

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending progress update to n8n:', error);
      return { success: false, error: error.message };
    }
  }

  // Set a new webhook URL
  setWebhookUrl(newUrl) {
    this.webhookUrl = newUrl;
  }
}

export default WebhookService;