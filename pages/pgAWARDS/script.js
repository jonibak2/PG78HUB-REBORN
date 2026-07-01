/* ==========================================================================
   PG AWARDS — Script
   1. Sticky header shadow on scroll
   2. Year tab switching (active state + underline)
   3. Countdown placeholder
   4. Smooth scroll (native CSS handles most; JS closes mobile menu on click)
   5. IntersectionObserver reveal-on-scroll
   6. Lazy image loading (progressive swap from data-src)
   7. Mobile menu toggle
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Sticky header shadow ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Year tab switching ---------- */
  const allYearTabs = document.querySelectorAll('.year-tab');
  const heroEyebrow = document.getElementById('heroEyebrow');
  const heroTitle = document.getElementById('heroTitle');
  const featuredTitle = document.getElementById('featuredTitle');
  const categoriesTitle = document.getElementById('categoriesTitle');
  const footerLogo = document.getElementById('footerLogo');
  const featuredContent = document.getElementById('featuredContent');
  const yearContent = document.getElementById('yearContent');
  const topVideoCaption = document.getElementById('topVideoCaption');
  const topVideo = document.getElementById('topVideo');
  const topVideoSource = document.getElementById('topVideoSource');
  const ceremonyTitle = document.getElementById('ceremonyTitle');
  const ceremonyMediaWrap = document.getElementById('ceremonyMediaWrap');

  const yearLabels = {
    23: { eyebrow: '', title: 'PGA23' },
    24: { eyebrow: '', title: 'PGA24' },
    25: { eyebrow: '', title: 'PGA25' },
    26: { eyebrow: '', title: 'PGA26' }
  };

  const featuredContentTemplates = {
    23: `
      <article class="featured-card reveal" style="--delay:0ms">
        <img class="featured-card-img" src="assets/pgAWARDS23/igra_goda.jpg" alt="Игра года" loading="lazy">
        <div class="featured-card-overlay"></div>
        <div class="featured-card-content">
          <h3 class="featured-card-title">Игра года</h3>
        </div>
      </article>

      <article class="featured-card reveal" style="--delay:100ms">
        <img class="featured-card-img" src="assets/pgAWARDS23/chelovek_mem_goda.jpg" alt="Человек-мем года" loading="lazy">
        <div class="featured-card-overlay"></div>
        <div class="featured-card-content">
          <h3 class="featured-card-title">Человек-мем года</h3>
        </div>
      </article>
    `,
    24: `
      <article class="featured-card reveal" style="--delay:0ms">
        <img class="featured-card-img" src="assets/pgAWARDS24/igra.jpg" alt="Игра года" loading="lazy">
        <div class="featured-card-overlay"></div>
        <div class="featured-card-content">
          <h3 class="featured-card-title">Игра года</h3>
        </div>
      </article>

      <article class="featured-card reveal" style="--delay:100ms">
        <img class="featured-card-img" src="assets/pgAWARDS24/meme.jpg" alt="Человек-мем года" loading="lazy">
        <div class="featured-card-overlay"></div>
        <div class="featured-card-content">
          <h3 class="featured-card-title">Человек-мем года</h3>
        </div>
      </article>
    `,
    25: `
      <article class="featured-card reveal pga25-card" style="--delay:0ms">
        <img class="featured-card-img" src="assets/pgAWARDS25/1 dota.jpg" alt="Игра года" loading="lazy">
        <div class="featured-card-overlay"></div>
        <div class="featured-card-content">
          <h3 class="featured-card-title">Игра года</h3>
        </div>
      </article>

      <article class="featured-card reveal pga25-card" style="--delay:100ms">
        <img class="featured-card-img" src="assets/pgAWARDS25/5 pashkadrain memman.jpg" alt="Человек-мем года" loading="lazy">
        <div class="featured-card-overlay"></div>
        <div class="featured-card-content">
          <h3 class="featured-card-title">Человек-мем года</h3>
        </div>
      </article>
    `,
    26: `
      <article class="featured-card reveal" style="--delay:0ms">
        <img class="featured-card-img" src="https://picsum.photos/id/64/800/1200" alt="Крупная номинация 26" loading="lazy">
        <div class="featured-card-overlay"></div>
        <div class="featured-card-content">
          <h3 class="featured-card-title">Номинация 26</h3>
        </div>
      </article>

      <article class="featured-card reveal" style="--delay:100ms">
        <img class="featured-card-img" src="https://picsum.photos/id/1025/800/1200" alt="Крупная номинация 26" loading="lazy">
        <div class="featured-card-overlay"></div>
        <div class="featured-card-content">
          <h3 class="featured-card-title">Номинация 26</h3>
        </div>
      </article>
    `
  };

  const yearContentTemplates = {
    23: `
      <div class="nomination-grid">
        <div class="nomination-card">
          <div class="nomination-title">Долбоёб года</div>
          <img src="assets/pgAWARDS23/dolboeb_goda.jpg" alt="Долбоёб года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Пара года</div>
          <img src="assets/pgAWARDS23/para_goda.jpg" alt="Пара года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Срач года</div>
          <img src="assets/pgAWARDS23/srach_goda.jpg" alt="Срач года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Best glow up года в Доте</div>
          <img src="assets/pgAWARDS23/best_glow_up_dota.jpg" alt="Best glow up года в Доте">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Похуист года</div>
          <img src="assets/pgAWARDS23/pohuist_goda.jpg" alt="Похуист года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Каблук года</div>
          <img src="assets/pgAWARDS23/kabluk_goda.jpg" alt="Каблук года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Нытик года</div>
          <img src="assets/pgAWARDS23/nytik_goda.jpg" alt="Нытик года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Сигма года</div>
          <img src="assets/pgAWARDS23/sigma_goda.jpg" alt="Сигма года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Роботяга года</div>
          <img src="assets/pgAWARDS23/robotyaga_goda.jpg" alt="Роботяга года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Драчун года</div>
          <img src="assets/pgAWARDS23/drachun_goda.jpg" alt="Драчун года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Лучший игрок Дота 2</div>
          <img src="assets/pgAWARDS23/luchshiy_igrok_dota2.jpg" alt="Лучший игрок Дота 2">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Душнила года</div>
          <img src="assets/pgAWARDS23/dushnila_goda.jpg" alt="Душнила года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Певец года</div>
          <img src="assets/pgAWARDS23/pevec_goda.jpg" alt="Певец года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Симп года</div>
          <img src="assets/pgAWARDS23/simp_goda.jpg" alt="Симп года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Либералы года</div>
          <img src="assets/pgAWARDS23/liberaly_goda.jpg" alt="Либералы года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Событие года</div>
          <img src="assets/pgAWARDS23/sobytie_goda.jpg" alt="Событие года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">СЦПшер года</div>
          <img src="assets/pgAWARDS23/scpsher_goda.jpg" alt="СЦПшер года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Флудер года</div>
          <img src="assets/pgAWARDS23/fluder_goda.jpg" alt="Флудер года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Анимешник года</div>
          <img src="assets/pgAWARDS23/animeshnik_goda.jpg" alt="Анимешник года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Байтер года</div>
          <img src="assets/pgAWARDS23/baiter_goda.jpg" alt="Байтер года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Сын ластпика</div>
          <img src="assets/pgAWARDS23/syn_lastpika.jpg" alt="Сын ластпика">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Голая года</div>
          <img src="assets/pgAWARDS23/golaya_goda.jpg" alt="Голая года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Проголосуюзасебя года</div>
          <img src="assets/pgAWARDS23/progolosuyuzasebya_goda.jpg" alt="Проголосуюзасебя года">
        </div>
      </div>
    `,
    24: `
      <div class="nomination-grid">
        <div class="nomination-card">
          <div class="nomination-title">Долбоёб года</div>
          <img src="assets/pgAWARDS24/dolboeb.jpg" alt="Долбоёб года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Похуист года</div>
          <img src="assets/pgAWARDS24/pohuy.jpg" alt="Похуист года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Нытик года</div>
          <img src="assets/pgAWARDS24/nytik.jpg" alt="Нытик года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Сигма года</div>
          <img src="assets/pgAWARDS24/sigma.jpg" alt="Сигма года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Работяга года</div>
          <img src="assets/pgAWARDS24/rabotyaga.jpg" alt="Работяга года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Драчун года</div>
          <img src="assets/pgAWARDS24/drachun.jpg" alt="Драчун года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Душнила года</div>
          <img src="assets/pgAWARDS24/dushnila.jpg" alt="Душnila года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Певец года</div>
          <img src="assets/pgAWARDS24/pevec.jpg" alt="Певец года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Симп года</div>
          <img src="assets/pgAWARDS24/simp.jpg" alt="Симп года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Либерал года</div>
          <img src="assets/pgAWARDS24/liberal.jpg" alt="Либерал года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Событие года</div>
          <img src="assets/pgAWARDS24/sobytie.jpg" alt="Событие года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Флудер года</div>
          <img src="assets/pgAWARDS24/flooder.jpg" alt="Флудер года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Анимешник года</div>
          <img src="assets/pgAWARDS24/animeshnik.jpg" alt="Анимешник года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Байтер года</div>
          <img src="assets/pgAWARDS24/baiter.jpg" alt="Байтер года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Провал года</div>
          <img src="assets/pgAWARDS24/proval.jpg" alt="Провал года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Самая высокая порядочность года</div>
          <img src="assets/pgAWARDS24/poradochnosh.jpg" alt="Самая высокая порядочность года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Диспечер года</div>
          <img src="assets/pgAWARDS24/dispecher.jpg" alt="Диспечер года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Мастер оправданий года</div>
          <img src="assets/pgAWARDS24/oprovdaniya.jpg" alt="Мастер оправданий года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Главный опаздун года</div>
          <img src="assets/pgAWARDS24/opazdun.jpg" alt="Главный опаздун года">
        </div>
        <div class="nomination-card">
          <div class="nomination-title">Нетакуся года</div>
          <img src="assets/pgAWARDS24/netakusya.jpg" alt="Нетакуся года">
        </div>
      </div>
    `,
    25: `
      <div class="nomination-grid pga25-grid">
        <div class="nomination-card pga25-card"><div class="nomination-title">Долбоёб года</div><img src="assets/pgAWARDS25/2 erisorem dolbaeb.jpg" alt="Долбоёб года"></div>
        <div class="nomination-card pga25-card"><div class="nomination-title">Похуист года</div><img src="assets/pgAWARDS25/3 gjl pohuist.jpg" alt="Похуист года"></div>
        <div class="nomination-card pga25-card"><div class="nomination-title">Нытик года</div><img src="assets/pgAWARDS25/4 end nutik.jpg" alt="Нытик года"></div>
        <div class="nomination-card pga25-card"><div class="nomination-title">Работяга года</div><img src="assets/pgAWARDS25/6 lollymclovin workwoman.jpg" alt="Работяга года"></div>
        <div class="nomination-card pga25-card"><div class="nomination-title">Дрочун года</div><img src="assets/pgAWARDS25/7 dragoman drocher.jpg" alt="Дрочун года"></div>
        <div class="nomination-card pga25-card"><div class="nomination-title">Душнила года</div><img src="assets/pgAWARDS25/8 rias dushka.jpg" alt="Душнила года"></div>
        <div class="nomination-card pga25-card"><div class="nomination-title">Сигма года</div><img src="assets/pgAWARDS25/9 rias sigma.jpg" alt="Сигма года"></div>
        <div class="nomination-card pga25-card"><div class="nomination-title">Воздухан года</div><img src="assets/pgAWARDS25/10 end wind.jpg" alt="Воздухан года"></div>
        <div class="nomination-card pga25-card"><div class="nomination-title">Каблук года</div><img src="assets/pgAWARDS25/11 pashkadrain simp.jpg" alt="Каблук года"></div>
        <div class="nomination-card pga25-card"><div class="nomination-title">Либерал года</div><img src="assets/pgAWARDS25/12 jonibak liberal.jpg" alt="Либерал года"></div>
        <div class="nomination-card pga25-card"><div class="nomination-title">Событие года</div><img src="assets/pgAWARDS25/13 warshaw meet.jpg" alt="Событие года"></div>
        <div class="nomination-card pga25-card"><div class="nomination-title">Флудер года</div><img src="assets/pgAWARDS25/14 flood igortyan.jpg" alt="Флудер года"></div>
        <div class="nomination-card pga25-card"><div class="nomination-title">Анимешник года</div><img src="assets/pgAWARDS25/15 jonibak animeboy.jpg" alt="Анимешник года"></div>
        <div class="nomination-card pga25-card"><div class="nomination-title">Фейл года</div><img src="assets/pgAWARDS25/16 jonibak proeb.jpg" alt="Фейл года"></div>
        <div class="nomination-card pga25-card"><div class="nomination-title">Самая высокая порядочность года</div><img src="assets/pgAWARDS25/17 nici poryada.jpg" alt="Самая высокая порядочность года"></div>
        <div class="nomination-card pga25-card"><div class="nomination-title">Байтер года</div><img src="assets/pgAWARDS25/18 dragoman ragebaiter.jpg" alt="Байтер года"></div>
        <div class="nomination-card pga25-card"><div class="nomination-title">Диспечер года</div><img src="assets/pgAWARDS25/20 dispetcher modie.jpg" alt="Диспечер года"></div>
        <div class="nomination-card pga25-card"><div class="nomination-title">Мастер оправданий года</div><img src="assets/pgAWARDS25/21 opravdan end.jpg" alt="Мастер оправданий года"></div>
        <div class="nomination-card pga25-card"><div class="nomination-title">Опаздун года</div><img src="assets/pgAWARDS25/22 opazdun end.jpg" alt="Опаздун года"></div>
        <div class="nomination-card pga25-card"><div class="nomination-title">Нетакуся года</div><img src="assets/pgAWARDS25/23 nietakusya nice.jpg" alt="Нетакуся года"></div>
        <div class="nomination-card pga25-card"><div class="nomination-title">Стиль года</div><img src="assets/pgAWARDS25/24 style nice.jpg" alt="Стиль года"></div>
      </div>
    `,
    26: `
      <div class="nomination-grid">
        <div class="nomination-card"><div class="nomination-title">Номинация 26</div><img src="https://picsum.photos/id/64/800/1200" alt="Номинация 26"></div>
        <div class="nomination-card"><div class="nomination-title">Номинация 26</div><img src="https://picsum.photos/id/1025/800/1200" alt="Номинация 26"></div>
        <div class="nomination-card"><div class="nomination-title">Номинация 26</div><img src="https://picsum.photos/id/1011/800/1200" alt="Номинация 26"></div>
        <div class="nomination-card"><div class="nomination-title">Номинация 26</div><img src="https://picsum.photos/id/1005/800/1200" alt="Номинация 26"></div>
      </div>
    `
  };

  let transitionActive = false;

  function showTransition(callback){
    if (transitionActive) return;
    transitionActive = true;

    const darkOverlay = document.createElement('div');
    darkOverlay.style.cssText = 'position:fixed; inset:0; width:100%; height:100%; background:rgba(0,0,0,0.72); z-index:9998; pointer-events:none;';
    document.body.appendChild(darkOverlay);

    const overlay = document.createElement('iframe');
    overlay.src = 'test.html';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText = 'position:fixed; inset:0; width:100%; height:100%; border:0; background:transparent; z-index:9999; pointer-events:none;';
    document.body.appendChild(overlay);

    setTimeout(() => {
      if (callback) callback();
    }, 750);

    setTimeout(() => {
      overlay.remove();
      darkOverlay.remove();
      transitionActive = false;
    }, 1500);
  }

  function updateYearUI(year){
    const data = yearLabels[year] || yearLabels[23];
    if (heroEyebrow) heroEyebrow.textContent = data.eyebrow;
    if (heroTitle) {
      if (year === '24') {
        heroTitle.innerHTML = '<img src="assets/logos/pgA24.png" alt="PGA24" class="hero-logo">';
      } else if (year === '25') {
        heroTitle.innerHTML = '<img src="assets/logos/pgA25.png" alt="PGA25" class="hero-logo">';
      } else {
        heroTitle.textContent = data.title;
      }
    }
    if (featuredTitle) featuredTitle.textContent = 'Номинации';
    if (categoriesTitle) categoriesTitle.textContent = 'Номинации';
    if (footerLogo) footerLogo.textContent = data.title;
    if (featuredContent) featuredContent.innerHTML = featuredContentTemplates[year] || featuredContentTemplates[23];
    if (yearContent) yearContent.innerHTML = yearContentTemplates[year] || yearContentTemplates[23];

    // Reveal any newly-inserted elements that use the `.reveal` helper
    setTimeout(() => {
      try {
        const newly = [];
        if (featuredContent) newly.push(...featuredContent.querySelectorAll('.reveal'));
        if (yearContent) newly.push(...yearContent.querySelectorAll('.reveal'));
        newly.forEach(el => el.classList.add('is-visible'));
      } catch (err) { /* ignore */ }
    }, 60);

    if (topVideoCaption) topVideoCaption.textContent = 'Откат года';
    if (topVideoSource && topVideo) {
      const topSrc = year === '24'
        ? 'assets/pgAWARDS24/perdez.mp4'
        : year === '25'
          ? 'assets/pgAWARDS25/goda.mp4'
          : 'assets/pgAWARDS23/yakakayu.mp4';
      topVideoSource.setAttribute('src', topSrc);
      topVideo.load();
    }

    if (ceremonyTitle && ceremonyMediaWrap) {
      if (year === '24') {
        ceremonyTitle.textContent = '💔🩸💔';
        ceremonyMediaWrap.innerHTML = `
          <a href="https://www.youtube.com/watch?v=pxW-TnZgw5Y" target="_blank" rel="noreferrer">
            <img src="assets/pgAWARDS24/maxresdefault.jpg" alt="Нарезка клипов" style="width:100%; height:100%; object-fit:cover; display:block;">
          </a>
        `;
      } else if (year === '25') {
        ceremonyTitle.textContent = '🎭🎭🎭';
        ceremonyMediaWrap.innerHTML = `
          <a href="https://www.youtube.com/watch?v=KlwKqslUrGA" target="_blank" rel="noreferrer">
            <img src="assets/thumnails/pgA25_Thumb.jpg" alt="Видео церемонии PGA25" style="width:100%; height:100%; object-fit:cover; display:block;">
          </a>
        `;
      } else {
        ceremonyTitle.textContent = '💖🖤💖';
        ceremonyMediaWrap.innerHTML = `
          <video class="movie-player" controls preload="metadata" playsinline>
            <source src="assets/pgAWARDS23/happynewyear.mp4" type="video/mp4">
          </video>
        `;
      }
    }

    document.title = `${data.title} — Голосование`;
  }

  updateYearUI('25');

  allYearTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const year = tab.dataset.year;
      if (year === '26' || transitionActive) return;
      showTransition(() => {
        allYearTabs.forEach(t => {
          t.classList.toggle('active', t.dataset.year === year);
        });
        updateYearUI(year);
      });
    });
  });

  allYearTabs.forEach(tab => {
    if (tab.dataset.year === '25') {
      tab.classList.add('active');
    }
  });

  /* ---------- 3. Close mobile menu on nav click ---------- */
  const mobileNav = document.getElementById('mobileNav');
  const menuToggle = document.getElementById('menuToggle');

  function closeMobileMenu(){
    mobileNav.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  mobileNav.querySelectorAll('a, button').forEach(item => {
    item.addEventListener('click', closeMobileMenu);
  });

  /* ---------- 5. IntersectionObserver reveal-on-scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window){
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(elToReveal => revealObserver.observe(elToReveal));
  } else {
    // Fallback: no IO support — just show everything.
    revealEls.forEach(elToReveal => elToReveal.classList.add('is-visible'));
  }

  /* ---------- 6. Lazy image loading ---------- */
  // Images use data-src so we can control exactly when they load,
  // independent of the native loading="lazy" hint (kept as a fallback).
  const lazyImages = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window){
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px' });

    lazyImages.forEach(img => imgObserver.observe(img));
  } else {
    lazyImages.forEach(img => { img.src = img.dataset.src; });
  }

  /* ---------- 7. Mobile menu toggle ---------- */
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* ---------- Card interaction ---------- */
  document.querySelectorAll('.featured-card, .category-card').forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.98)';
      setTimeout(() => { card.style.transform = ''; }, 150);
    });
  });

});
