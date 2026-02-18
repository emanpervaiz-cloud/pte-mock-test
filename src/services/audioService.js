// Audio service for recording and playback functionality
class AudioService {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.isRecording = false;
  }

  // Check if the browser supports required APIs
  static isSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }

  // Initialize the audio recording
  async initRecording(constraints = { audio: true }) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.mediaRecorder = new MediaRecorder(this.stream);
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.isRecording = false;
      };

      return true;
    } catch (error) {
      console.error('Error initializing audio recording:', error);
      return false;
    }
  }

  // Start recording
  startRecording() {
    if (!this.mediaRecorder) {
      throw new Error('Audio recorder not initialized. Call initRecording() first.');
    }

    this.audioChunks = [];
    this.mediaRecorder.start();
    this.isRecording = true;
  }

  // Stop recording and return the blob
  async stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error('Recorder not started or already stopped'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.isRecording = false;
        
        // Clean up the stream
        this.stream.getTracks().forEach(track => track.stop());
        
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  // Cancel recording without saving
  cancelRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.audioChunks = [];
      this.isRecording = false;
      
      // Clean up the stream
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
    }
  }

  // Play an audio blob or URL
  async playAudio(audioSource) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      
      if (audioSource instanceof Blob) {
        audio.src = URL.createObjectURL(audioSource);
      } else {
        audio.src = audioSource;
      }

      audio.onended = () => {
        // Clean up the object URL if it was created from a blob
        if (audioSource instanceof Blob) {
          URL.revokeObjectURL(audio.src);
        }
        resolve();
      };

      audio.onerror = (error) => {
        reject(error);
      };

      audio.play().catch(reject);
    });
  }

  // Convert blob to base64
  async blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Get recording status
  getRecordingStatus() {
    return {
      isRecording: this.isRecording,
      isInitialized: !!this.mediaRecorder
    };
  }

  // Get supported audio MIME types
  static getSupportedMimeTypes() {
    const types = [
      'audio/webm',
      'audio/ogg',
      'audio/mp4',
      'audio/wav'
    ];
    
    return types.filter(type => MediaRecorder.isTypeSupported(type));
  }
}

export default AudioService;