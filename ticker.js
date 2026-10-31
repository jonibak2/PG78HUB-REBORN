function buildTickers() {
  document.querySelectorAll('.ticker > div').forEach(viewport => {
    const message = viewport.dataset.message || viewport.textContent.trim();
    viewport.dataset.message = message;
    viewport.setAttribute('aria-label', message);

    const track = document.createElement('div');
    track.className = 'ticker-track';
    track.setAttribute('aria-hidden', 'true');
    const copy = document.createElement('span');
    copy.className = 'ticker-copy';
    const unit = message;
    copy.textContent = unit;
    track.append(copy);
    viewport.replaceChildren(track);

    let repeats = 0;
    while (copy.scrollWidth < viewport.clientWidth + 50 && repeats++ < 20) {
      copy.textContent += unit;
    }
    track.append(copy.cloneNode(true));
    track.style.setProperty('--ticker-duration', `${Math.max(16, Math.round(copy.scrollWidth / 35))}s`);
  });
}

buildTickers();
window.addEventListener('resize', buildTickers);
