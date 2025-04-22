// 🌍 多言語テキスト
const texts = {
  ja: {
    timeUp: '🔔 タイムアップ！',
    bellAlert: '🔔 ベルを鳴らすタイミング到達！',
    unnamedSession: '無名セッション',
    sessionEnd: '現在のセッション：終了！',
    currentSession: '現在のセッション：',
    start: '開始',
    session: 'セッション',
    eventTitle: 'イベント名',
    placeholderSession: 'セッション名（例：発表）',
    placeholderMin: '分',
    placeholderSec: '秒'
  },
  en: {
    timeUp: '🔔 Time\'s up!',
    bellAlert: '🔔 Bell time reached!',
    unnamedSession: 'Untitled Session',
    sessionEnd: 'Current Session: Finished!',
    currentSession: 'Current Session:',
    start: 'Start',
    session: 'Session',
    eventTitle: 'Event Title',
    placeholderSession: 'Session name (e.g., Presentation)',
    placeholderMin: 'min',
    placeholderSec: 'sec'
  }
};

// HTML側で定義された lang に基づいて動作（例：const lang = "en";）


const timeDisplay = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const simpleBtn = document.getElementById('simple-btn');
const customBtn = document.getElementById('custom-btn');
const popup = document.getElementById('popup');
const inputMin = document.getElementById('input-min');
const inputSec = document.getElementById('input-sec');
const applyTimeBtn = document.getElementById('apply-time');
const bellTimesContainer = document.getElementById('bell-times');
const addBellBtn = document.getElementById('add-bell');
const bellSound = document.getElementById('bell-sound');
const customMode = document.getElementById('custom-mode');
const simpleMode = document.querySelector('body');

const addSessionBtn = document.getElementById('add-session');
const sessionList = document.getElementById('session-list');
const customStartBtn = document.getElementById('custom-start-btn');
let customTotalSeconds = 0;
let customRemainingSeconds = 0;
let customIntervalId = null;
let customSessions = [];
const confirmBtn = document.getElementById('custom-confirm-btn');
const popupTimerBox = document.getElementById('custom-popup');
const popupTitle = document.getElementById('popup-event-title');
const popupSession = document.getElementById('popup-current-session');
const popupTimeDisplay = document.getElementById('popup-time-display');
const popupStart = document.getElementById('popup-start-btn');
const popupPause = document.getElementById('popup-pause-btn');
const popupReset = document.getElementById('popup-reset-btn');
const popupBox = document.getElementById('custom-popup');

let popupTotalSeconds = 0;
let popupRemainingSeconds = 0;
let popupTimerId = null;
let popupSessions = [];

let totalSeconds = 900;
let remainingSeconds = totalSeconds;
let intervalId = null;
let bellTimes = [];

function updateDisplay(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  timeDisplay.textContent = `${m}:${s}`;
}

function addBellInput(min = '', sec = '') {
  const row = document.createElement('div');
  row.className = 'bell-time-row';

  const minInput = document.createElement('input');
  minInput.type = 'number';
  minInput.placeholder = texts[lang].placeholderMin;
  minInput.value = min;
  minInput.min = 0;
  minInput.max = 60;

  const secInput = document.createElement('input');
  secInput.type = 'number';
  secInput.placeholder = texts[lang].placeholderSec;
  secInput.value = sec;
  secInput.min = 0;
  secInput.max = 59;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑';
  deleteBtn.style.marginLeft = '5px';
  deleteBtn.onclick = () => row.remove();

  row.appendChild(minInput);
  row.appendChild(secInput);
  row.appendChild(deleteBtn);

  bellTimesContainer.appendChild(row);
}

addBellBtn.addEventListener('click', () => {
  addBellInput();
});

startBtn.addEventListener('click', () => {
  if (intervalId) return;

  intervalId = setInterval(() => {
    if (remainingSeconds <= 0) {
      clearInterval(intervalId);
      intervalId = null;
      alert(texts[lang].timeUp);
    } else {
      remainingSeconds--;
      updateDisplay(remainingSeconds);

      if (bellTimes.includes(remainingSeconds)) {
        console.log(texts[lang].bellAlert);
        bellSound.currentTime = 0;
        bellSound.play();
      }
    }
  }, 1000);
});

pauseBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  intervalId = null;
});

resetBtn.addEventListener('click', () => {
  remainingSeconds = totalSeconds;
  updateDisplay(remainingSeconds);
  clearInterval(intervalId);
  intervalId = null;
});

simpleBtn.addEventListener('click', () => {
  popup.style.display = 'block';
});

applyTimeBtn.addEventListener('click', () => {
  const min = Number(inputMin.value);
  const sec = Number(inputSec.value);
  totalSeconds = min * 60 + sec;
  remainingSeconds = totalSeconds;
  updateDisplay(remainingSeconds);
  popup.style.display = 'none';

  customSessions = [];
  const rows = sessionList.querySelectorAll('.session-row');
  rows.forEach(row => {
    const title = row.children[0].value || texts[lang].unnamedSession;
    const min = Number(row.children[1].value || 0);
    const sec = Number(row.children[2].value || 0);
    const time = min * 60 + sec;
    customSessions.push({ title, time });
  });

  customSessions.sort((a, b) => a.time - b.time);
  bellTimes = popupSessions.map(s => s.time).filter(t => t > 0 && t < popupTotalSeconds);

  bellTimes = [];
  const bellInputs = bellTimesContainer.querySelectorAll('.bell-time-row');
    bellInputs.forEach(row => {
  const mins = Number(row.children[0].value || 0);
  const secs = Number(row.children[1].value || 0);
  const setTime = mins * 60 + secs;
  const bellTime = totalSeconds - setTime;  // ← 残り時間→経過時間に変換！

  if (!isNaN(bellTime) && bellTime > 0 && bellTime < totalSeconds) {
    bellTimes.push(bellTime);
  }
});

});

customBtn.addEventListener('click', () => {
  customMode.style.display = 'block';
  document.getElementById('time-display').style.display = 'none';
  document.querySelector('.controls').style.display = 'none';
  simpleBtn.style.display = 'none';
  customBtn.style.display = 'none';
});

addSessionBtn.addEventListener('click', () => {
  const row = document.createElement('div');
  row.className = 'session-row';
  row.style.margin = '10px';

  row.innerHTML = `
    <input type="text" placeholder="${texts[lang].placeholderSession}">
    <input type="number" min="0" max="60" placeholder="${texts[lang].placeholderMin}" style="width: 60px;">
    <input type="number" min="0" max="59" placeholder="${texts[lang].placeholderSec}" style="width: 60px;">
    <button onclick="this.parentElement.remove()">🗑</button>
  `;

  sessionList.appendChild(row);
});

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

const currentSessionDisplay = document.getElementById('current-session');

customStartBtn.addEventListener('click', () => {
  const rows = sessionList.querySelectorAll('.session-row');
  customSessions = [];

  rows.forEach(row => {
    const title = row.children[0].value || texts[lang].unnamedSession;
    const min = Number(row.children[1].value || 0);
    const sec = Number(row.children[2].value || 0);
    const time = min * 60 + sec;
    customSessions.push({ title, time });
  });

  customSessions.sort((a, b) => a.time - b.time);
  const last = customSessions[customSessions.length - 1];
  customTotalSeconds = last ? last.time + 1 : 0;
  customRemainingSeconds = customTotalSeconds;

  if (customIntervalId) clearInterval(customIntervalId);

  customIntervalId = setInterval(() => {
    if (customRemainingSeconds <= 0) {
      clearInterval(customIntervalId);
      customTimeDisplay.textContent = "00:00";
      currentSessionDisplay.textContent = texts[lang].sessionEnd;
    } else {
      customRemainingSeconds--;
      const m = String(Math.floor(customRemainingSeconds / 60)).padStart(2, '0');
      const s = String(customRemainingSeconds % 60).padStart(2, '0');
      customTimeDisplay.textContent = `${m}:${s}`;

      const elapsed = customTotalSeconds - customRemainingSeconds;
      const current = popupSessions.slice().reverse().find(s => elapsed >= s.time);
      if (current) {
        currentSessionDisplay.textContent = `${texts[lang].currentSession}${current.title}`;
      }
    }
  }, 1000);
});

confirmBtn.addEventListener('click', () => {
  const eventTitle = document.getElementById('event-title').value || texts[lang].eventTitle;
  popupTitle.textContent = eventTitle;

  const rows = sessionList.querySelectorAll('.session-row');
  const firstTitle = document.getElementById('first-session-title').value || texts[lang].start;

  popupSessions = [{ title: firstTitle, time: 0 }];
  rows.forEach(row => {
    const title = row.children[0].value || texts[lang].session;
    const min = Number(row.children[1].value || 0);
    const sec = Number(row.children[2].value || 0);
    const time = min * 60 + sec;
    popupSessions.push({ title, time });
  });

  popupSessions.sort((a, b) => a.time - b.time);
  bellTimes = popupSessions.map(s => s.time).filter(t => t > 0);

  const min = Number(document.getElementById('custom-total-min').value || 0);
  const sec = Number(document.getElementById('custom-total-sec').value || 0);
  const inputTotal = min * 60 + sec;
  const last = popupSessions[popupSessions.length - 1];
  const fallback = last ? last.time + 1 : 600;

  popupTotalSeconds = inputTotal > 0 ? inputTotal : fallback;
  popupRemainingSeconds = popupTotalSeconds;

  updatePopupDisplay(popupRemainingSeconds);
  popupSession.textContent = texts[lang].currentSession;

  popupTimerBox.style.display = 'block';
});

let lastSession = null;

popupStart.addEventListener('click', () => {
  if (popupTimerId) return;

  lastSession = null;

  const current = popupSessions.slice().reverse().find(s => 0 >= s.time);
  if (current) {
    popupSession.textContent = `${texts[lang].currentSession}${current.title}`;
    lastSession = current;
  }

  popupTimerId = setInterval(() => {
    if (popupRemainingSeconds <= 0) {
      clearInterval(popupTimerId);
      popupTimerId = null;
      popupTimeDisplay.textContent = "00:00";
      popupSession.textContent = texts[lang].sessionEnd;
    } else {
      popupRemainingSeconds--;
      updatePopupDisplay(popupRemainingSeconds);

      const elapsed = popupTotalSeconds - popupRemainingSeconds;
      const current = popupSessions.slice().reverse().find(s => elapsed >= s.time);

      if (current && current !== lastSession) {
        popupSession.textContent = `${texts[lang].currentSession}${current.title}`;
        bellSound.currentTime = 0;
        bellSound.play();
        lastSession = current;
      }
    }
  }, 1000);
});

popupPause.addEventListener('click', () => {
  clearInterval(popupTimerId);
  popupTimerId = null;
});

popupReset.addEventListener('click', () => {
  popupRemainingSeconds = popupTotalSeconds;
  updatePopupDisplay(popupRemainingSeconds);
  popupSession.textContent = texts[lang].currentSession;
  clearInterval(popupTimerId);
  popupTimerId = null;
});

function updatePopupDisplay(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  popupTimeDisplay.textContent = `${m}:${s}`;
}

let isDragging = false;
let offsetX, offsetY;

popupBox.addEventListener('mousedown', (e) => {
  const isInResizeCorner = e.offsetX > popupBox.clientWidth - 20 && e.offsetY > popupBox.clientHeight - 20;
  if (isInResizeCorner) return;

  isDragging = true;
  offsetX = e.clientX - popupBox.offsetLeft;
  offsetY = e.clientY - popupBox.offsetTop;
  popupBox.style.cursor = 'move';
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    popupBox.style.left = `${e.clientX - offsetX}px`;
    popupBox.style.top = `${e.clientY - offsetY}px`;
    popupBox.style.transform = 'none';
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  popupBox.style.cursor = 'default';
});

const popupCloseBtn = document.getElementById('popup-close-btn');

popupCloseBtn.addEventListener('click', () => {
  popupBox.style.display = 'none';
  clearInterval(popupTimerId);
  popupTimerId = null;
});

updateDisplay(remainingSeconds);
