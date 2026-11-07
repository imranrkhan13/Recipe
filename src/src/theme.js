/* Design tokens + global stylesheet, shared by the private app and the public share view. */
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; height: 100%; scroll-behavior: smooth; }

body {
  font-family: 'Poppins', sans-serif;
  background: var(--bg);
  color: var(--ink);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

::selection { background: var(--accent); color: #fff; }

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 99px; }

:root {
  --bg:       #FBF2F6;
  --bg1:      #FEF9FB;
  --bg2:      #F6E4ED;
  --bg3:      #F0D6E2;
  --bg4:      #E7C6D5;
  --border:   #EED3DF;
  --border2:  #DFB8C9;
  --ink:      #2E1220;
  --ink2:     #7C5668;
  --ink3:     #AE8B9C;
  --ink4:     #CDAFBF;
  --accent:   #D6336C;
  --accent2:  #F06595;
  --accentBg: #FBE0EB;
  --gold:     #C99212;
  --green:    #2E7D5B;
  --red:      #C03030;
  --nH: 68px;
  --ease: cubic-bezier(0.25, 0.1, 0.25, 1);
  --spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
}

button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
@media(max-width:640px){button.ibtn{min-width:44px;min-height:44px}.drawer-wrap .drawer{max-height:94dvh}.drawer .input{font-size:16px}.fab{bottom:calc(22px + env(safe-area-inset-bottom))}.drawer-footer{padding-bottom:calc(20px + env(safe-area-inset-bottom))}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;animation-delay:0ms!important;transition-duration:0.01ms!important}}
/* ── ANIMATIONS ── */
@keyframes fadeUp    { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
@keyframes slideUp   { from { transform:translateY(100%); opacity:0; } to { transform:translateY(0); opacity:1; } }
@keyframes slideDown { from { transform:translateY(-20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
@keyframes scaleIn   { from { transform:scale(0.9); opacity:0; } to { transform:scale(1); opacity:1; } }
@keyframes shimmer   { 0% { background-position:200% 0; } 100% { background-position:-200% 0; } }
@keyframes float     { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-8px); } }
@keyframes heartPop  { 0% { transform:scale(1); } 30% { transform:scale(1.5); } 60% { transform:scale(0.85); } 100% { transform:scale(1); } }
@keyframes pulse     { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
@keyframes spin      { to { transform:rotate(360deg); } }
@keyframes ticker    { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
@keyframes countUp   { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
@keyframes ripple    { from { transform:scale(0); opacity:0.6; } to { transform:scale(3); opacity:0; } }

.aFadeUp  { animation: fadeUp  0.5s var(--ease-out) both; }
.aFadeIn  { animation: fadeIn  0.3s var(--ease) both; }
.aScaleIn { animation: scaleIn 0.4s var(--spring) both; }
.aSlideUp { animation: slideUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }

.skeleton {
  background: linear-gradient(90deg, var(--bg3) 25%, #F4DDE8 50%, var(--bg3) 75%);
  background-size: 400% 100%;
  animation: shimmer 1.6s infinite;
}

/* ── NAV ── */
.nav {
  position: sticky; top: 0; z-index: 100;
  height: var(--nH);
  background: rgba(251,242,246,0.92);
  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center;
  padding: 0 clamp(16px, 5vw, 60px);
  transition: background 0.3s var(--ease), box-shadow 0.3s var(--ease);
}
.nav.scrolled {
  box-shadow: 0 2px 24px rgba(46,18,32,0.08);
}
.nav-inner {
  width: 100%; max-width: 1440px; margin: 0 auto;
  display: flex; align-items: center; gap: 12px;
}

/* ── BRAND ── */
.brand { display: flex; align-items: center; gap: 11px; margin-right: auto; cursor: pointer; text-decoration: none; }
.brand-logo {
  width: 38px; height: 38px; border-radius: 10px;
  background: var(--ink);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: transform 0.4s var(--spring), background 0.3s;
  position: relative; overflow: hidden;
}
.brand-logo::after {
  content: '';
  position: absolute; inset: 0;
  background: var(--accent);
  transform: translateY(100%);
  transition: transform 0.35s var(--ease);
}
.brand:hover .brand-logo::after { transform: translateY(0); }
.brand-logo svg { position: relative; z-index: 1; }
.brand-text { display: flex; flex-direction: column; }
.brand-name { font-size: 15px; font-weight: 700; color: var(--ink); letter-spacing: -0.03em; line-height: 1; }
.brand-sub { font-size: 9px; font-weight: 500; color: var(--ink3); letter-spacing: 0.14em; text-transform: uppercase; margin-top: 2px; }

/* ── TICKER ── */
.ticker-wrap {
  width: 100%; overflow: hidden;
  background: var(--ink); padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.ticker-track {
  display: flex; width: max-content;
  animation: ticker 40s linear infinite;
}
.ticker-track:hover { animation-play-state: paused; }
.ticker-item {
  display: flex; align-items: center; gap: 10px;
  padding: 0 32px;
  font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
  text-transform: uppercase; color: rgba(255,255,255,0.55);
  white-space: nowrap;
}
.ticker-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }

/* ── HERO ── */
.hero {
  padding: clamp(56px,10vw,120px) clamp(16px,5vw,60px) clamp(44px,7vw,88px);
  border-bottom: 1px solid var(--border);
  position: relative; overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute; top: -200px; right: -100px;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(214,51,108,0.07) 0%, transparent 70%);
  pointer-events: none;
}
.hero-wrap { max-width: 1440px; margin: 0 auto; display: grid; grid-template-columns: 1fr 280px; gap: 64px; align-items: end; }
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 12px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 24px;
}
.hero-line { width: 28px; height: 1.5px; background: currentColor; }
.hero-h1 {
  font-size: clamp(48px, 8vw, 96px);
  font-weight: 800; line-height: 0.93;
  letter-spacing: -0.04em; color: var(--ink);
  margin-bottom: 28px;
}
.hero-h1 em { font-style: italic; color: var(--accent); font-weight: 700; }
.hero-sub { font-size: 15px; font-weight: 300; color: var(--ink2); line-height: 1.9; max-width: 480px; margin-bottom: 40px; }

/* ── SEARCH ── */
.search-box { position: relative; max-width: 540px; }
.search-input {
  width: 100%; padding: 15px 18px 15px 52px;
  background: var(--bg1); color: var(--ink);
  border: 1.5px solid var(--border);
  border-radius: 14px;
  font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 400;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  box-shadow: 0 2px 12px rgba(46,18,32,0.06);
}
.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(214,51,108,0.12), 0 2px 12px rgba(46,18,32,0.06);
  background: #fff;
}
.search-input::placeholder { color: var(--ink4); }
.search-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--ink3); }
.search-clear {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  width: 28px; height: 28px; border-radius: 8px;
  background: var(--bg2); border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--ink3);
  transition: all 0.2s var(--ease);
}
.search-clear:hover { background: var(--bg3); color: var(--ink); }
.search-modes { display: flex; gap: 6px; margin-top: 12px; flex-wrap: wrap; }

/* ── STAT PANEL ── */
.stat-panel { width: 260px; flex-shrink: 0; }
.stat-item {
  padding: 18px 0;
  border-top: 1px solid var(--border);
  transition: padding 0.2s;
}
.stat-item:last-child { border-bottom: 1px solid var(--border); }
.stat-num { font-size: 44px; font-weight: 800; color: var(--ink); line-height: 1; letter-spacing: -0.04em; margin-bottom: 4px; }
.stat-label { font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink3); }

/* ── FILTER BAR ── */
.filter-bar {
  position: sticky; top: var(--nH); z-index: 80;
  background: rgba(251,242,246,0.92);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}
.filter-scroll {
  max-width: 1440px; margin: 0 auto;
  padding: 12px clamp(16px,5vw,60px);
  display: flex; align-items: center; gap: 8px;
  overflow-x: auto; scrollbar-width: none;
}
.filter-scroll::-webkit-scrollbar { display: none; }

/* ── CHIPS ── */
.chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 16px; border-radius: 99px;
  font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 500;
  border: 1.5px solid var(--border); color: var(--ink2);
  background: var(--bg1); cursor: pointer; white-space: nowrap; flex-shrink: 0;
  transition: all 0.2s var(--spring);
  box-shadow: 0 1px 4px rgba(46,18,32,0.04);
}
.chip:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(46,18,32,0.08); }
.chip.active { background: var(--ink); border-color: var(--ink); color: #fff; box-shadow: 0 4px 16px rgba(46,18,32,0.18); }
.chip.fav-active { background: var(--red); border-color: var(--red); color: #fff; }
.chip-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; margin: 0 4px; }

/* ── MAIN ── */
.main-wrap { max-width: 1440px; margin: 0 auto; padding: clamp(24px,4vw,48px) clamp(16px,5vw,60px) 120px; }
.toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; gap: 12px; flex-wrap: wrap; }
.result-count { font-size: 13px; font-weight: 400; color: var(--ink2); }
.result-count strong { color: var(--ink); font-weight: 700; font-size: 15px; }
.toolbar-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

/* ── SELECT SORT ── */
.sort-select {
  padding: 8px 14px; border-radius: 10px;
  border: 1.5px solid var(--border); background: var(--bg1); color: var(--ink2);
  font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 500;
  outline: none; cursor: pointer;
  transition: border-color 0.2s;
  box-shadow: 0 1px 4px rgba(46,18,32,0.04);
}
.sort-select:focus { border-color: var(--accent); }

/* ── VIEW / COL TOGGLES ── */
.toggle-group {
  display: flex; background: var(--bg2); border: 1.5px solid var(--border);
  border-radius: 10px; padding: 3px; gap: 2px;
}
.toggle-btn {
  background: transparent; border: none; cursor: pointer; color: var(--ink3);
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s var(--ease);
  font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600;
}
.toggle-btn.on { background: var(--bg1); color: var(--ink); box-shadow: 0 1px 6px rgba(46,18,32,0.08); }
.toggle-btn:hover:not(.on) { color: var(--ink2); }

/* ── GRID ── */
.recipe-grid { display: grid; gap: 20px; }
.g1 { grid-template-columns: 1fr; }
.g2 { grid-template-columns: repeat(2, 1fr); }
.g3 { grid-template-columns: repeat(3, 1fr); }
.g4 { grid-template-columns: repeat(4, 1fr); }

/* ── CARD ── */
.card {
  background: var(--bg1);
  border: 1.5px solid var(--border);
  border-radius: 20px;
  overflow: hidden; cursor: pointer;
  display: flex; flex-direction: column;
  transition: transform 0.4s var(--spring), box-shadow 0.4s var(--ease), border-color 0.25s;
  box-shadow: 0 2px 12px rgba(46,18,32,0.06);
  position: relative;
}
.card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 24px 60px rgba(46,18,32,0.14);
  border-color: var(--border2);
}
.card-thumb { position: relative; width: 100%; padding-bottom: 66%; overflow: hidden; flex-shrink: 0; }
.card-img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.7s var(--ease);
}
.card:hover .card-img { transform: scale(1.07); }
.card-grad { position: absolute; inset: 0; background: linear-gradient(to top, rgba(46,18,32,0.82) 0%, transparent 55%); pointer-events: none; }
.card-top-row { position: absolute; top: 12px; left: 12px; right: 12px; display: flex; justify-content: space-between; align-items: flex-start; z-index: 2; }
.card-bottom-row { position: absolute; bottom: 12px; left: 12px; z-index: 2; }
.card-hover-actions {
  display: flex; flex-direction: column; gap: 6px;
  opacity: 0; transform: translateX(8px);
  transition: opacity 0.2s, transform 0.3s var(--spring);
}
.card:hover .card-hover-actions { opacity: 1; transform: translateX(0); }
.card-body { padding: 18px; flex: 1; display: flex; flex-direction: column; }
.card-cuisine { font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); margin-bottom: 7px; }
.card-title { font-size: 18px; font-weight: 700; line-height: 1.25; color: var(--ink); margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card-metas { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
.card-meta { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500; color: var(--ink3); }
.card-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; flex: 1; }
.tag-pill {
  padding: 3px 10px; border-radius: 99px;
  font-size: 10px; font-weight: 500; font-family: 'Poppins', sans-serif;
  background: var(--bg2); color: var(--ink3);
  border: 1px solid var(--border);
}
.level-badge {
  display: inline-flex; align-items: center; padding: 3px 10px;
  border-radius: 99px; font-size: 10px; font-weight: 600; white-space: nowrap;
}
.img-badge {
  padding: 4px 10px; border-radius: 6px;
  font-size: 10px; font-weight: 600; letter-spacing: 0.05em;
}

/* ── COOK BUTTON ── */
.cook-btn {
  width: 100%; padding: 12px 16px;
  background: var(--ink); color: #fff; border: none; border-radius: 12px;
  font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
  position: relative; overflow: hidden;
  transition: transform 0.25s var(--spring), box-shadow 0.25s;
}
.cook-btn::before {
  content: '';
  position: absolute; inset: 0;
  background: var(--accent);
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.35s var(--ease);
}
.cook-btn:hover::before { transform: scaleX(1); }
.cook-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(46,18,32,0.16); }
.cook-btn:active { transform: translateY(0); }
.cook-btn > * { position: relative; z-index: 1; }

/* ── LIST ROW ── */
.list-row {
  background: var(--bg1); border: 1.5px solid var(--border); border-radius: 16px;
  display: flex; align-items: stretch; cursor: pointer; overflow: hidden;
  transition: transform 0.3s var(--spring), box-shadow 0.3s, border-color 0.2s;
  box-shadow: 0 1px 8px rgba(46,18,32,0.05);
}
.list-row:hover { transform: translateX(5px); box-shadow: -4px 0 0 var(--accent), 0 4px 20px rgba(46,18,32,0.1); border-color: var(--border2); }
.list-thumb { width: 110px; min-width: 110px; overflow: hidden; flex-shrink: 0; }
.list-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s var(--ease); }
.list-row:hover .list-thumb img { transform: scale(1.07); }
.list-body { flex: 1; padding: 15px 18px; display: flex; align-items: center; gap: 16px; min-width: 0; }

/* ── ICON BUTTONS ── */
.ibtn {
  background: var(--bg1); border: 1.5px solid var(--border); color: var(--ink2);
  border-radius: 10px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: all 0.2s var(--spring);
  box-shadow: 0 1px 4px rgba(46,18,32,0.05);
}
.ibtn:hover { background: var(--bg2); border-color: var(--border2); color: var(--ink); transform: scale(1.08); }
.ibtn:active { transform: scale(0.94); }
.ibtn.glass { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.25); color: rgba(255,255,255,0.9); backdrop-filter: blur(12px); }
.ibtn.glass:hover { background: rgba(255,255,255,0.32); color: #fff; transform: scale(1.08); }
.ibtn.danger:hover { background: rgba(192,48,48,0.1); border-color: rgba(192,48,48,0.4); color: var(--red); }

/* ── PRIMARY BTN ── */
.btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  font-family: 'Poppins', sans-serif; font-weight: 600; cursor: pointer; border: none;
  border-radius: 12px; white-space: nowrap; flex-shrink: 0;
  background: var(--ink); color: #fff;
  position: relative; overflow: hidden;
  transition: transform 0.25s var(--spring), box-shadow 0.25s;
  box-shadow: 0 2px 12px rgba(46,18,32,0.14);
}
.btn-primary::before {
  content: ''; position: absolute; inset: 0;
  background: var(--accent);
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.35s var(--ease);
}
.btn-primary:hover::before { transform: scaleX(1); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(46,18,32,0.18); }
.btn-primary:active { transform: translateY(0); }
.btn-primary > * { position: relative; z-index: 1; }

.btn-secondary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  font-family: 'Poppins', sans-serif; font-weight: 500; cursor: pointer;
  border: 1.5px solid var(--border); border-radius: 12px; white-space: nowrap;
  background: var(--bg1); color: var(--ink2);
  transition: all 0.2s var(--ease);
  box-shadow: 0 1px 6px rgba(46,18,32,0.05);
}
.btn-secondary:hover { border-color: var(--border2); color: var(--ink); background: var(--bg2); transform: translateY(-1px); }

/* ── FORM INPUTS ── */
.field-label { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink3); display: block; margin-bottom: 7px; }
.input {
  width: 100%; padding: 12px 14px;
  background: var(--bg1); color: var(--ink);
  border: 1.5px solid var(--border); border-radius: 10px;
  font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 400;
  outline: none; -webkit-appearance: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  box-shadow: 0 1px 4px rgba(46,18,32,0.04);
}
.input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(214,51,108,0.12); background: #fff; }
.input::placeholder { color: var(--ink4); }
.input-xl { font-size: 20px; font-weight: 700; padding: 14px 16px; }

/* ── BACKDROP ── */
.backdrop { position: fixed; inset: 0; z-index: 200; background: rgba(46,18,32,0.55); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); animation: fadeIn 0.25s var(--ease); }

/* ── DRAWER ── */
.drawer-wrap { position: fixed; inset: 0; z-index: 300; display: flex; align-items: flex-end; justify-content: center; }
.drawer {
  width: 100%; max-width: 680px; max-height: 95vh;
  background: var(--bg1); border-radius: 24px 24px 0 0;
  border: 1.5px solid var(--border); border-bottom: none;
  box-shadow: 0 -32px 80px rgba(46,18,32,0.18);
  display: flex; flex-direction: column; overflow: hidden;
  animation: slideUp 0.45s cubic-bezier(0.16,1,0.3,1) both;
}
.drawer-handle { width: 40px; height: 4px; border-radius: 99px; background: var(--border2); margin: 14px auto 0; flex-shrink: 0; }
.drawer-header { padding: 16px 28px 0; flex-shrink: 0; display: flex; justify-content: space-between; align-items: flex-start; }
.drawer-title { font-size: 24px; font-weight: 800; color: var(--ink); letter-spacing: -0.03em; }
.drawer-sub { font-size: 12px; color: var(--ink3); margin-top: 2px; font-weight: 400; }
.drawer-tabs { display: flex; padding: 14px 28px 0; border-bottom: 1px solid var(--border); flex-shrink: 0; gap: 2px; }
.drawer-tab {
  padding: 9px 18px; border: none; background: transparent;
  font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600;
  cursor: pointer; letter-spacing: 0.03em; color: var(--ink3);
  border-bottom: 2px solid transparent; margin-bottom: -1px;
  border-radius: 8px 8px 0 0;
  transition: all 0.2s var(--ease);
}
.drawer-tab.on { color: var(--accent); border-bottom-color: var(--accent); background: var(--accentBg); }
.drawer-body { flex: 1; overflow-y: auto; padding: 24px 28px; -webkit-overflow-scrolling: touch; }
.drawer-footer { padding: 16px 28px 32px; border-top: 1px solid var(--border); flex-shrink: 0; background: var(--bg2); }

/* ── MODAL ── */
.modal-wrap { position: fixed; inset: 0; z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal {
  width: 100%; max-width: 980px; max-height: 92vh;
  background: var(--bg1); border-radius: 24px;
  border: 1.5px solid var(--border);
  box-shadow: 0 48px 120px rgba(46,18,32,0.22);
  display: flex; flex-direction: column; overflow: hidden;
  animation: scaleIn 0.4s var(--spring) both;
}
.modal-hero { position: relative; height: 290px; flex-shrink: 0; overflow: hidden; }
.modal-hero img { width: 100%; height: 100%; object-fit: cover; }
.modal-hero-grad { position: absolute; inset: 0; background: linear-gradient(to top, rgba(46,18,32,0.95) 0%, rgba(46,18,32,0.2) 55%, transparent 100%); }
.modal-hero-top { position: absolute; top: 14px; left: 14px; right: 14px; display: flex; justify-content: flex-end; gap: 8px; }
.modal-hero-bot { position: absolute; bottom: 0; left: 0; right: 0; padding: 22px 28px; }
.modal-grid { display: grid; grid-template-columns: 1fr 340px; flex: 1; overflow: hidden; min-height: 0; }
.modal-left { overflow-y: auto; padding: 24px 28px; -webkit-overflow-scrolling: touch; }
.modal-right { overflow-y: auto; padding: 24px 22px; background: var(--bg2); border-left: 1px solid var(--border); -webkit-overflow-scrolling: touch; }

/* ── STAT ROW ── */
.stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 22px; }
.stat-card {
  background: var(--bg2); border: 1.5px solid var(--border); border-radius: 12px;
  padding: 13px 10px; text-align: center;
  transition: all 0.2s var(--spring);
  cursor: default;
}
.stat-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 6px 18px rgba(46,18,32,0.08); }
.stat-card-val { font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 3px; }
.stat-card-lbl { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink3); }

/* ── INGREDIENT ROW ── */
.ing-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 13px; background: var(--bg2); border: 1.5px solid var(--border);
  border-radius: 10px; margin-bottom: 6px;
  transition: all 0.2s var(--ease);
}
.ing-row:hover { border-color: var(--accent); transform: translateX(3px); }
.ing-qty { font-size: 11px; font-weight: 500; color: var(--ink2); background: var(--bg1); border: 1px solid var(--border); padding: 2px 10px; border-radius: 99px; }

/* ── TOGGLE ── */
.toggle-wrap { display: flex; align-items: center; gap: 12px; cursor: pointer; padding: 12px 14px; background: var(--bg2); border-radius: 12px; border: 1.5px solid var(--border); user-select: none; transition: border-color 0.2s; }
.toggle-wrap:hover { border-color: var(--border2); }
.toggle-track { width: 42px; height: 24px; border-radius: 12px; border: none; cursor: pointer; position: relative; flex-shrink: 0; transition: background 0.25s var(--ease); }
.toggle-thumb { position: absolute; top: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: left 0.25s var(--spring); box-shadow: 0 1px 4px rgba(0,0,0,0.2); }

/* ── COOK MODE ── */
.cook-screen { position: fixed; inset: 0; z-index: 400; background: var(--bg); overflow-y: auto; animation: fadeIn 0.3s var(--ease); }
.cook-topbar {
  position: sticky; top: 0; z-index: 10;
  background: rgba(251,242,246,0.94); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 14px clamp(16px,5vw,48px);
  box-shadow: 0 2px 16px rgba(46,18,32,0.06);
}
.cook-inner { max-width: 760px; margin: 0 auto; }
.cook-content { max-width: 760px; margin: 0 auto; padding: clamp(24px,4vw,48px) clamp(16px,4vw,32px) 120px; }
.step-card {
  display: flex; gap: 16px; padding: 18px 20px;
  background: var(--bg1); border: 1.5px solid var(--border); border-radius: 16px;
  cursor: pointer; margin-bottom: 10px; position: relative; overflow: hidden;
  transition: all 0.25s var(--spring);
  box-shadow: 0 1px 8px rgba(46,18,32,0.05);
}
.step-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--accent); transform: scaleY(0); transform-origin: top; transition: transform 0.3s var(--spring); }
.step-card:hover::before, .step-card.done::before { transform: scaleY(1); }
.step-card:hover { transform: translateX(6px); border-color: var(--border2); box-shadow: 0 4px 20px rgba(46,18,32,0.08); }
.step-card.done { opacity: 0.45; }
.step-num { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; background: var(--ink); color: #fff; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; transition: all 0.25s var(--spring); }
.step-card:hover .step-num { transform: scale(1.1); }
.step-card.done .step-num { background: var(--green); }
.cing-row {
  display: flex; align-items: center; gap: 13px; padding: 13px 15px;
  background: var(--bg1); border: 1.5px solid var(--border); border-radius: 12px;
  cursor: pointer; margin-bottom: 8px; user-select: none;
  transition: all 0.2s var(--spring);
  box-shadow: 0 1px 6px rgba(46,18,32,0.04);
}
.cing-row:hover { transform: translateX(5px); border-color: var(--border2); }
.cing-row.done { opacity: 0.4; }
.cbox { width: 22px; height: 22px; border-radius: 6px; flex-shrink: 0; border: 1.5px solid var(--border2); display: flex; align-items: center; justify-content: center; transition: all 0.2s var(--spring); }
.cing-row.done .cbox { background: var(--accent); border-color: var(--accent); }
.prog-bar { height: 3px; background: var(--bg3); border-radius: 99px; overflow: hidden; }
.prog-fill { height: 100%; background: var(--accent); border-radius: 99px; transition: width 0.5s var(--ease); }

/* ── TIMER ── */
.timer-display { font-size: 18px; font-weight: 700; color: var(--ink); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
.timer-active { color: var(--accent); animation: pulse 2s infinite; }

/* ── SHARE VIEW ── */
.share-card { background: var(--bg1); border: 1px solid var(--border); border-radius: 24px; padding: 24px; box-shadow: 0 16px 60px rgba(46,18,32,0.12); }
.share-kicker { font-size: 10px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--ink3); margin-bottom: 12px; }
.share-title { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 8px; }
.share-note { font-size: 13px; line-height: 1.7; color: var(--ink2); }
.share-cover { position: relative; border-radius: 16px; overflow: hidden; height: 220px; background: var(--bg3); margin-bottom: 14px; }
.share-cover-lg { height: clamp(240px, 40vh, 380px); border-radius: 20px; margin-bottom: 0; }
.share-cover-grad { position: absolute; inset: 0; background: linear-gradient(to top, rgba(46,18,32,0.85) 0%, transparent 55%); pointer-events: none; }
.share-cover-title { position: absolute; left: 18px; right: 18px; bottom: 14px; font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.02em; line-height: 1.15; text-shadow: 0 2px 14px rgba(0,0,0,.4); }
.share-cover-lg .share-cover-title { position: static; font-size: clamp(26px, 5vw, 40px); text-shadow: 0 2px 14px rgba(0,0,0,.4); }
.share-cover-bottom { position: absolute; left: 20px; right: 20px; bottom: 18px; }
.share-cover-cat { font-size: 10px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.6); margin-bottom: 6px; }
.share-page { max-width: 720px; margin: 0 auto; padding: clamp(16px, 4vw, 40px); }
.share-h { font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--ink3); margin: 24px 0 12px; }

/* ── STARS ── */
.star-btn { background: none; border: none; padding: 2px; cursor: pointer; transition: transform 0.2s var(--spring); }
.star-btn:hover { transform: scale(1.35) rotate(-5deg); }

/* ── TOAST ── */
.toast-host { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 500; display: flex; flex-direction: column; gap: 8px; align-items: center; pointer-events: none; min-width: 200px; max-width: calc(100vw - 32px); }
.toast { padding: 12px 20px; border-radius: 12px; background: var(--ink); color: #fff; font-size: 13px; font-weight: 500; box-shadow: 0 12px 40px rgba(46,18,32,0.25); display: flex; align-items: center; gap: 10px; animation: fadeUp 0.35s var(--spring) both; white-space: nowrap; }
.toast-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }

/* ── EMPTY ── */
.empty-state { text-align: center; padding: clamp(64px,12vw,120px) 20px; animation: fadeIn 0.4s var(--ease); }
.empty-icon { width: 80px; height: 80px; border-radius: 22px; background: var(--bg2); border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; animation: float 5s ease-in-out infinite; box-shadow: 0 4px 18px rgba(46,18,32,0.07); }
.empty-title { font-size: 30px; font-weight: 800; color: var(--ink); margin-bottom: 12px; letter-spacing: -0.03em; }
.empty-desc { font-size: 14px; font-weight: 300; color: var(--ink2); line-height: 1.9; max-width: 400px; margin: 0 auto 32px; }

/* ── FAB ── */
.fab { position: fixed; bottom: 22px; right: 22px; z-index: 90; width: 58px; height: 58px; border-radius: 50%; border: none; background: var(--ink); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 8px 28px rgba(46,18,32,0.24); transition: all 0.3s var(--spring); }
.fab:hover { transform: scale(1.12) rotate(8deg); background: var(--accent); box-shadow: 0 12px 36px rgba(212,85,12,0.38); }
.fab:active { transform: scale(0.94); }

/* ── QUICK STATS ── */
.qstats { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
.qstat-chip { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 99px; font-size: 11px; font-weight: 500; background: var(--bg2); border: 1px solid var(--border); color: var(--ink2); }

/* ── SERVING SCALER ── */
.scaler { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--bg2); border-radius: 12px; border: 1.5px solid var(--border); margin-bottom: 16px; }
.scaler-info { flex: 1; }
.scaler-label { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink3); margin-bottom: 2px; }
.scaler-count { font-size: 13px; font-weight: 600; color: var(--ink); }
.scaler-controls { display: flex; align-items: center; gap: 10px; }
.scaler-num { font-size: 22px; font-weight: 800; color: var(--ink); min-width: 28px; text-align: center; letter-spacing: -0.04em; }

/* ── NOTES BOX ── */
.notes-box { background: var(--accentBg); border: 1.5px solid rgba(212,85,12,0.18); border-radius: 14px; padding: 16px; margin-top: 18px; }
.notes-label { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }

/* ── MOBILE RESPONSIVE ── */
@media (max-width: 1200px) {
  .g4 { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 900px) {
  .hero-wrap { grid-template-columns: 1fr; }
  .stat-panel { display: none; }
  .modal-grid { grid-template-columns: 1fr; }
  .modal-right { display: none; }
  .g4, .g3 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  :root { --nH: 60px; }
  .g4, .g3, .g2 { grid-template-columns: 1fr; }
  .hero { padding: 40px 16px 32px; }
  .drawer-body { padding: 20px 20px; }
  .drawer-header { padding: 14px 20px 0; }
  .drawer-tabs { padding: 12px 20px 0; }
  .drawer-footer { padding: 14px 20px 28px; }
  .modal-wrap { padding: 0; }
  .modal { border-radius: 0; max-height: 100vh; }
  .modal-hero { height: 220px; }
  .list-thumb { width: 90px; min-width: 90px; }
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .recipe-grid { gap: 14px; }
}
@media (max-width: 400px) {
  .hero-h1 { font-size: 40px; }
  .drawer { max-height: 98vh; }
}

/* ── SECTION DIVIDER ── */
.divider { width: 100%; height: 1px; background: var(--border); margin: 20px 0; }

/* ── PRINT STYLES ── */
@media print {
  .nav, .filter-bar, .ticker-wrap, .fab, .toast-host { display: none; }
  .card { break-inside: avoid; }
}
`;

export function injectCss() {
  const id = 'mep-css2';
  if (!document.getElementById(id)) { const el = document.createElement('style'); el.id = id; el.textContent = CSS; document.head.appendChild(el); }
}
