// ============================================================
//  SHARED UI UTILITIES
// ============================================================

let CUR = { game: null, roomCode: null, lastSettings: null };

function showPanel(id) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function generateCode() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = ''; for (let i = 0; i < 4; i++) s += c[Math.floor(Math.random() * c.length)];
  return s;
}

function resolveFirst(sel) {
  if (sel === 'guest' || sel === 'cpu') return 2;
  if (sel === 'random') return Math.random() < 0.5 ? 1 : 2;
  return 1;
}

function copyCode(elId) {
  const val = document.getElementById(elId).textContent;
  navigator.clipboard?.writeText(val).catch(() => {});
  const btn = event.target, orig = btn.textContent;
  btn.textContent = '✅ 已複製！'; setTimeout(() => btn.textContent = orig, 1500);
}

function addLog(logId, type, msg) {
  const log = document.getElementById(logId), el = document.createElement('div');
  el.className = `log-entry log-${type}`; el.textContent = msg;
  log.appendChild(el); log.scrollTop = log.scrollHeight;
}

function setStatusDot(dotId, state) {
  document.getElementById(dotId).className = 'status-dot ' + state;
}

function updatePlayerTags(p1Id, p2Id, cur) {
  document.getElementById(p1Id).classList.toggle('active', cur === 1);
  document.getElementById(p2Id).classList.toggle('active', cur === 2);
}

function showResult(winner, winnerName, loserName, isMe, flavor) {
  const resultEmoji = document.getElementById('result-emoji');
  resultEmoji.innerHTML = isMe
    ? '<img src="../assets/icons/winner.png" style="height:140px;">'
    : '<img src="../assets/icons/loser.png" style="height:140px;">';
  const t = document.getElementById('result-title');
  t.textContent = isMe ? '勝利！' : '失敗';
  t.style.color = isMe ? 'var(--accent3)' : 'var(--accent2)';
  document.getElementById('result-msg').textContent =
    isMe ? `恭喜 ${winnerName} 獲勝！\n${flavor}` : `${winnerName} 獲勝！\n${flavor}\n下次加油！`;
  document.getElementById('result-overlay').classList.add('show');
  if (isMe) launchConfetti();
}

function showDraw(msg) {
  const resultEmoji = document.getElementById('result-emoji');
  resultEmoji.innerHTML = '<img src="../assets/icons/draw.png" style="height:140px;">';
  const t = document.getElementById('result-title');
  t.textContent = '平局！';
  t.style.color = 'var(--accent4)';
  document.getElementById('result-msg').textContent = msg || '勢均力敵，再來一局！';
  document.getElementById('result-overlay').classList.add('show');
}

function showDisconnect() {
  if (!CUR.roomCode) return;
  document.getElementById('disconnect-overlay').classList.add('show');
}
function dismissDisconnect() {
  document.getElementById('disconnect-overlay').classList.remove('show');
  goHome();
}

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas'); canvas.style.display = 'block';
  const ctx = canvas.getContext('2d'); canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const colors = ['#00e5ff','#ff4081','#69ff47','#ffd740','#ea80fc'];
  const pieces = Array.from({length:120}, () => ({
    x: Math.random()*canvas.width, y: Math.random()*-canvas.height*0.5,
    r: 4+Math.random()*7, dy: 2.5+Math.random()*3.5, dx: (Math.random()-0.5)*2,
    tilt: Math.random()*Math.PI, tiltSpeed: (Math.random()-0.5)*0.08,
    color: colors[Math.floor(Math.random()*colors.length)]
  }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p => {
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.tilt);
      ctx.beginPath(); ctx.fillStyle=p.color;
      ctx.ellipse(0,0,p.r,p.r*0.4,0,0,Math.PI*2); ctx.fill(); ctx.restore();
      p.y+=p.dy; p.x+=p.dx+Math.sin(frame*0.03+p.tilt)*1.2; p.tilt+=p.tiltSpeed;
    });
    frame++; if(frame<200) requestAnimationFrame(draw);
    else { ctx.clearRect(0,0,canvas.width,canvas.height); canvas.style.display='none'; }
  }
  draw();
}

// Tab helpers for mode tabs
function setModeTab(prefix, m) {
  ['cpu','create','join'].forEach(t => {
    document.getElementById(prefix+'tab-'+t).classList.toggle('active', t===m);
    document.getElementById(prefix+'mode-'+t).style.display = t===m ? 'block' : 'none';
  });
}
