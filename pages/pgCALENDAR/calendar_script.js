const birthdays = [
  { name: "Эристorem", date: "2007-01-16", avatar: "assets/pgCalendar/eristorem.png" },
  { name: "Моринок", date: "2007-02-04", avatar: "assets/pgCalendar/morinok.png" },
  { name: "Хома", date: "2009-03-23", avatar: "assets/pgCalendar/homa.png" },
  { name: "Моди", date: "2007-04-29", avatar: "assets/pgCalendar/modie.png" },
  { name: "Пашок", date: "2005-05-07", avatar: "assets/pgCalendar/pasha.png" },
  { name: "Энд", date: "2007-05-28", avatar: "assets/pgCalendar/fayko.png" },
  { name: "Аня", date: "2005-07-04", avatar: "assets/pgCalendar/anya.png" },
  { name: "Стасик", date: "2007-07-22", avatar: "assets/pgCalendar/nicech.png" },
  { name: "Ника", date: "2007-08-18", avatar: "assets/pgCalendar/nika.png" },
  { name: "PG78", date: "2022-09-12", avatar: "assets/pgCalendar/pg78.png" },
  { name: "Костя", date: "2006-09-26", avatar: "assets/pgCalendar/kostya.png" },
  { name: "Ержан", date: "2006-10-19", avatar: "assets/pgCalendar/erzhan.png" },
  { name: "Драгоман", date: "2008-10-26", avatar: "assets/pgCalendar/dragoman.png" },
  { name: "Андрей", date: "2002-11-01", avatar: "assets/pgCalendar/andrew.png" },
  { name: "Жанибек", date: "2006-11-12", avatar: "assets/pgCalendar/jonibak.png" },
];

const now = new Date(2025, 11, 10); // December 10, 2025
let currentYear = now.getFullYear();

const months = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

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
  sortedBirthdays.forEach(birthday => {
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
    upcomingList.appendChild(li);
  });
}

function renderSingleCalendar(year, month) {
  const calendarContainer = document.createElement('div');
  calendarContainer.style.boxShadow = '5px 5px 32px rgba(30, 46, 50, 0.15)';
  calendarContainer.style.borderRadius = '12px';
  calendarContainer.style.padding = '1.5rem';
  calendarContainer.style.width = '100%';
  calendarContainer.style.display = 'flex';
  calendarContainer.style.flexDirection = 'column';
  calendarContainer.style.alignItems = 'center';

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
  while (dayNum <= lastDay) {
    const week = document.createElement('section');
    week.className = 'calendar__week';
    for (let i = 0; i < 7 && dayNum <= lastDay; i++) {
      const day = document.createElement('div');
      day.className = 'calendar__day';
      const currentDate = new Date(year, month, dayNum);
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
          <img src="${birthday.avatar}" alt="${birthday.name}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
          <div>
            <strong>${birthday.name}</strong><br>
            ${phrase}<br>
            Сейчас: ${currentAge} лет
          </div>
        </div>
      `;
    }).join('')}
  `;

  popup.classList.add('show');
  overlay.classList.add('show');
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

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('current-year').textContent = currentYear;
  renderAllCalendars(currentYear);
  renderUpcoming();
});
