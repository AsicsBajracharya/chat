// utils/notificationSound.ts
let audio: HTMLAudioElement | null = null;
let unlocked = false;

export function initNotificationSound() {
  if (unlocked) return;

  audio = new Audio("/sounds/notification.mp3");
  audio.volume = 1;

  // Try to play silently to unlock
  audio
    .play()
    .then(() => {
      audio?.pause();
      audio!.currentTime = 0;
      unlocked = true;
      console.log("Audio unlocked");
    })
    .catch(() => {
      // Will fail until user gesture
    });
}

export function playNotificationSound() {
  if (!audio || !unlocked) return;

  audio.currentTime = 0;
  audio.play().catch(() => {});
}
