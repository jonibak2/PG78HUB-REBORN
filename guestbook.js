const form = document.querySelector('#guest-form');
const submitButton = document.querySelector('#guest-submit');
const status = document.querySelector('#guest-status');
const entriesRoot = document.querySelector('#entries');

const firebaseConfig = {
  apiKey: 'AIzaSyD6yrRs9vnH-YG1LyoUL_Nx4zCltXSG_Ic',
  authDomain: 'pgtest78.firebaseapp.com',
  databaseURL: 'https://pgtest78-default-rtdb.firebaseio.com',
  projectId: 'pgtest78',
  storageBucket: 'pgtest78.firebasestorage.app',
  messagingSenderId: '776055100451',
  appId: '1:776055100451:web:9fc6cda8cbb315e48b4d96',
  measurementId: 'G-49YZYMQ9C9',
};

let saveEntry = null;
let deleteEntry = null;
let currentUser = null;

function renderEntries(entries) {
  entriesRoot.replaceChildren();
  for (const { key, value: entry } of entries) {
    if (!entry || typeof entry.name !== 'string' || typeof entry.message !== 'string') continue;
    const item = document.createElement('div');
    item.className = 'entry';
    const name = document.createElement('b');
    name.textContent = entry.name.slice(0, 32);
    const message = document.createElement('p');
    message.textContent = entry.message.slice(0, 400);
    item.append(name, message);
    if (entry.owner === currentUser?.uid) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'native';
      button.textContent = 'Удалить';
      button.addEventListener('click', async () => {
        button.disabled = true;
        try { await deleteEntry(key); }
        catch (error) { console.error(error); status.textContent = 'Не удалось удалить запись. Попробуйте позже.'; button.disabled = false; }
      });
      item.append(button);
    }
    entriesRoot.append(item);
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!saveEntry || submitButton.disabled) return;
  const name = form.elements.name.value.trim().slice(0, 32);
  const message = form.elements.message.value.trim().slice(0, 400);
  if (!name || !message) return;

  submitButton.disabled = true;
  status.textContent = 'Отправляем запись…';
  try {
    await saveEntry({ name, message });
    form.reset();
    status.textContent = 'Запись добавлена!';
  } catch (error) {
    console.error('Не удалось сохранить запись гостевой книги:', error);
    status.textContent = 'Не удалось отправить запись. Попробуйте позже.';
  } finally {
    submitButton.disabled = false;
  }
});

try {
  const [{ initializeApp }, { getDatabase, ref, query, orderByKey, limitToLast, onValue, push, remove, serverTimestamp }, { getAuth, setPersistence, browserSessionPersistence, signInAnonymously }] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/13.1.0/firebase-database.js'),
    import('https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js'),
  ]);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  await setPersistence(auth, browserSessionPersistence);
  currentUser = auth.currentUser || (await signInAnonymously(auth)).user;
  const database = getDatabase(app);
  const entriesRef = ref(database, 'guestbook');
  saveEntry = entry => push(entriesRef, { ...entry, owner: currentUser.uid, createdAt: serverTimestamp() });
  deleteEntry = key => remove(ref(database, `guestbook/${key}`));
  onValue(query(entriesRef, orderByKey(), limitToLast(50)), snapshot => {
    const entries = [];
    snapshot.forEach(child => { entries.unshift({ key: child.key, value: child.val() }); });
    renderEntries(entries);
    submitButton.disabled = false;
    if (status.textContent === 'Подключаем гостевую книгу…') status.textContent = '';
  }, error => {
    console.error('Не удалось загрузить гостевую книгу:', error);
    status.textContent = 'Гостевая книга временно недоступна.';
    submitButton.disabled = true;
  });
} catch (error) {
  console.error('Не удалось подключить Firebase:', error);
  status.textContent = 'Гостевая книга временно недоступна.';
}
