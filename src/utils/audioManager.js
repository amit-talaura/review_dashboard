let currentAudio = null;
let currentStopFn = null;

export const registerAudio = (audioInstance, stopFn) => {
  if (currentAudio && currentAudio !== audioInstance) {
    if (currentStopFn) currentStopFn();
  }
  currentAudio = audioInstance;
  currentStopFn = stopFn;
};

export const clearAudio = (audioInstance) => {
  if (currentAudio === audioInstance) {
    currentAudio = null;
    currentStopFn = null;
  }
};

export const pauseAllAudio = () => {
  if (currentAudio) {
    try {
      currentAudio.pause();
    } catch (err) {
      console.warn("Error stopping audio:", err);
    }
    if (currentStopFn) currentStopFn();
    currentAudio = null;
    currentStopFn = null;
  }
};
