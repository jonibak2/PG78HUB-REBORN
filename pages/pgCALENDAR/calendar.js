const birthdays = [
  { name: 'Эристorem', date: '2007-01-16', avatar: 'assets/pgCALENDAR/eristorem.png' },
  { name: 'Моринок', date: '2007-02-04', avatar: 'assets/pgCALENDAR/morinok.png' },
  { name: 'Хома', date: '2009-03-23', avatar: 'assets/pgCALENDAR/homa.png' },
  { name: 'Моди', date: '2007-04-29', avatar: 'assets/pgCALENDAR/modie.png' },
  { name: 'Пашок', date: '2005-05-07', avatar: 'assets/pgCALENDAR/pasha.png' },
  { name: 'Энд', date: '2007-05-28', avatar: 'assets/pgCALENDAR/fayko.jpg' },
  { name: 'Аня', date: '2005-07-04', avatar: 'assets/pgCALENDAR/anya.png' },
  { name: 'Стасик', date: '2007-07-22', avatar: 'assets/pgCALENDAR/nicech.png' },
  { name: 'Ника', date: '2007-08-18', avatar: 'assets/pgCALENDAR/nika.png' },
  { name: 'PG78', date: '2022-09-12', avatar: 'assets/pgCALENDAR/pg78.jpg' },
  { name: 'Костя', date: '2006-09-26', avatar: 'assets/pgCALENDAR/kostya.png' },
  { name: 'Ержан', date: '2006-10-19', avatar: 'assets/pgCALENDAR/erzhan.png' },
  { name: 'Драгоман', date: '2008-10-26', avatar: 'assets/pgCALENDAR/dragoman.png' },
  { name: 'Андрей', date: '2002-11-01', avatar: 'assets/pgCALENDAR/andrew.png' },
  { name: 'Жонич', date: '2006-11-12', avatar: 'assets/pgCALENDAR/jonibak.png' },
  { name: 'Настя', date: '2007-12-05', avatar: 'assets/pgCALENDAR/nastya.png' },
].map(person => {
  const [born, month, day] = person.date.split('-').map(Number);
  return { ...person, born, month: month - 1, day };
});

const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const monthForms = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const weekdays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
const seasonIcons = {
  winter: '<path d="M12 2v20M3.3 7l17.4 10M20.7 7 3.3 17M12 2l-2.2 2.2M12 2l2.2 2.2M12 22l-2.2-2.2M12 22l2.2-2.2M3.3 7l3 .5M3.3 7l1 2.8M20.7 17l-3-.5M20.7 17l-1-2.8M20.7 7l-3 .5M20.7 7l-1 2.8M3.3 17l3-.5M3.3 17l1-2.8"/>',
  spring: '<path d="M12 21v-9M12 15c-5 0-8-3-8-9 5 0 8 3 8 9ZM12 12c0-5 3-8 8-9 0 5-3 8-8 9Z"/>',
  summer: '<circle cx="12" cy="12" r="4"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.2 2.2M17.6 17.6l2.2 2.2M19.8 4.2l-2.2 2.2M6.4 17.6l-2.2 2.2"/>',
  autumn: '<path d="M20 4C10 4 5 7 5 14a6 6 0 0 0 6 6c7 0 10-6 9-16ZM4 21c4-7 9-10 15-13"/>',
};
const seasonForMonth = month => month < 2 || month === 11 ? 'winter' : month < 5 ? 'spring' : month < 8 ? 'summer' : 'autumn';
const today = new Date();
const todayYear = today.getFullYear();
let currentYear = todayYear;
let previousFocus = null;

const byId = id => document.getElementById(id);
const dateLabel = person => `${person.day} ${monthForms[person.month]}`;
const dayNumber = (year, month, day) => Math.round(Date.UTC(year, month, day) / 86400000);
const nowNumber = dayNumber(todayYear, today.getMonth(), today.getDate());

function nextBirthday(person) {
  const thisYear = dayNumber(todayYear, person.month, person.day);
  const year = thisYear < nowNumber ? todayYear + 1 : todayYear;
  return { year, days: dayNumber(year, person.month, person.day) - nowNumber };
}

function makeElement(tag, className, value) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (value !== undefined) element.textContent = value;
  return element;
}

function openBirthday(people, year, month, day) {
  previousFocus = document.activeElement;
  byId('dialog-title').textContent = people.length === 1 ? 'День рождения' : 'Дни рождения';
  const content = byId('dialog-content');
  content.replaceChildren(makeElement('p', 'dialog-date', `${day} ${monthForms[month]} ${year}`));
  for (const person of people) {
    const row = makeElement('div', 'dialog-person');
    const image = document.createElement('img');
    image.src = person.avatar;
    image.alt = '';
    const description = document.createElement('div');
    description.append(makeElement('strong', '', person.name));
    description.append(makeElement('small', '', `Исполняется ${year - person.born}`));
    row.append(image, description);
    content.append(row);
  }
  byId('calendar-overlay').hidden = false;
  document.body.classList.add('dialog-open');
  byId('dialog-close').focus();
}

function closeBirthday() {
  byId('calendar-overlay').hidden = true;
  document.body.classList.remove('dialog-open');
  previousFocus?.focus();
}

function renderMonth(month) {
  const season = seasonForMonth(month);
  const card = makeElement('section', `month-card season-${season}`);
  card.id = `month-${month}`;
  card.setAttribute('aria-label', `${months[month]} ${currentYear}`);
  if (currentYear === todayYear && month === today.getMonth()) card.classList.add('current-month');

  const monthPeople = birthdays.filter(person => person.month === month).sort((a, b) => a.day - b.day);
  const title = makeElement('div', 'month-title');
  const monthName = makeElement('div', 'month-name');
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = seasonIcons[season];
  monthName.append(icon, makeElement('strong', '', months[month]));
  title.append(monthName, makeElement('span', 'month-count', monthPeople.length ? `${monthPeople.length} ДАТ${monthPeople.length === 1 ? 'А' : 'Ы'}` : '—'));
  card.append(title);

  const weekdayRow = makeElement('div', 'weekdays');
  weekdayRow.setAttribute('aria-hidden', 'true');
  weekdays.forEach(label => weekdayRow.append(makeElement('span', '', label)));
  card.append(weekdayRow);

  const grid = makeElement('div', 'days-grid');
  const offset = (new Date(currentYear, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
  for (let index = 0; index < totalCells; index++) {
    const day = index - offset + 1;
    if (day < 1 || day > daysInMonth) {
      grid.append(makeElement('span', 'day is-empty'));
      continue;
    }
    const people = monthPeople.filter(person => person.day === day);
    const cell = makeElement(people.length ? 'button' : 'span', 'day', String(day));
    if (index % 7 > 4) cell.classList.add('is-weekend');
    if (currentYear === todayYear && month === today.getMonth() && day === today.getDate()) cell.classList.add('is-today');
    if (people.length) {
      cell.type = 'button';
      cell.id = `birthday-${month + 1}-${day}`;
      cell.classList.add('is-birthday');
      if (people.length > 1) cell.classList.add('has-many');
      cell.setAttribute('aria-label', `${day} ${monthForms[month]}: ${people.map(person => person.name).join(', ')}`);
      const image = document.createElement('img');
      image.src = people[0].avatar;
      image.alt = '';
      image.loading = 'lazy';
      cell.append(image);
      if (people.length > 1) cell.append(makeElement('span', 'day-extra', `+${people.length - 1}`));
      cell.addEventListener('click', () => openBirthday(people, currentYear, month, day));
    }
    grid.append(cell);
  }
  card.append(grid);

  const peopleLine = makeElement('div', 'month-people');
  if (!monthPeople.length) peopleLine.append(makeElement('small', '', 'Нет дней рождения'));
  monthPeople.forEach(person => {
    const button = makeElement('button', '', `${person.day} · ${person.name}`);
    button.type = 'button';
    button.addEventListener('click', () => openBirthday(monthPeople.filter(item => item.day === person.day), currentYear, month, person.day));
    peopleLine.append(button);
  });
  card.append(peopleLine);
  return card;
}

function renderCalendar() {
  byId('current-year').textContent = currentYear;
  byId('birthday-total').textContent = `${birthdays.length} ДАТ`;
  byId('all-calendars').replaceChildren(...months.map((_, index) => renderMonth(index)));
  const jumps = byId('month-jump');
  jumps.replaceChildren();
  months.forEach((month, index) => {
    const link = makeElement('a', '', month.slice(0, 3));
    link.href = `#month-${index}`;
    link.title = month;
    if (currentYear === todayYear && index === today.getMonth()) link.classList.add('is-current');
    jumps.append(link);
  });
}

function focusBirthday(person, year) {
  if (year !== currentYear) {
    currentYear = year;
    renderCalendar();
  }
  const month = byId(`month-${person.month}`);
  month?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const people = birthdays.filter(item => item.month === person.month && item.day === person.day);
  openBirthday(people, year, person.month, person.day);
}

function renderUpcoming() {
  const upcoming = birthdays.map(person => ({ person, ...nextBirthday(person) })).sort((a, b) => a.days - b.days || a.person.name.localeCompare(b.person.name, 'ru'));
  const first = upcoming[0];
  const next = byId('next-birthday');
  const avatar = document.createElement('img');
  avatar.src = first.person.avatar;
  avatar.alt = first.person.name;
  const button = makeElement('button', '', first.days === 0 ? 'Сегодня праздник!' : `Через ${first.days} дн.`);
  button.type = 'button';
  button.addEventListener('click', () => focusBirthday(first.person, first.year));
  next.replaceChildren(avatar, makeElement('strong', '', first.person.name), makeElement('span', '', dateLabel(first.person)), button);

  const list = byId('upcoming-list');
  list.replaceChildren();
  upcoming.slice(0, 8).forEach(({ person, year, days }) => {
    const entry = makeElement('button', 'upcoming-entry');
    entry.type = 'button';
    entry.setAttribute('aria-label', `${person.name}, ${dateLabel(person)}, ${days === 0 ? 'сегодня' : `через ${days} дней`}`);
    const photo = document.createElement('img');
    photo.src = person.avatar;
    photo.alt = '';
    photo.loading = 'lazy';
    const details = makeElement('span');
    details.append(makeElement('b', '', person.name), makeElement('small', '', dateLabel(person)));
    entry.append(photo, details, makeElement('em', '', days === 0 ? 'СЕГОДНЯ' : `${days} дн.`));
    entry.addEventListener('click', () => focusBirthday(person, year));
    list.append(entry);
  });
}

byId('prev-year').addEventListener('click', () => { currentYear--; renderCalendar(); });
byId('next-year').addEventListener('click', () => { currentYear++; renderCalendar(); });
byId('today-button').addEventListener('click', () => { currentYear = todayYear; renderCalendar(); byId(`month-${today.getMonth()}`).scrollIntoView({ behavior: 'smooth', block: 'start' }); });
byId('dialog-close').addEventListener('click', closeBirthday);
byId('dialog-ok').addEventListener('click', closeBirthday);
byId('calendar-overlay').addEventListener('click', event => { if (event.target === byId('calendar-overlay')) closeBirthday(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !byId('calendar-overlay').hidden) closeBirthday(); });
renderCalendar();
renderUpcoming();
const requestedDate = new URLSearchParams(window.location.search);
const requestedYear = Number(requestedDate.get('year'));
const requestedMonth = Number(requestedDate.get('month'));
const requestedDay = Number(requestedDate.get('day'));
if (requestedYear >= todayYear && requestedYear <= todayYear + 1 && birthdays.some(person => person.month + 1 === requestedMonth && person.day === requestedDay)) {
  currentYear = requestedYear;
  renderCalendar();
  requestAnimationFrame(() => {
    const day = byId(`birthday-${requestedMonth}-${requestedDay}`);
    day?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    day?.focus({ preventScroll: true });
  });
}
