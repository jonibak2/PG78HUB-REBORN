/* SPOTLIGHT */
document.addEventListener("mousemove", e => {
  document.querySelectorAll(".spotlight").forEach((s, i) => {
    s.style.left = e.clientX - 200 + i * 60 + "px";
    s.style.top  = e.clientY - 200 + i * 60 + "px";
  });
});

/* STAGGER ANIMATION */
const cards = document.querySelectorAll(".nomination-card");
const videos = document.querySelectorAll(".video-card, .highlight-video");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.2 });

cards.forEach((card, i) => {
  card.style.transitionDelay = `${i * 70}ms`;
  observer.observe(card);
});

videos.forEach(v => observer.observe(v));

let animationsEnabled = false;

window.addEventListener("load", () => {
  const loader = document.getElementById("page-loader");
  const content = document.getElementById("page-content");

  // Скролл в самый верх при загрузке
  window.scrollTo(0, 0);

  setTimeout(() => {
    animationsEnabled = true;

    if (loader) loader.style.display = "none";
    if (content) content.style.display = "block";
    
    // Ещё раз скролл вверх после показа контента
    window.scrollTo(0, 0);

  }, 1500);
});

/* Скролл вверх при загрузке страницы */
document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0);
});

/* YOUTUBE PREVIEW CLICK HANDLER */
document.addEventListener("DOMContentLoaded", () => {
  const youtubePreviews = document.querySelectorAll(".youtube-preview");
  
  youtubePreviews.forEach(preview => {
    preview.addEventListener("click", () => {
      const youtubeUrl = preview.getAttribute("data-youtube-url");
      if (!youtubeUrl) return;
      
      const loader = document.getElementById("page-loader");
      const content = document.getElementById("page-content");
      const progressBar = loader?.querySelector(".loader-progress");
      
      // Сбрасываем анимацию прогресс-бара
      if (progressBar) {
        progressBar.style.width = "0";
        progressBar.style.animation = "none";
        requestAnimationFrame(() => {
          progressBar.style.animation = "loaderProgress 1.5s linear forwards";
        });
      }
      
      // Плавно показываем лоадер
      if (loader) {
        loader.style.display = "flex";
        loader.style.opacity = "0";
        requestAnimationFrame(() => {
          loader.style.transition = "opacity 0.3s ease";
          loader.style.opacity = "1";
        });
      }
      
      // Скрываем контент
      if (content) {
        content.style.transition = "opacity 0.3s ease";
        content.style.opacity = "0";
      }
      
      // После окончания загрузки редиректим
      setTimeout(() => {
        window.location.href = youtubeUrl;
      }, 1500);
    });
  });
});