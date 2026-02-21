/**
 * AudioService — Real browser audio recording using MediaRecorder API
 * Handles microphone permission, recording, stopping, and blob creation
 */

class AudioService {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.isRecording = false;
    this.audioContext = null;
    this.analyser = null;
  }

  /**
   * Check if browser supports MediaRecorder
   */
  static isSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }

  /**
   * Request microphone permission and initialize the stream
   * @returns {Promise<boolean>} true if permission granted
   */
  async initRecording() {
    if (!AudioService.isSupported()) {
      console.warn('MediaRecorder not supported in this browser');
      return false;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      return true;
    } catch (error) {
      console.error('Microphone permission denied or error:', error.message);
      return false;
    }
  }

  /**
   * Start recording audio
   * @returns {boolean} true if recording started
   */
  startRecording() {
    if (!this.stream) {
      console.error('No stream available — call initRecording() first');
      return false;
    }

    this.audioChunks = [];

    try {
      // Use webm/opus for best browser compatibility
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4';

      this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(250); // Collect data every 250ms for responsive UI
      this.isRecording = true;
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  }

  /**
   * Stop recording and return the audio Blob
   * @returns {Promise<Blob|null>} audio blob or null on error
   */
  stopRecording() {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        this.isRecording = false;
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        this.audioChunks = [];
        this.isRecording = false;
        resolve(audioBlob);
      };

      this.mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        this.isRecording = false;
        resolve(null);
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Cancel recording without returning data
   */
  cancelRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.onstop = () => { };
      this.mediaRecorder.stop();
    }
    this.audioChunks = [];
    this.isRecording = false;
  }

  /**
   * Release the microphone stream
   */
  releaseStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  /**
   * Play an audio blob
   * @param {Blob} blob
   * @returns {HTMLAudioElement}
   */
  playBlob(blob) {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => URL.revokeObjectURL(url);
    audio.play();
    return audio;
  }

  /**
   * Convert blob to base64 string (for API submission)
   * @param {Blob} blob
   * @returns {Promise<string>}
   */
  static blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

// Export singleton instance
const audioService = new AudioService();
export default audioService;
export { AudioService };