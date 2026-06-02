// ============================================================
//  FIREBASE REALTIME DATABASE — 跨裝置聯機
// ============================================================
const FIREBASE_CONFIG = {
  databaseURL: "https://oioilab-a81bc-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

let db = null;
let firebaseReady = false;

function initFirebase() {
  if (firebaseReady) return true;
  try {
    if (typeof firebase === 'undefined') {
      console.warn('Firebase SDK 未載入，使用 localStorage 模式');
      return false;
    }
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.database();
    firebaseReady = true;
    return true;
  } catch(e) {
    console.warn('Firebase 初始化失敗，降級使用 localStorage:', e.message);
    return false;
  }
}

// ---- 統一的房間讀寫介面（自動切換 Firebase / localStorage） ----

async function getRoom(code) {
  if (firebaseReady && db) {
    try {
      const snap = await db.ref(`rooms/${code}`).once('value');
      return snap.exists() ? snap.val() : null;
    } catch(e) { console.error('getRoom error:', e); return null; }
  }
  const rooms = _lsGetRooms();
  return rooms[code] || null;
}

async function setRoom(code, data) {
  if (firebaseReady && db) {
    try { await db.ref(`rooms/${code}`).set(data); return true; }
    catch(e) { console.error('setRoom error:', e); return false; }
  }
  const rooms = _lsGetRooms();
  rooms[code] = data;
  _lsSaveRooms(rooms);
  return true;
}

async function updateRoom(code, patch) {
  if (firebaseReady && db) {
    try { await db.ref(`rooms/${code}`).update(patch); return true; }
    catch(e) { console.error('updateRoom error:', e); return false; }
  }
  const rooms = _lsGetRooms();
  if (rooms[code]) { Object.assign(rooms[code], patch); _lsSaveRooms(rooms); }
  return true;
}

async function deleteRoom(code) {
  if (firebaseReady && db) {
    try { await db.ref(`rooms/${code}`).remove(); } catch(e) { console.error('deleteRoom error:', e); }
  }
  const rooms = _lsGetRooms();
  delete rooms[code];
  _lsSaveRooms(rooms);
}

async function pushMove(code, move) {
  if (firebaseReady && db) {
    try { await db.ref(`rooms/${code}/moves`).push(move); return true; }
    catch(e) { console.error('pushMove error:', e); return false; }
  }
  const rooms = _lsGetRooms();
  if (!rooms[code]) return false;
  rooms[code].moves = rooms[code].moves || [];
  rooms[code].moves.push(move);
  _lsSaveRooms(rooms);
  return true;
}

// localStorage fallback helpers
const ROOMS_KEY = 'mathgames_rooms_v2';
function _lsGetRooms() { try { return JSON.parse(localStorage.getItem(ROOMS_KEY) || '{}'); } catch { return {}; } }
function _lsSaveRooms(r) { localStorage.setItem(ROOMS_KEY, JSON.stringify(r)); }

// ---- Room polling：支援 Firebase realtime listener ----
let globalPollInterval = null;
let globalFirebaseUnsubscribe = null;

function stopPolling() {
  if (globalPollInterval) { clearInterval(globalPollInterval); globalPollInterval = null; }
  if (globalFirebaseUnsubscribe) { globalFirebaseUnsubscribe(); globalFirebaseUnsubscribe = null; }
}

function startRoomPolling(roomCode, cb) {
  stopPolling();
  if (firebaseReady && db) {
    const roomRef = db.ref(`rooms/${roomCode}`);
    roomRef.on('value', (snap) => {
      if (!snap || !snap.exists()) { stopPolling(); showDisconnect(); return; }
      const room = snap.val();
      if (room.closed) { stopPolling(); showDisconnect(); return; }
      cb(room);
    });
    globalFirebaseUnsubscribe = () => roomRef.off('value');
  } else {
    globalPollInterval = setInterval(async () => {
      const room = await getRoom(roomCode);
      if (!room) { stopPolling(); return; }
      cb(room);
    }, 800);
  }
}

async function uniqueCode() {
  let code, attempts = 0;
  do {
    code = generateCode();
    const existing = await getRoom(code);
    if (!existing) break;
    attempts++;
  } while (attempts < 10);
  return code;
}

async function cleanupRoom(code) {
  if (!code) return;
  await deleteRoom(code);
}

async function registerHostDisconnect(code) {
  if (!firebaseReady || !db) return;
  try { await db.ref(`rooms/${code}/closed`).onDisconnect().set(true); } catch(e) {}
}

// 清理過期房間（localStorage 模式）
(function() {
  const rooms = _lsGetRooms();
  const now = Date.now();
  let changed = false;
  Object.keys(rooms).forEach(k => { if (now - rooms[k].created > 3600000) { delete rooms[k]; changed = true; } });
  if (changed) _lsSaveRooms(rooms);
})();

// 初始化
const _fbOk = initFirebase();
if (_fbOk) console.log('✅ Firebase 連線成功');
else console.warn('⚠️ 使用 localStorage 模式');
