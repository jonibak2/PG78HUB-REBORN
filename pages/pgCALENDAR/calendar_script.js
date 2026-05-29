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

// Функции для управления уведомлениями
const NOTIFICATION_DB = 'birthday_notifications';
const NOTIFICATION_STORE = 'scheduled_notifications';

function openNotificationDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(NOTIFICATION_DB, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(NOTIFICATION_STORE)) {
        const store = db.createObjectStore(NOTIFICATION_STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('personName', 'personName', { unique: false });
        store.createIndex('scheduledTime', 'scheduledTime', { unique: false });
      }
    };
  });
}

async function scheduleNotifications(personName, birthDate, avatar) {
  try {
    const db = await openNotificationDB();
    const transaction = db.transaction([NOTIFICATION_STORE], 'readwrite');
    const store = transaction.objectStore(NOTIFICATION_STORE);

    // Удаляем старые уведомления для этого человека
    const index = store.index('personName');
    const range = IDBKeyRange.only(personName);
    const getAllRequest = index.getAll(range);
    
    getAllRequest.onsuccess = () => {
      getAllRequest.result.forEach(notification => {
        store.delete(notification.id);
      });
    };

    const birthDateObj = new Date(birthDate);
    const nextBirthday = getNextBirthday(birthDate);
    
    // Расписание уведомлений: за 7 дней, за 2 дня, за 1 день и в сам день (2 раза)
    const notificationSchedules = [
      { days: 7, time: '15:00', label: 'За неделю до дня рождения' },
      { days: 2, time: '15:00', label: 'За два дня до дня рождения' },
      { days: 1, time: '15:00', label: 'За день до дня рождения' },
      { days: 0, time: '00:00', label: 'День рождения (полночь)' },
      { days: 0, time: '15:00', label: 'День рождения (15:00)' }
    ];

    notificationSchedules.forEach(schedule => {
      const notificationDate = new Date(nextBirthday);
      notificationDate.setDate(notificationDate.getDate() - schedule.days);
      const [hours, minutes] = schedule.time.split(':');
      notificationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      if (notificationDate > new Date()) {
        const notification = {
          personName: personName,
          title: `🎂 ${personName}`,
          body: schedule.label,
          scheduledTime: notificationDate.toISOString(),
          icon: avatar,
          tag: `${personName}-${schedule.days}-${schedule.time}`,
          sent: false
        };

        store.add(notification);
      }
    });

    db.close();
    return true;
  } catch (error) {
    console.error('Ошибка при планировании уведомлений:', error);
    return false;
  }
}

async function isNotificationEnabled(personName) {
  try {
    const db = await openNotificationDB();
    const transaction = db.transaction([NOTIFICATION_STORE], 'readonly');
    const store = transaction.objectStore(NOTIFICATION_STORE);
    const index = store.index('personName');
    const range = IDBKeyRange.only(personName);
    
    return new Promise((resolve) => {
      const request = index.getAll(range);
      request.onsuccess = () => {
        db.close();
        resolve(request.result.length > 0);
      };
      request.onerror = () => {
        db.close();
        resolve(false);
      };
    });
  } catch (error) {
    console.error('Ошибка при проверке уведомлений:', error);
    return false;
  }
}

async function disableNotifications(personName) {
  try {
    const db = await openNotificationDB();
    const transaction = db.transaction([NOTIFICATION_STORE], 'readwrite');
    const store = transaction.objectStore(NOTIFICATION_STORE);
    const index = store.index('personName');
    const range = IDBKeyRange.only(personName);
    const getAllRequest = index.getAll(range);
    
    getAllRequest.onsuccess = () => {
      getAllRequest.result.forEach(notification => {
        store.delete(notification.id);
      });
    };

    db.close();
    return true;
  } catch (error) {
    console.error('Ошибка при отключении уведомлений:', error);
    return false;
  }
}

async function showBirthdayPopup(birthdays, selectedDate) {
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
        <div style="display: flex; flex-direction: column; gap: 1rem; margin: 1rem 0;">
          <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255, 107, 107, 0.1); border-radius: 8px;">
            <img src="${birthday.avatar}" alt="${birthday.name}" class="profile-avatar" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; cursor: pointer;">
            <div>
              <strong>${birthday.name}</strong><br>
              ${phrase}<br>
              Сейчас: ${currentAge} лет
            </div>
          </div>
          <button class="notification-btn" data-name="${birthday.name}" data-date="${birthday.date}" data-avatar="${birthday.avatar}" style="padding: 0.6rem 1rem; background: #ff6b6b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.95rem; font-weight: 500; transition: background 0.2s;">
            🔔 Включить уведомление
          </button>
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

  // Обработчики для кнопок уведомлений
  const notificationBtns = content.querySelectorAll('.notification-btn');
  for (const btn of notificationBtns) {
    const name = btn.dataset.name;
    const isEnabled = await isNotificationEnabled(name);
    
    if (isEnabled) {
      btn.textContent = '✅ Уведомления включены';
      btn.style.background = '#4CAF50';
      btn.disabled = true;
    }
    
    btn.addEventListener('click', async (e) => {
      const personName = e.target.dataset.name;
      const birthDate = e.target.dataset.date;
      const avatar = e.target.dataset.avatar;
      
      const isCurrentlyEnabled = await isNotificationEnabled(personName);
      
      if (isCurrentlyEnabled) {
        await disableNotifications(personName);
        e.target.textContent = '🔔 Включить уведомление';
        e.target.style.background = '#ff6b6b';
        e.target.disabled = false;
      } else {
        await scheduleNotifications(personName, birthDate, avatar);
        e.target.textContent = '✅ Уведомления включены';
        e.target.style.background = '#4CAF50';
        e.target.disabled = false;
      }
    });
  }
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

// Функция для проверки и отправки уведомлений при открытой странице
async function checkAndSendNotifications() {
  try {
    const db = await openNotificationDB();
    const transaction = db.transaction([NOTIFICATION_STORE], 'readwrite');
    const store = transaction.objectStore(NOTIFICATION_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      const notifications = request.result;
      const now = new Date();

      notifications.forEach(notification => {
        if (!notification.sent) {
          const notifTime = new Date(notification.scheduledTime);
          // Отправляем уведомление если время пришло (с допуском 1 минута)
          if (notifTime <= now) {
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(notification.title, {
                body: notification.body,
                icon: notification.icon,
                badge: 'https://i.imgur.com/1sd499C.png',
                tag: notification.tag
              });
            }

            // Отмечаем как отправленное
            notification.sent = true;
            store.put(notification);
          }
        }
      });

      db.close();
    };

    request.onerror = () => {
      console.error('Ошибка при проверке уведомлений:', request.error);
      db.close();
    };
  } catch (error) {
    console.error('Ошибка при проверке уведомлений:', error);
  }
}

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

// Инициализация Service Worker для уведомлений
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('pages/pgCALENDAR/notification-worker.js').then(registration => {
    console.log('Service Worker зарегистрирован:', registration);
    // Подписываемся на push от backend
    subscribeToPush();
  }).catch(error => {
    console.log('Ошибка при регистрации Service Worker:', error);
  });
}

// ==================== BACKEND INTEGRATION ====================

const BACKEND_URL = 'http://localhost:3000'; // Измените на URL вашего сервера

// Функция для подписки на push уведомления с backend
async function subscribeToPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push не поддерживается');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Получаем публичный VAPID ключ с сервера
    const response = await fetch(`${BACKEND_URL}/api/vapid-public-key`);
    const data = await response.json();
    const publicKey = data.publicKey;

    // Проверяем, не подписаны ли уже
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      console.log('✅ Уже подписаны на push');
      return;
    }

    // Подписываемся на push
    const newSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    });

    console.log('✅ Подписка на push создана');

    // Отправляем подписку на backend
    await fetch(`${BACKEND_URL}/api/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSubscription)
    });

    console.log('✅ Подписка отправлена на сервер');
    showNotificationToast('✓ Связь с сервером установлена');

  } catch (error) {
    console.error('Ошибка при подписке на push:', error);
  }
}

// Функция для конвертации публичного ключа
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Функция для отправки тестового push уведомления с backend
async function sendTestPushFromBackend() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/send-test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (data.success) {
      showNotificationToast(`✓ ${data.message}`);
    } else {
      showNotificationToast(`❌ Ошибка: ${data.error}`);
    }
  } catch (error) {
    console.error('Ошибка при отправке тестового уведомления:', error);
    showNotificationToast('❌ Ошибка подключения к серверу');
  }
}

// Запрос прав на уведомления при загрузке страницы
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

// Обработчик кнопки включения уведомлений
document.addEventListener('DOMContentLoaded', () => {
  const notifyBtn = document.getElementById('enable-notifications-btn');
  if (notifyBtn) {
    if ('Notification' in window) {
      const updateButtonState = () => {
        if (Notification.permission === 'granted') {
          notifyBtn.textContent = '✅ Уведомления разрешены';
          notifyBtn.style.background = '#4CAF50';
          notifyBtn.disabled = true;
          notifyBtn.classList.remove('loading');
          notifyBtn.classList.add('success');
        } else if (Notification.permission === 'denied') {
          notifyBtn.textContent = '❌ Уведомления запрещены';
          notifyBtn.style.background = '#999';
          notifyBtn.disabled = true;
          notifyBtn.classList.remove('loading');
        }
      };

      updateButtonState();

      notifyBtn.addEventListener('click', () => {
        if (Notification.permission === 'default') {
          // Добавляем анимацию загрузки
          notifyBtn.classList.add('loading');
          notifyBtn.disabled = true;
          notifyBtn.textContent = 'Разрешение...';

          Notification.requestPermission().then((permission) => {
            notifyBtn.classList.remove('loading');
            
            if (permission === 'granted') {
              // Показываем уведомление об успехе
              showNotificationToast('Уведомления включены!');
              
              // Небольшая задержка для плавной анимации
              setTimeout(() => {
                updateButtonState();
              }, 300);
            } else {
              updateButtonState();
            }
          });
        }
      });
    } else {
      notifyBtn.textContent = '⚠️ Уведомления не поддерживаются';
      notifyBtn.disabled = true;
    }
  }
});

// Функция для показа toast уведомления
function showNotificationToast(message) {
  const toast = document.createElement('div');
  toast.className = 'notification-toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Убираем toast через 3 секунды
  setTimeout(() => {
    toast.classList.add('fadeOut');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3000);
}

// Функция для отправки тестового уведомления
function sendTestNotification() {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('🧪 Тестовое уведомление PG78', {
      body: 'Это тестовое уведомление. Система уведомлений работает корректно! ✓',
      icon: 'https://i.imgur.com/1sd499C.png',
      badge: 'https://i.imgur.com/1sd499C.png',
      tag: 'test-notification',
      requireInteraction: false
    });
    showNotificationToast('✓ Тестовое уведомление отправлено!');
  } else if ('Notification' in window) {
    showNotificationToast('⚠️ Сначала разрешите уведомления');
  } else {
    showNotificationToast('❌ Уведомления не поддерживаются');
  }
}

// Обработчик для кнопки тестирования
document.addEventListener('DOMContentLoaded', () => {
  const testBtn = document.getElementById('test-notification-btn');
  if (testBtn) {
    testBtn.addEventListener('click', () => {
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          // Пытаемся отправить через backend, если доступен
          sendTestPushFromBackend();
        } else if (Notification.permission === 'default') {
          showNotificationToast('⚠️ Сначала разрешите уведомления');
        } else {
          showNotificationToast('❌ Уведомления заблокированы в браузере');
        }
      }
    });
  }
});

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

  // Проверяем уведомления при загрузке и затем каждую минуту
  checkAndSendNotifications();
  setInterval(checkAndSendNotifications, 60000); // Проверка каждую минуту
});

