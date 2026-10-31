const birthdays=[{name:'Андрей',month:11,day:1,avatar:'andrew.png'},{name:'Жанибек',month:11,day:12,avatar:'jonibak.png'},{name:'Настя',month:12,day:5,avatar:'nastya.png'},{name:'Эристorem',month:1,day:16,avatar:'eristorem.png'},{name:'Моринок',month:2,day:4,avatar:'morinok.png'},{name:'Хома',month:3,day:23,avatar:'homa.png'},{name:'Моди',month:4,day:29,avatar:'modie.png'},{name:'Пашок',month:5,day:7,avatar:'pasha.png'},{name:'Энд',month:5,day:28,avatar:'fayko.jpg'},{name:'Аня',month:7,day:4,avatar:'anya.png'},{name:'Стасик',month:7,day:22,avatar:'nicech.png'},{name:'Ника',month:8,day:18,avatar:'nika.png'},{name:'PG78',month:9,day:12,avatar:'pg78.jpg'},{name:'Костя',month:9,day:26,avatar:'kostya.png'},{name:'Ержан',month:10,day:19,avatar:'erzhan.png'},{name:'Драгоман',month:10,day:26,avatar:'dragoman.png'}];
const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Jerusalem',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date()).map(p=>[p.type,p.value]));
const today=Date.UTC(+parts.year,+parts.month-1,+parts.day);
const next=birthdays.map(b=>{let date=Date.UTC(+parts.year,b.month-1,b.day);if(date<today)date=Date.UTC(+parts.year+1,b.month-1,b.day);return {...b,date,days:Math.round((date-today)/86400000)}}).sort((a,b)=>a.date-b.date)[0];
document.querySelector('#birthday-person').href=`calendar.html?year=${new Date(next.date).getUTCFullYear()}&month=${next.month}&day=${next.day}`;
document.querySelector('#birthday-name').textContent=next.name;document.querySelector('#birthday-avatar').src='assets/pgCALENDAR/'+next.avatar;document.querySelector('#birthday-avatar').alt=next.name;document.querySelector('#birthday-date').textContent=new Date(next.date).toLocaleDateString('ru-RU',{day:'numeric',month:'long',timeZone:'UTC'});document.querySelector('#birthday-count').textContent=next.days===0?'Сегодня! Поздравляем!':'До дня рождения: '+next.days+' дн.';

const peopleAlbum=document.querySelector('#calendar-people');
for(const person of birthdays.filter(person=>person.name!=='PG78').sort((a,b)=>a.month-b.month||a.day-b.day)){
  const figure=document.createElement('figure');
  const avatar=document.createElement('img');
  const caption=document.createElement('figcaption');
  avatar.src='assets/pgCALENDAR/'+person.avatar;
  avatar.alt=person.name;
  avatar.loading='lazy';
  caption.textContent=person.name;
  figure.append(avatar,caption);
  peopleAlbum.append(figure);
}

document.querySelector('#copy-banner').addEventListener('click',async()=>{const status=document.querySelector('#copy-status');try{await navigator.clipboard.writeText('<a href="https://jonibak2.github.io/PG78HUB-REBORN/"> PG78 — место встречи своих </a>');status.textContent='HTML скопирован!'}catch{status.textContent='PG78: jonibak2.github.io/PG78HUB-REBORN/'}});

const radioButton=document.querySelector('#open-radio');
const radioAudio=document.querySelector('#radio-audio');
const radioStatus=document.querySelector('#radio-status');
radioAudio.volume=0.3;
radioButton.addEventListener('click',async()=>{
  if(!radioAudio.paused){radioAudio.pause();return}
  radioStatus.textContent='ЗАГРУЗКА...';
  try{await radioAudio.play()}catch{radioStatus.textContent='НЕ УДАЛОСЬ ВКЛЮЧИТЬ'}
});
radioAudio.addEventListener('play',()=>{radioButton.setAttribute('aria-pressed','true');radioStatus.textContent='ИГРАЕТ · НАЖМИ, ЧТОБЫ ВЫКЛЮЧИТЬ'});
radioAudio.addEventListener('pause',()=>{radioButton.setAttribute('aria-pressed','false');radioStatus.textContent='НАЖМИ, ЧТОБЫ ВКЛЮЧИТЬ'});
radioAudio.addEventListener('error',()=>{radioButton.setAttribute('aria-pressed','false');radioStatus.textContent='НЕ УДАЛОСЬ ЗАГРУЗИТЬ ЗВУК'});

const sortField=document.querySelector('#sort-field');
const sortBaskets=[...document.querySelectorAll('.sort-basket')];
const sortScore=document.querySelector('#sort-score');
const sortStatus=document.querySelector('#sort-status');
const sortColors=[{key:'blue',name:'Синий'},{key:'red',name:'Красный'},{key:'yellow',name:'Жёлтый'},{key:'green',name:'Зелёный'}];
let sortSelected=null;
let sortDragged=null;
let sortDone=0;
let sortPlaced={blue:0,red:0,yellow:0,green:0};

function selectSortBall(ball){
  if(sortSelected===ball){ball.classList.remove('is-selected');sortSelected=null;return}
  sortSelected?.classList.remove('is-selected');
  sortSelected=ball;
  ball.classList.add('is-selected');
  sortStatus.textContent='';
}

function placeSortBall(basket,ball){
  if(!ball||!sortField.contains(ball))return;
  if(ball.dataset.color!==basket.dataset.color){sortStatus.textContent='Не тот цвет.';return}
  const positions=[[25,66],[50,68],[75,65],[38,39],[64,40]];
  const color=ball.dataset.color;
  const [x,y]=positions[sortPlaced[color]++];
  const caught=document.createElement('span');
  caught.className='sort-caught-ball';
  caught.dataset.color=color;
  caught.setAttribute('aria-hidden','true');
  caught.style.left=x+'%';
  caught.style.top=y+'%';
  basket.append(caught);
  ball.remove();
  sortSelected=null;
  sortDone++;
  sortScore.textContent=sortDone+' / 20';
  sortStatus.textContent='';
}

function basketAt(x,y){
  const basket=document.elementFromPoint(x,y)?.closest('.sort-basket');
  return sortBaskets.includes(basket)?basket:null;
}

function finishSortDrag(event){
  if(!sortDragged||event.pointerId!==sortDragged.pointerId)return;
  const {ball,ghost}=sortDragged;
  const basket=event.type==='pointerup'?basketAt(event.clientX,event.clientY):null;
  ghost.remove();
  ball.classList.remove('is-dragging');
  sortBaskets.forEach(item=>item.classList.remove('is-target'));
  sortDragged=null;
  if(basket)placeSortBall(basket,ball);
  else sortStatus.textContent='';
}

function moveSortDrag(event){
  if(!sortDragged||event.pointerId!==sortDragged.pointerId)return;
  sortDragged.ghost.style.left=event.clientX+'px';
  sortDragged.ghost.style.top=event.clientY+'px';
  const basket=basketAt(event.clientX,event.clientY);
  sortBaskets.forEach(item=>item.classList.toggle('is-target',item===basket));
}

function startSortDrag(event){
  if(event.pointerType==='mouse'&&event.button!==0)return;
  event.preventDefault();
  const ball=event.currentTarget;
  sortSelected?.classList.remove('is-selected');
  sortSelected=null;
  ball.setPointerCapture(event.pointerId);
  const ghost=ball.cloneNode(false);
  ghost.className='sort-ball sort-ghost';
  ghost.style.position='fixed';
  ghost.style.left=event.clientX+'px';
  ghost.style.top=event.clientY+'px';
  ghost.style.pointerEvents='none';
  document.body.append(ghost);
  ball.classList.add('is-dragging');
  sortDragged={ball,ghost,pointerId:event.pointerId};
}

function newSortGame(){
  sortDragged?.ghost.remove();
  sortField.replaceChildren();
  sortSelected=null;
  sortDragged=null;
  sortDone=0;
  sortPlaced={blue:0,red:0,yellow:0,green:0};
  sortScore.textContent='0 / 20';
  sortStatus.textContent='';
  sortBaskets.forEach(basket=>{basket.classList.remove('is-target');basket.replaceChildren()});
  const balls=sortColors.flatMap(color=>Array(5).fill(color));
  for(let i=balls.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[balls[i],balls[j]]=[balls[j],balls[i]]}
  balls.forEach((color,index)=>{
    const ball=document.createElement('button');
    ball.type='button';
    ball.className='sort-ball';
    ball.dataset.color=color.key;
    ball.setAttribute('aria-label',color.name+' шарик');
    ball.style.left=([12,31,50,69,88][index%5]+(Math.random()-.5)*10)+'%';
    ball.style.top=([18,39,61,82][Math.floor(index/5)]+(Math.random()-.5)*8)+'%';
    ball.addEventListener('pointerdown',startSortDrag);
    ball.addEventListener('pointermove',moveSortDrag);
    ball.addEventListener('pointerup',finishSortDrag);
    ball.addEventListener('pointercancel',finishSortDrag);
    ball.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectSortBall(ball)}});
    sortField.append(ball);
  });
}

sortBaskets.forEach(basket=>basket.addEventListener('click',()=>placeSortBall(basket,sortSelected)));
document.querySelector('#sort-restart').addEventListener('click',newSortGame);
newSortGame();

const pga23Video=document.querySelector('#pga23-video');
const pga23Player=document.querySelector('.retro-player');
const pga23Toggle=document.querySelector('#pga23-toggle');
const pga23Progress=document.querySelector('#pga23-progress');
const pga23Time=document.querySelector('#pga23-time');
const pga23Volume=document.querySelector('#pga23-volume');
const pga23Fullscreen=document.querySelector('#pga23-fullscreen');
pga23Video.volume=0.7;

function formatVideoTime(seconds){
  if(!Number.isFinite(seconds))return '0:00';
  const total=Math.floor(seconds);
  return Math.floor(total/60)+':'+String(total%60).padStart(2,'0');
}

function updatePga23Player(){
  const duration=Number.isFinite(pga23Video.duration)?pga23Video.duration:0;
  pga23Progress.disabled=!duration;
  pga23Progress.value=duration?Math.round(pga23Video.currentTime/duration*1000):0;
  pga23Time.textContent=formatVideoTime(pga23Video.currentTime)+' / '+formatVideoTime(duration);
  pga23Toggle.classList.toggle('is-playing',!pga23Video.paused);
  pga23Toggle.setAttribute('aria-label',pga23Video.paused?'Воспроизвести видео':'Пауза');
  pga23Volume.value=Math.round(pga23Video.volume*100);
}

async function togglePga23Player(){
  if(!pga23Video.paused){pga23Video.pause();return}
  try{await pga23Video.play()}catch{pga23Time.textContent='Ошибка видео'}
}

pga23Toggle.addEventListener('click',togglePga23Player);
pga23Video.addEventListener('click',togglePga23Player);
pga23Volume.addEventListener('input',()=>{pga23Video.volume=Number(pga23Volume.value)/100;pga23Video.muted=pga23Video.volume===0;updatePga23Player()});
pga23Progress.addEventListener('input',()=>{if(Number.isFinite(pga23Video.duration))pga23Video.currentTime=pga23Progress.value/1000*pga23Video.duration});
function updatePga23Fullscreen(){
  const active=document.fullscreenElement===pga23Player||Boolean(pga23Video.webkitDisplayingFullscreen);
  pga23Fullscreen.classList.toggle('is-fullscreen',active);
  pga23Fullscreen.setAttribute('aria-pressed',String(active));
  pga23Fullscreen.setAttribute('aria-label',active?'Выйти из полноэкранного режима':'На весь экран');
}
pga23Fullscreen.addEventListener('click',async()=>{
  try{
    if(document.fullscreenElement===pga23Player)await document.exitFullscreen();
    else if(pga23Player.requestFullscreen)await pga23Player.requestFullscreen();
    else if(pga23Video.webkitEnterFullscreen)pga23Video.webkitEnterFullscreen();
  }catch{}
  updatePga23Fullscreen();
});
document.addEventListener('fullscreenchange',updatePga23Fullscreen);
pga23Video.addEventListener('webkitbeginfullscreen',updatePga23Fullscreen);
pga23Video.addEventListener('webkitendfullscreen',updatePga23Fullscreen);
if(!pga23Player.requestFullscreen&&!pga23Video.webkitEnterFullscreen)pga23Fullscreen.disabled=true;
for(const event of ['loadedmetadata','durationchange','timeupdate','play','pause','ended','volumechange'])pga23Video.addEventListener(event,updatePga23Player);
pga23Video.addEventListener('error',()=>{pga23Time.textContent='Ошибка видео'});
updatePga23Player();
updatePga23Fullscreen();
