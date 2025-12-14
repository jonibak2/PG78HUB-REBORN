function getMoonPhase(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let lp = 2551443;
  let now = new Date(year, month - 1, day);
  let newMoon = new Date(1970, 0, 7, 20, 35, 0);
  let phase = ((now.getTime() - newMoon.getTime()) / 1000) % lp;
  let age = Math.floor(phase / (24 * 3600));

  if (age === 0 || age === 29) return "🌑";
  else if (age >= 1 && age <= 6) return "🌒";
  else if (age === 7 || age === 8) return "🌓";
  else if (age >= 9 && age <= 13) return "🌔";
  else if (age === 14 || age === 15) return "🌕";
  else if (age >= 16 && age <= 20) return "🌖";
  else if (age === 21 || age === 22) return "🌗";
  else if (age >= 23 && age <= 28) return "🌘";
  else return "🌑";
}

const moonPhaseElement = document.getElementById('moonPhase');
const today = new Date();
if (moonPhaseElement) moonPhaseElement.textContent = getMoonPhase(today);

const audio = new Audio('assets/pgHUB/bansuka.mp3');
let canPlay = true;

if (moonPhaseElement) {
  moonPhaseElement.addEventListener('click', () => {
    if (canPlay) {
      audio.currentTime = 0;
      audio.play();
      canPlay = false;

      setTimeout(() => {
        canPlay = true;
      }, 7500);
    }
  });
}

const videoButton = document.getElementById('videoButton');
const videoOverlay = document.getElementById('videoOverlay');
const loloVideo = document.getElementById('loloVideo');
let canPlayVideo = true;

if (videoButton) {
  videoButton.addEventListener('click', () => {
    if (canPlayVideo) {
      if (videoOverlay) videoOverlay.style.display = 'block';
      if (loloVideo) loloVideo.play();
      canPlayVideo = false;

      setTimeout(() => {
        canPlayVideo = true;
      }, 15000);
    }
  });
}

if (loloVideo) {
  loloVideo.addEventListener('ended', () => {
    if (videoOverlay) videoOverlay.style.display = 'none';
    loloVideo.currentTime = 0;
  });

  loloVideo.addEventListener('click', () => {
    if (videoOverlay) videoOverlay.style.display = 'none';
    loloVideo.pause();
    loloVideo.currentTime = 0;
  });
}
