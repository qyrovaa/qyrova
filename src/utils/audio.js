let audio = null;

export const playMusic = () => {
  if (!audio) {
    audio = new Audio("/music/calm.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    audio.muted = true; // ✅ start muted (autoplay allowed)
  }

  audio.play().catch(err => console.log("Audio error:", err));
};

export const unmuteMusic = () => {
  if (audio) {
    audio.muted = false;
  }
};

export const stopMusic = () => {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
};