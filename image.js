const root = document.getElementById('root');
const progressNode = document.querySelector('.progress');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const scale = window.devicePixelRatio;
canvas.width = window.innerWidth * scale;
canvas.height = window.innerHeight * scale;
ctx.scale(scale, scale);

const state = {
  frames: [], // HTMLImageElement[]
  frameProps: {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  },
  framesLoaded: 0,
};

function runDefaultFrameSet() {
  const framesCount = 17;
  const firstImageId = 1308;
  for (let i = 1; i < framesCount; i++) {
    state.frames.push(createImage(`assets/dehli/IMG_${i + firstImageId}.jpg`));
  }
}

function createImage(src) {
  const img = new Image(500, 700);
  img.src = src;
  img.onload = imageLoaded;
  return img;
}

function imageLoaded() {
  state.framesLoaded++;
  progressNode.style.transform = `scaleX(${state.framesLoaded / state.frames.length})`;
  if (state.framesLoaded === state.frames.length) {
    // Wait until the last animation will finish and hide the progress bar.
    const transitionDuration = 500;
    setTimeout(() => progressNode.style.display = 'none', transitionDuration);
  }

  if (state.framesLoaded === 1) {
    updateFrameBox(this); // this is an Image object
    const { width, height, x, y } = state.frameProps;
    setTimeout(() => ctx.drawImage(this, x, y, width, height), 100);
  }
}

function updateFrameBox(img) {
  // Try to scale for fullscreen.
  // For portrait pictures fit the whole height of the screen and resize width accordingly.
  // For landscape, take the width and resize height accordingly.
  if (img.width > img.height) {
    const part = window.innerWidth / img.width;
    state.frameProps.width = window.innerWidth;
    state.frameProps.height = img.height * part;
  } else {
    const part = window.innerHeight / img.height;
    state.frameProps.width = img.width * part;
    state.frameProps.height = window.innerHeight;
  }
  state.frameProps.x = window.innerWidth / 2 - state.frameProps.width / 2;
  state.frameProps.y = window.innerHeight / 2 - state.frameProps.height / 2;
}

function rewind(e/* MouseEvent */) {
  const { frames, frameProps } = state;
  const { width, height, x, y } = frameProps;
  const currentX = e.touches && e.touches[0].clientX || e.clientX;
  const normalizedX = currentX / window.innerWidth;
  const index = Math.max(0, Math.min(Math.floor(frames.length * normalizedX), frames.length - 1));
  ctx.drawImage(frames[index], x, y, width, height);
}

document.addEventListener('mousemove', rewind);
document.addEventListener('touchmove', rewind);

const fileNode = document.getElementById('file');
fileNode.addEventListener('change', e => {
  state.framesLoaded = 0;
  state.frames = [...fileNode.files].map(f => createImage(URL.createObjectURL(f)));
});


runDefaultFrameSet();
console.log('Accept my love, stranger. This page does not upload your pictures to any servers. Just to the browser to be able to show them.');
console.log('');
console.log('Upload a burst of pictures that you took while moving and rewind by moving your mouse.');
console.log('');
console.log('To load initial set of pictures it took 20MB of your traffic.');
