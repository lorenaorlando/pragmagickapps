// Audio service for Pragmagicka Tarot
// Plays only the custom recorded card shuffling MP3; all other clicks/chimes remain disabled.

const SHUFFLE_AUDIO_URL = 'https://sandboxlandia.online/wp-content/uploads/2026/09/BARAJAR.mp3';

class TarotAudioService {
  private shuffleAudio: HTMLAudioElement | null = null;
  public enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.shuffleAudio = new Audio(SHUFFLE_AUDIO_URL);
        this.shuffleAudio.preload = 'auto';
      } catch {
        // Audio might not be supported in certain non-browser environments
      }
    }
  }

  // UI clicks are completely disabled per user request
  public playClick() {
    // Intentionally silent
  }

  // Chimes are completely disabled per user request
  public playChime() {
    // Intentionally silent
  }

  // Plays the official BARAJAR.mp3 sound
  public playShuffle() {
    if (!this.enabled) return;
    try {
      if (!this.shuffleAudio && typeof window !== 'undefined') {
        this.shuffleAudio = new Audio(SHUFFLE_AUDIO_URL);
      }

      if (this.shuffleAudio) {
        this.shuffleAudio.currentTime = 0;
        const playPromise = this.shuffleAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay permissions or user interaction requirement fallback
          });
        }
      }
    } catch {
      // Ignored if browser audio policy blocks before user interaction
    }
  }
}

export const tarotAudio = new TarotAudioService();
