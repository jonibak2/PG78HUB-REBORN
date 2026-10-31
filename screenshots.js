(() => {
  const carousel = document.querySelector('#screenshots');
  const image = document.querySelector('#screenshot-image');
  const link = document.querySelector('#screenshot-link');
  const counter = document.querySelector('#screenshot-count');
  const status = document.querySelector('#screenshot-status');
  if (!carousel || !screenshotFiles.length) return;
  let index = 0;
  let touchStart = null;
  let suppressClick = false;

  function show(position) {
    index = (position + screenshotFiles.length) % screenshotFiles.length;
    const source = `assets/screenshots/${encodeURIComponent(screenshotFiles[index])}`;
    status.textContent = '';
    image.alt = `Скриншот ${index + 1} из ${screenshotFiles.length}`;
    image.src = source;
    link.href = source;
    counter.textContent = `${index + 1} / ${screenshotFiles.length}`;
  }

  document.querySelector('#screenshot-prev').addEventListener('click', () => show(index - 1));
  document.querySelector('#screenshot-next').addEventListener('click', () => show(index + 1));
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  link.addEventListener('touchstart', event => {
    suppressClick = false;
    const touch = event.changedTouches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  link.addEventListener('touchend', event => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      suppressClick = true;
      show(index + (dx < 0 ? 1 : -1));
    }
    touchStart = null;
  }, { passive: true });
  link.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
  link.addEventListener('click', event => {
    if (suppressClick) { event.preventDefault(); suppressClick = false; }
  });
  image.addEventListener('error', () => { status.textContent = 'Не удалось загрузить скриншот. Попробуй следующий.'; });
  show(Math.floor(Math.random() * screenshotFiles.length));
})();
