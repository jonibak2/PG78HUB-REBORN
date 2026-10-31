const get = id => document.getElementById(id);
let selectedYear = '25';
let returnFocus = null;
const overlay = get('award-overlay');

function closeImage() {
  overlay.hidden = true;
  document.body.classList.remove('award-dialog-open');
  returnFocus?.focus();
}

function prepareCards(root) {
  root.querySelectorAll('.featured-card, .nomination-card').forEach(card => {
    const image = card.querySelector('img');
    if (!image) return;
    image.loading = 'lazy';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'award-image-button';
    button.setAttribute('aria-label', `Открыть: ${image.alt}`);
    image.replaceWith(button);
    button.append(image);
    button.addEventListener('click', () => {
      returnFocus = button;
      get('image-title').textContent = image.alt;
      get('award-full-image').src = image.src;
      get('award-full-image').alt = image.alt;
      overlay.hidden = false;
      document.body.classList.add('award-dialog-open');
      get('image-close').focus();
    });
  });
}

function playerMarkup(src, label) {
  return `<div class="retro-player" aria-label="${label}"><div class="retro-screen"><video preload="metadata" playsinline aria-label="${label}"><source src="${src}" type="video/mp4"></video></div><div class="retro-controls"><button type="button" class="retro-control retro-toggle" aria-label="Воспроизвести"></button><input class="retro-progress" type="range" min="0" max="1000" value="0" aria-label="Перемотка"><span class="retro-time">0:00 / 0:00</span><label class="retro-volume">VOL <input type="range" min="0" max="100" value="70" aria-label="Громкость"></label><button class="retro-control retro-fullscreen" type="button" aria-label="На весь экран"></button></div></div>`;
}

function setupVideo(root) {
  const player = root.querySelector('.retro-player');
  const video = player.querySelector('video');
  const toggle = player.querySelector('.retro-toggle');
  const progress = player.querySelector('.retro-progress');
  const volume = player.querySelector('.retro-volume input');
  const time = player.querySelector('.retro-time');
  const full = player.querySelector('.retro-fullscreen');
  const format = value => `${Math.floor((value || 0) / 60)}:${String(Math.floor((value || 0) % 60)).padStart(2, '0')}`;
  const update = () => {
    time.textContent = `${format(video.currentTime)} / ${format(video.duration)}`;
    progress.value = Number.isFinite(video.duration) && video.duration > 0 ? video.currentTime / video.duration * 1000 : 0;
    toggle.classList.toggle('is-playing', !video.paused);
    toggle.setAttribute('aria-label', video.paused ? 'Воспроизвести' : 'Пауза');
  };
  const play = async () => { if (video.paused) { try { await video.play(); } catch { toggle.setAttribute('aria-label', 'Повторить воспроизведение'); } } else video.pause(); };
  toggle.addEventListener('click', play);
  video.addEventListener('click', play);
  ['timeupdate', 'loadedmetadata', 'play', 'pause', 'ended'].forEach(event => video.addEventListener(event, update));
  progress.addEventListener('input', () => { if (Number.isFinite(video.duration)) video.currentTime = progress.value / 1000 * video.duration; });
  video.volume = .7;
  volume.addEventListener('input', () => { video.volume = volume.value / 100; });
  full.addEventListener('click', async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await player.requestFullscreen(); } catch { /* Browser may not support fullscreen. */ }
  });
}

function renderYear(year) {
  if (!['23', '24', '25'].includes(year)) year = '25';
  document.querySelectorAll('.awards-main video').forEach(video => video.pause());
  selectedYear = year;
  document.querySelectorAll('[data-year]').forEach(button => {
    const active = button.dataset.year === year;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  get('year-mark').replaceChildren();
  if (year === '23') {
    const title = document.createElement('strong');
    title.textContent = 'PGA23';
    get('year-mark').append(title);
  } else {
    const logo = document.createElement('img');
    logo.src = year === '24' ? 'assets/logos/pgA24-transparent.png' : `assets/logos/pgA${year}.png`;
    logo.alt = `PGA${year}`;
    get('year-mark').append(logo);
  }
  get('ceremony-title').textContent = `ЦЕРЕМОНИЯ / 20${year}`;
  get('featured-content').innerHTML = featuredContentTemplates[year];
  get('year-content').innerHTML = yearContentTemplates[year];
  prepareCards(get('featured-content'));
  prepareCards(get('year-content'));
  if (year === '23') {
    get('ceremony-content').innerHTML = playerMarkup('assets/pgAWARDS23/happynewyear.mp4', 'Церемония PGA23');
    setupVideo(get('ceremony-content'));
  } else {
    const id = year === '25' ? 'KlwKqslUrGA' : 'pxW-TnZgw5Y';
    get('ceremony-content').innerHTML = `<a class="ceremony-link" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer" aria-label="Смотреть PGA${year} на YouTube"><img src="assets/thumnails/pgA${year}_Thumb.jpg" alt="Церемония PGA${year}"><span>СМОТРЕТЬ НА YOUTUBE »</span></a>`;
  }
  const recapSources = { '23': 'assets/pgAWARDS23/yakakayu.mp4', '24': 'assets/pgAWARDS24/perdez.mp4', '25': 'assets/pgAWARDS25/goda.mp4' };
  get('recap-content').innerHTML = playerMarkup(recapSources[year], `Откат 20${year} года`);
  setupVideo(get('recap-content'));
  document.title = `PGA${year} · Архив PG Awards`;
  const url = new URL(window.location.href);
  url.searchParams.set('year', `20${year}`);
  history.replaceState(null, '', url);
}

document.querySelectorAll('[data-year]').forEach(button => button.addEventListener('click', () => renderYear(button.dataset.year)));
get('image-close').addEventListener('click', closeImage);
overlay.addEventListener('click', event => { if (event.target === overlay) closeImage(); });
document.addEventListener('keydown', event => {
  if (overlay.hidden) return;
  if (event.key === 'Escape') closeImage();
  if (event.key === 'Tab') { event.preventDefault(); get('image-close').focus(); }
});
renderYear((new URLSearchParams(window.location.search).get('year') || '25').slice(-2));
