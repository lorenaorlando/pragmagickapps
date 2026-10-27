// Card shuffling sound recorded for the app. Other UI sounds are intentionally silent.
const SHUFFLE_AUDIO_URL = 'https://sandboxlandia.online/wp-content/uploads/2026/09/BARAJAR.mp3';

let shuffleAudio: HTMLAudioElement | null = null;

export const playShuffle = () => {
  try {
    shuffleAudio ??= new Audio(SHUFFLE_AUDIO_URL);
    shuffleAudio.currentTime = 0;
    shuffleAudio.play().catch(() => {
      // blocked until the user interacts: fine to skip
    });
  } catch {
    // audio unsupported
  }
};
