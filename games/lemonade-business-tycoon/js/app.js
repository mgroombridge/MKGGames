import { createNewState, loadState, saveState, clearState, saveInfo } from './state.js';

const app = document.querySelector('#app');
const toastRoot = document.querySelector('#toast-root');
let state = loadState();
let view = state?.meta?.lastScreen || 'menu';
let splashVisible = true;

const navItems = [
  ['home','🏠','Home'], ['company','📍','Company'], ['team','👥','Team'], ['stats','📊','Stats'], ['more','⚙️','More']
];
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const money = value => `£${Number(value || 0).toFixed(2)}`;

function toast(message, tone='') {
  const el = document.createElement('div');
  el.className = `toast ${tone}`.trim();
  el.textContent = message;
  toastRoot?.append(el);
  setTimeout(() => el.remove(), 2300);
}
function persistView(next) {
  view = next;
  if (state) { state.meta ||= {}; state.meta.lastScreen = next; saveState(state); }
}
function splash() {
  return `<main class="shell splash"><div class="brand-mark">🍋</div><p class="eyebrow">MKG Games</p><h1>LEMONADE<br><span>BUSINESS TYCOON</span></h1><p>Start with one stand. Make smarter daily choices. Build a nationwide lemonade company.</p><small>Rebuild foundation · Stage 2</small></main>`;
}
function menu() {
  const saved = loadState();
  return `<main class="shell menu"><section><div class="brand-mark">🍋</div><p class="eyebrow">MKG Games</p><h1>LEMONADE<br><span>BUSINESS TYCOON</span></h1><p>A colourful business simulation about growing from one lemonade stand into a national company.</p></section><section class="menu-actions"><button class="btn primary" data-action="continue" ${saved?'':'disabled'}>${saved?`CONTINUE · DAY ${saved.business.day}`:'CONTINUE · NO SAVE'}</button><button class="btn secondary" data-action="new-game">NEW GAME</button><button class="btn ghost" data-action="info">STAGE 2 BUILD INFO</button></section><small>New rebuild · separate save · existing game untouched</small></main>`;
}
function ownerArt() {
  return `<div class="owner-concept" aria-label="Owner avatar Concept B Builder"><div class="avatar"><i class="hair"></i><i class="face"></i><i class="body"></i><i class="apron"></i></div><b>CONCEPT B · BUILDER</b></div>`;
}
function newGame() {
  return `<main class="shell setup"><header class="subhead"><button data-action="menu" aria-label="Back">←</button><h1>New Business</h1><span></span></header><section class="setup-card">${ownerArt()}<div><p class="eyebrow">Approved owner direction</p><h2>Concept B · Builder</h2><p class="muted">Hands-on enough for the first stand and polished enough to grow into the company founder.</p><label>Business name<input id="business-name" maxlength="28" value="Sunny Squeeze"></label><div class="summary"><strong>Starting position</strong><small>Day 1 · £40 cash · 50 reputation · Home region · One basic stand</small></div><button class="btn primary full" data-action="create-business">START BUSINESS</button></div></section></main>`;
}
function nav(active, desktop=false) {
  const cls = desktop ? 'rail-nav' : 'bottom-nav';
  return `<nav class="${cls}">${navItems.map(([id,icon,label])=>`<button class="${active===id?'active':''}" data-nav="${id}"><span>${icon}</span><small>${label}</small></button>`).join('')}</nav>`;
}
function frame(active, body) {
  const b = state.business;
  return `<main class="shell app-shell"><aside class="desktop-rail"><div class="rail-brand">🍋 <b>Lemonade<br>Business Tycoon</b></div>${nav(active,true)}<p>Stage 2 foundation<br>Gameplay systems follow later approvals.</p></aside><section class="app-main"><header class="app-header"><div class="brand-mini">🍋 <div><strong>${escapeHtml(b.name)}</strong><small>Day ${b.day} · Foundation</small></div></div><span>💷 ${money(b.cash)}</span><span>⭐ ${b.reputation}</span></header>${body}${nav(active,false)}</section></main>`;
}
function home() {
  const b = state.business;
  return frame('home', `<div class="content"><p class="eyebrow">Stage 2 foundation</p><h1>Good morning, ${escapeHtml(b.name)}</h1><p class="muted">The responsive shell, navigation and safe save foundation are in place. Gameplay comes next, one approved stage at a time.</p><section class="hero"><small>STARTING CASH</small><strong>${money(b.cash)}</strong><span>Day ${b.day} · Reputation ${b.reputation} · Home region</span></section><div class="metrics"><article><small>Business level</small><strong>${b.level}</strong></article><article><small>Permanent sites</small><strong>0</strong></article><article><small>Staff</small><strong>0</strong></article><article><small>HQ</small><strong>Locked</strong></article></div><section class="panel"><h2>Foundation status</h2><div class="rows"><div>📱 <span><b>Responsive application shell</b><small>Phone, tablet and desktop layouts.</small></span><em>READY</em></div><div>🧭 <span><b>Navigation foundation</b><small>Home, Company, Team, Stats and More.</small></span><em>READY</em></div><div>💾 <span><b>Versioned local save</b><small>Separate rebuild key · schema v${saveInfo.version}.</small></span><em>READY</em></div><div>🥤 <span><b>Planning + trading</b><small>Begins in the next approved stage.</small></span><em class="next">NEXT</em></div></div></section></div>`);
}
const copy = {
  company:['Company','Permanent locations, regional growth and Headquarters will live here as those systems are built.'],
  team:['Team','Recruitment, the six confirmed staff characteristics, training and manager delegation will live here.'],
  stats:['Statistics','Profit history, business KPIs and achievements will appear once real gameplay data exists.'],
  more:['More','Settings, How to Play, save export/import and data controls will be added in their approved stages.']
};
function placeholder(id) {
  const [title, text] = copy[id];
  return frame(id, `<div class="content"><p class="eyebrow">Navigation foundation</p><h1>${title}</h1><p class="muted">${text}</p><div class="placeholder"><b>${title} foundation</b><span>No fake systems have been added. This area is reserved for its later roadmap stage.</span></div>${id==='more'?`<section class="panel"><h2>Save foundation</h2><p>Rebuild save key: <b>${saveInfo.key}</b>. The old game save is not read, replaced or deleted.</p><button class="btn danger full" data-action="reset">RESET REBUILD SAVE</button></section>`:''}</div>`);
}
function render() {
  if (!app) return;
  if (splashVisible) return void (app.innerHTML = splash());
  if (!state) return void (app.innerHTML = view==='new-game' ? newGame() : menu());
  app.innerHTML = view==='home' ? home() : copy[view] ? placeholder(view) : home();
}

document.addEventListener('click', e => {
  const navButton = e.target.closest('[data-nav]');
  if (navButton && state) { persistView(navButton.dataset.nav); render(); return; }
  const button = e.target.closest('[data-action]'); if (!button) return;
  const action = button.dataset.action;
  if (action==='menu') { state=null; view='menu'; render(); }
  if (action==='new-game') { view='new-game'; render(); }
  if (action==='continue') { state=loadState(); if(!state) toast('No rebuild save found.','warning'); else view=state.meta?.lastScreen||'home'; render(); }
  if (action==='create-business') { state=createNewState(document.querySelector('#business-name')?.value); persistView('home'); saveState(state); render(); toast('New rebuild business created.','success'); }
  if (action==='info') toast('Stage 2 contains the responsive shell, navigation and versioned save foundation only.');
  if (action==='reset') { if(confirm('Reset only the NEW Lemonade Business Tycoon rebuild save?')) { clearState(); state=null; view='menu'; render(); toast('Rebuild save reset.','warning'); } }
});

render();
setTimeout(()=>{ splashVisible=false; render(); },650);
window.__LBT_REBUILD_TEST__ = { createNewState, loadState, saveState, getState:()=>state, getView:()=>view, saveInfo };
