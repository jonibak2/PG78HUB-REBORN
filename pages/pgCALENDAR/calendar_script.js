let animationsEnabled = false;

const birthdays = [
  { name: "Эристorem", date: "2007-01-16", avatar: "assets/pgCALENDAR/eristorem.png" },
  { name: "Моринок", date: "2007-02-04", avatar: "assets/pgCALENDAR/morinok.png" },
  { name: "Хома", date: "2009-03-23", avatar: "assets/pgCALENDAR/homa.png" },
  { name: "Моди", date: "2007-04-29", avatar: "assets/pgCALENDAR/modie.png" },
  { name: "Пашок", date: "2005-05-07", avatar: "assets/pgCALENDAR/pasha.png" },
  { name: "Энд", date: "2007-05-28", avatar: "assets/pgCALENDAR/fayko.jpg" },
  { name: "Аня", date: "2005-07-04", avatar: "assets/pgCALENDAR/anya.png" },
  { name: "Стасик", date: "2007-07-22", avatar: "assets/pgCALENDAR/nicech.png" },
  { name: "Ника", date: "2007-08-18", avatar: "assets/pgCALENDAR/nika.png" },
  { name: "PG78", date: "2022-09-12", avatar: "assets/pgCALENDAR/pg78.jpg" },
  { name: "Костя", date: "2006-09-26", avatar: "assets/pgCALENDAR/kostya.png" },
  { name: "Ержан", date: "2006-10-19", avatar: "assets/pgCALENDAR/erzhan.png" },
  { name: "Драгоман", date: "2008-10-26", avatar: "assets/pgCALENDAR/dragoman.png" },
  { name: "Андрей", date: "2002-11-01", avatar: "assets/pgCALENDAR/andrew.png" },
  { name: "Жанибек", date: "2006-11-12", avatar: "assets/pgCALENDAR/jonibak.png" },
  { name: "Настя", date: "2007-12-05", avatar: "assets/pgCALENDAR/nastya.png" },
];

const now = new Date();
let currentYear = now.getFullYear();

const months = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

// Прокрутка к нужному дню в календаре и краткая подсветка
function focusOnBirthdayDate(targetDate) {
  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth();
  const targetDay = targetDate.getDate();

  // Если год отличается — переключаем календарь
  if (currentYear !== targetYear) {
    currentYear = targetYear;
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
      yearSpan.textContent = currentYear;
    }
    renderAllCalendars(currentYear);
  }

  // Найти нужный день и подсветить его
  requestAnimationFrame(() => {
    const selector = `.calendar__day[data-year="${targetYear}"][data-month="${targetMonth}"][data-day="${targetDay}"]`;
    const targetEl = document.querySelector(selector);
    if (!targetEl) return;

    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    targetEl.classList.add('calendar__day--highlight');

    setTimeout(() => {
      targetEl.classList.remove('calendar__day--highlight');
    }, 1500);
  });
}

function calculateAge(birthDateStr) {
  const birthDate = new Date(birthDateStr);
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function getNextBirthday(birthDateStr) {
  const birthDate = new Date(birthDateStr);
  let next = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (next < now) {
    next.setFullYear(now.getFullYear() + 1);
  }
  return next;
}

function daysUntilNextBirthday(dateStr) {
  const next = getNextBirthday(dateStr);
  const diffTime = next - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function renderUpcoming() {
  const upcomingList = document.getElementById('upcoming-list');
  upcomingList.innerHTML = '';
  const sortedBirthdays = [...birthdays].sort((a, b) => daysUntilNextBirthday(a.date) - daysUntilNextBirthday(b.date));
  sortedBirthdays.forEach((birthday, index) => {
    const currentAge = calculateAge(birthday.date);
    const nextDate = getNextBirthday(birthday.date);
    const ageOnNext = nextDate.getFullYear() - new Date(birthday.date).getFullYear();
    const daysLeft = daysUntilNextBirthday(birthday.date);
    const daysText = daysLeft === 0 ? 'Сегодня!' : `${daysLeft} дней осталось`;
    const li = document.createElement('li');
    li.className = 'sidebar__list-item';
    li.innerHTML = `
      <img src="${birthday.avatar}" alt="${birthday.name}">
      <div>
        <strong>${birthday.name}</strong>
        <span>Сейчас: ${currentAge} лет</span>
        <span>Будет ${ageOnNext} | ${nextDate.toLocaleDateString('ru-RU')}</span>
        <span>${daysText}</span>
      </div>
    `;
    // клик по аватарке слева — перейти к дню рождения в календаре
    const avatarImg = li.querySelector('img');
    if (avatarImg) {
      avatarImg.style.cursor = 'pointer';
      avatarImg.addEventListener('click', () => {
        const nextDateForThis = getNextBirthday(birthday.date);
        focusOnBirthdayDate(nextDateForThis);
      });
    }
    // staggered reveal (только после прелоадера)
    if (animationsEnabled) {
      li.classList.add('will-fade-in');
      li.style.animation = `fadeUp 360ms cubic-bezier(.2,.9,.2,1) ${index * 70}ms both`;
    }

    upcomingList.appendChild(li);
  });
}

function renderSingleCalendar(year, month) {
  const calendarContainer = document.createElement('div');
  calendarContainer.classList.add('calendar-card');
  // keep lightweight inline fallbacks for older browsers
  calendarContainer.style.width = '100%';

  const today = now;
  if (year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth())) {
    calendarContainer.classList.add('calendar__month--past');
  } else if (year === today.getFullYear() && month === today.getMonth()) {
    calendarContainer.classList.add('calendar__month--current');
  }

  const title = document.createElement('div');
  title.style.fontWeight = 'bold';
  title.style.fontSize = '1.2rem';
  title.style.marginBottom = '0.5rem';
  title.textContent = `${months[month]}`;
  calendarContainer.appendChild(title);

  const lastDay = new Date(year, month + 1, 0).getDate();
  let dayNum = 1;
  const monthInner = document.createElement('div');
  monthInner.className = 'calendar__month-inner';
  // небольшая анимация появления месяцев только после прелоадера
  if (animationsEnabled) {
    calendarContainer.style.opacity = 0;
    calendarContainer.style.animation = `fadeUp 420ms cubic-bezier(.2,.9,.2,1) ${month * 36}ms both`;
    monthInner.style.animation = `fadeUp 360ms cubic-bezier(.2,.9,.2,1) ${month * 36 + 60}ms both`;
  }
  while (dayNum <= lastDay) {
    const week = document.createElement('section');
    week.className = 'calendar__week';
    for (let i = 0; i < 7 && dayNum <= lastDay; i++) {
      const day = document.createElement('div');
      day.className = 'calendar__day';
      const currentDate = new Date(year, month, dayNum);
      // Для перехода из списка "Ближайшие дни рождения"
      day.dataset.year = String(year);
      day.dataset.month = String(month);
      day.dataset.day = String(dayNum);
      const isPast = currentDate < today.setHours(0,0,0,0);
      if (isPast) {
        day.classList.add('calendar__day--past');
      }
      if (year === today.getFullYear() && month === today.getMonth() && dayNum === today.getDate()) {
        day.classList.add('calendar__day--today');
      }

      const dateSpan = document.createElement('span');
      dateSpan.className = 'calendar__date';
      dateSpan.textContent = dayNum;

      const dateAvatarWrap = document.createElement('div');
      dateAvatarWrap.className = 'calendar__date-avatar-wrap';
      dateAvatarWrap.appendChild(dateSpan);

      const birthdaysForDay = birthdays.filter(b => new Date(b.date).getMonth() === month && new Date(b.date).getDate() === dayNum);
      if (birthdaysForDay.length > 0) {
        day.classList.add('birthday');
        const avatarsDiv = document.createElement('div');
        avatarsDiv.className = 'calendar__avatars-on-date';
        birthdaysForDay.forEach(bd => {
          const avatar = document.createElement('img');
          avatar.src = bd.avatar;
          avatar.alt = bd.name;
          avatar.title = bd.name;
          avatarsDiv.appendChild(avatar);
        });
        dateAvatarWrap.appendChild(avatarsDiv);
        day.addEventListener('click', () => {
          showBirthdayPopup(birthdaysForDay, currentDate);
        });
      }

      day.appendChild(dateAvatarWrap);
      week.appendChild(day);
      dayNum++;
    }
    for (let i = week.children.length; i < 7; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar__day';
      emptyDay.style.visibility = 'hidden';
      week.appendChild(emptyDay);
    }
    monthInner.appendChild(week);
  }
  // Ensure each month displays exactly 6 weeks so tiles stay consistent height
  while (monthInner.children.length < 6) {
    const emptyWeek = document.createElement('section');
    emptyWeek.className = 'calendar__week';
    for (let i = 0; i < 7; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar__day';
      emptyDay.style.visibility = 'hidden';
      emptyWeek.appendChild(emptyDay);
    }
    monthInner.appendChild(emptyWeek);
  }
  calendarContainer.appendChild(monthInner);
  return calendarContainer;
}

function renderAllCalendars(year) {
  const allCalendarsDiv = document.getElementById('all-calendars');
  allCalendarsDiv.innerHTML = '';
  for (let m = 0; m < 12; m++) {
    allCalendarsDiv.appendChild(renderSingleCalendar(year, m));
  }
}

function showBirthdayPopup(birthdays, selectedDate) {
  const popup = document.getElementById('birthday-popup');
  const overlay = document.getElementById('overlay');
  const content = document.getElementById('popup-content');

  content.innerHTML = `
    <h3>🎉 День рождения!</h3>
    ${birthdays.map(birthday => {
      const birthDate = new Date(birthday.date);
      const ageOnThatDay = selectedDate.getFullYear() - birthDate.getFullYear();
      const currentAge = calculateAge(birthday.date);
      let phrase;
      if (selectedDate.getFullYear() === now.getFullYear() &&
          selectedDate.getMonth() === now.getMonth() &&
          selectedDate.getDate() === now.getDate()) {
        phrase = `Исполняется ${ageOnThatDay} лет сегодня`;
      } else if (selectedDate > now) {
        phrase = `Исполнится ${ageOnThatDay} лет`;
      } else {
        phrase = `Исполнилось ${ageOnThatDay} лет`;
      }
      return `
        <div style="display: flex; align-items: center; gap: 1rem; margin: 1rem 0; padding: 1rem; background: rgba(255, 107, 107, 0.1); border-radius: 8px;">
          <img src="${birthday.avatar}" alt="${birthday.name}" class="profile-avatar" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; cursor: pointer;">
          <div>
            <strong>${birthday.name}</strong><br>
            ${phrase}<br>
            Сейчас: ${currentAge} лет
          </div>
        </div>
      `;
    }).join('')}
  `;

  // ensure popup is placed inside overlay so centering works reliably
  if (overlay && popup && !overlay.contains(popup)) {
    overlay.appendChild(popup);
  }
  overlay.classList.add('show');
  popup.classList.add('show');

  // Add hover event listeners to avatars
  const avatars = content.querySelectorAll('.profile-avatar');
  avatars.forEach(avatar => {
    avatar.addEventListener('mouseenter', showAvatarZoom);
    avatar.addEventListener('mouseleave', hideAvatarZoom);
  });
}

function showAvatarZoom(event) {
  const avatar = event.target;
  const avatarSrc = avatar.src;
  const avatarName = avatar.alt;
  const rect = avatar.getBoundingClientRect();

  let zoomContainer = document.getElementById('avatar-zoom-container');
  if (!zoomContainer) {
    zoomContainer = document.createElement('div');
    zoomContainer.id = 'avatar-zoom-container';
    document.body.appendChild(zoomContainer);
  }

  zoomContainer.innerHTML = `
    <img src="${avatarSrc}" alt="${avatarName}" class="avatar-zoom-image">
  `;
  zoomContainer.classList.add('show');

  // Position near cursor but within viewport
  zoomContainer.style.left = (rect.left + rect.width / 2) + 'px';
  zoomContainer.style.top = (rect.top - 20) + 'px';
}

function hideAvatarZoom() {
  const zoomContainer = document.getElementById('avatar-zoom-container');
  if (zoomContainer) {
    zoomContainer.classList.remove('show');
  }
}

function closePopup() {
  document.getElementById('birthday-popup').classList.remove('show');
  document.getElementById('overlay').classList.remove('show');
}

// Event listeners
document.getElementById('close-popup').addEventListener('click', closePopup);
document.getElementById('overlay').addEventListener('click', closePopup);
document.getElementById('prev-year').addEventListener('click', () => {
  currentYear--;
  document.getElementById('current-year').textContent = currentYear;
  renderAllCalendars(currentYear);
});
document.getElementById('next-year').addEventListener('click', () => {
  currentYear++;
  document.getElementById('current-year').textContent = currentYear;
  renderAllCalendars(currentYear);
});

// Функция для загрузки всех изображений
function preloadAllMedia() {
  const images = document.querySelectorAll("img");
  const allMedia = [...images];
  
  let loadedCount = 0;
  const totalCount = allMedia.length;
  
  if (totalCount === 0) {
    hideLoader();
    return;
  }
  
  const updateProgress = () => {
    const progress = (loadedCount / totalCount) * 100;
    const progressBar = document.querySelector(".loader-progress");
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  };
  
  allMedia.forEach(media => {
    if (media.complete) {
      loadedCount++;
      updateProgress();
      checkComplete();
    } else {
      media.addEventListener("load", () => {
        loadedCount++;
        updateProgress();
        checkComplete();
      });
      media.addEventListener("error", () => {
        loadedCount++;
        updateProgress();
        checkComplete();
      });
    }
  });
  
  function checkComplete() {
    if (loadedCount >= totalCount) {
      // Минимальное время показа загрузки для плавности
      setTimeout(() => {
        hideLoader();
      }, 500);
    }
  }
  
  // Таймаут на случай, если что-то не загрузится
  setTimeout(() => {
    if (loadedCount < totalCount) {
      hideLoader();
    }
  }, 10000);
}

function hideLoader() {
  const loader = document.getElementById('calendar-loader');
  const content = document.getElementById('calendar-page-content');
  
  animationsEnabled = true;

  if (loader) {
    loader.style.display = 'none';
  }
  if (content) {
    content.style.display = 'block';
  }

  // перерисуем с включёнными анимациями для первого показа
  renderAllCalendars(currentYear);
  renderUpcoming();
  
  window.scrollTo(0, 0);
}

// Initialization + прелоадер только для календаря
document.addEventListener('DOMContentLoaded', () => {
  // отрисовываем данные заранее, но анимации включим только после прелоадера
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = currentYear;
  }
  renderAllCalendars(currentYear);
  renderUpcoming();

  // Инициализируем прогресс-бар
  const progressBar = document.querySelector(".loader-progress");
  if (progressBar) {
    progressBar.style.width = "0";
    progressBar.style.animation = "none";
  }
});

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
  // Начинаем загрузку всех медиа-файлов
  preloadAllMedia();
});

