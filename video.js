const video = document.getElementById('head');

let duration = 0;
let ready = false;
video.addEventListener('loadstart', () => {
  ready = false;
});
video.addEventListener('canplaythrough', () => {
  ready = true;
  duration = video.duration;
});
document.addEventListener('mousemove', e => {
  if (!ready) {
    return;
  }
  const normalizedX = e.clientX / window.innerWidth;
  video.currentTime = normalizedX * duration;
});
