import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { api, readLegacy } from './api.js';
import { CSS, injectCss } from './theme.js';

/* ══════════════════════════════════════════════════════════════
   MISE EN PLACE — Professional Recipe App
   Poppins · Blush Pink · Fully Animated · Feature-Rich
══════════════════════════════════════════════════════════════ */


/* ─── DATA ─── */
const UNITS = ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'oz', 'lb', 'pinch', 'piece', 'clove', 'bunch', 'slice', 'can'];
const LEVELS = ['Easy', 'Intermediate', 'Advanced'];
const LEVEL_C = { Easy: '#3A7A52', Intermediate: '#B8800C', Advanced: '#C03030' };
const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Appetizer', 'Side Dish', 'Soup', 'Salad', 'Drinks'];
const CUISINES = ['', 'Italian', 'French', 'Japanese', 'Indian', 'Mexican', 'Mediterranean', 'Chinese', 'Thai', 'Greek', 'Middle Eastern', 'American', 'Spanish', 'Korean', 'Vietnamese'];
const TAGS = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'healthy', 'quick', 'meal prep', 'spicy', 'one pot', 'under 30 min', 'high protein', 'low carb', 'comfort food', 'grilling', 'baking', 'make-ahead', 'kid-friendly', 'budget-friendly'];

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/* ─── HOOKS ─── */
function useMQ(q) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setM(mq.matches);
    const h = e => setM(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [q]);
  return m;
}
function useScrolled(threshold = 10) {
  const [s, setS] = useState(false);
  useEffect(() => { const fn = () => setS(window.scrollY > threshold); window.addEventListener('scroll', fn, { passive: true }); return () => window.removeEventListener('scroll', fn); }, [threshold]);
  return s;
}

/* ─── ICONS ─── */
const IC = {
  search: 'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  plus: 'M12 5v14M5 12h14',
  x: 'M18 6L6 18M6 6l12 12',
  trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-14v4l3 3',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8 4a4 4 0 1 0 0-8',
  flame: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  grid: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zm-11 0h7v7H3v-7z',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  back: 'M19 12H5m7-7-7 7 7 7',
  check: 'M20 6L9 17l-5-5',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  palette: 'M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10c0 1.66-1.34 3-3 3h-1.77c-.55 0-1 .45-1 1s.45 1 1 1c.55 0 1 .45 1 1 0 2.21-3.58 4-8 4zM7 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm4-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-2 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  camera: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  knife: 'M6.13 1L6 16a2 2 0 0 0 2 2h15M1 1l5.13 5',
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
  copy: 'M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z',
  timer: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-14v4l2 2',
  image: 'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-7v-4m0-4h.01',
  award: 'M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0 0l-2 6 2-1 2 1-2-6z',
  refresh: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  share: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13',
  sort: 'M3 6h18M3 12h12M3 18h6',
  print: 'M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z',
  scale: 'M12 3v18M3 9h18M3 15h18',
};
function I({ n, s = 18, c = 'currentColor', w = 1.7, style }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'block', ...style }}>
      <path d={IC[n] || IC.info} />
    </svg>
  );
}

/* ─── RECIPE IMAGE ─── */
export function RImg({ title, custom, style, className }) {
  const [src, setSrc] = useState(custom || null);
  const [ok, setOk] = useState(!!custom);
  const [err, setErr] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (custom) { setSrc(custom); setOk(true); return; }
    if (!title) { setErr(true); return; }
    setOk(false); setErr(false);
    const q = encodeURIComponent(title.replace(/[^a-z0-9 ]/gi, ' ').trim() + ' food dish');
    const url = `https://source.unsplash.com/800x560/?${q}`;
    const img = new Image();
    img.onload = () => { setSrc(url); setOk(true); };
    img.onerror = () => setErr(true);
    img.src = url;
  }, [title, custom]);
  if (!ok && !err) return <div className={`skeleton ${className || ''}`} style={style} />;
  if (err || !src) return (
    <div className={className} style={{ ...style, background: 'var(--bg3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--ink4)' }}>
      <I n="image" s={28} />
      <span style={{ fontSize: 11, fontWeight: 500 }}>No image</span>
    </div>
  );
  return <img src={src} alt={title} className={className} style={style} loading="lazy" />;
}

/* ─── STARS ─── */
function Stars({ value, onChange, readOnly }) {
  const [hov, setHov] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button" className="star-btn"
          style={{ pointerEvents: readOnly ? 'none' : 'auto', color: (hov || value) >= i ? 'var(--gold)' : 'var(--border2)' }}
          onMouseEnter={() => !readOnly && setHov(i)}
          onMouseLeave={() => !readOnly && setHov(0)}
          onClick={() => onChange && onChange(i)}>
          <I n="star" s={16} c="currentColor" w={(hov || value) >= i ? 0 : 1.7} style={{ fill: (hov || value) >= i ? 'currentColor' : 'none', transition: 'fill .15s' }} />
        </button>
      ))}
    </div>
  );
}

/* ─── LEVEL BADGE ─── */
export function LevelBadge({ level }) {
  const c = LEVEL_C[level] || '#888';
  return <span className="level-badge" style={{ background: c + '18', color: c, border: `1px solid ${c}30` }}>{level}</span>;
}

/* ─── TOAST ─── */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback(msg => {
    const id = uid();
    setToasts(p => [...p, { id, msg }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  }, []);
  return { toasts, push };
}

/* ─── TICKER ─── */
function Ticker({ recipes }) {
  const items = recipes.length > 0
    ? recipes.map(r => r.title)
    : ['Add your first recipe', 'Your culinary archive awaits', 'Cook with intention', 'Every recipe indexed'];
  const track = [...items, ...items, ...items, ...items];
  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {track.map((t, i) => (
          <span key={i} className="ticker-item">
            <span className="ticker-dot" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── RECIPE CARD (GRID) ─── */
function RecipeCard({ recipe: r, onView, onCook, onDelete, onFav, delay = 0 }) {
  const [favAnim, setFavAnim] = useState(false);
  const hFav = e => {
    e.stopPropagation();
    setFavAnim(true);
    onFav(r.id);
    setTimeout(() => setFavAnim(false), 400);
  };
  return (
    <div className="card aFadeUp" style={{ animationDelay: `${delay}s` }} onClick={() => onView(r)}>
      <div className="card-thumb">
        <RImg title={r.title} custom={r.image} className="card-img" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        <div className="card-grad" />
        <div className="card-top-row">
          {r.rating > 0 && (
            <span className="img-badge" style={{ background: 'rgba(46,18,32,.65)', backdropFilter: 'blur(8px)', color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
              <I n="star" s={10} c="var(--gold)" style={{ fill: 'var(--gold)' }} /> {r.rating}
            </span>
          )}
          <div className="card-hover-actions">
            <button className="ibtn glass" style={{ width: 32, height: 32, ...(favAnim ? { animation: 'heartPop .4s' } : {}) }} onClick={hFav}>
              <I n="heart" s={14} c={r.isFav ? '#E05555' : 'rgba(255,255,255,.85)'} style={{ fill: r.isFav ? '#E05555' : 'none', transition: 'fill .2s' }} />
            </button>
            <button className="ibtn glass danger" style={{ width: 32, height: 32 }} onClick={e => { e.stopPropagation(); onDelete(r.id); }}>
              <I n="trash" s={13} />
            </button>
          </div>
        </div>
        <div className="card-bottom-row">
          {r.category && <span className="img-badge" style={{ background: 'var(--accent)', color: '#fff' }}>{r.category}</span>}
        </div>
      </div>
      <div className="card-body">
        {r.cuisine && <div className="card-cuisine">{r.cuisine}</div>}
        <div className="card-title">{r.title}</div>
        <div className="card-metas">
          <span className="card-meta"><I n="clock" s={12} c="var(--ink4)" /> {r.time}m</span>
          <span className="card-meta"><I n="users" s={12} c="var(--ink4)" /> {r.servings} serv.</span>
          {r.calories && <span className="card-meta"><I n="flame" s={12} c="var(--ink4)" /> {r.calories}kcal</span>}
        </div>
        <div className="card-tags">
          <LevelBadge level={r.level} />
          {r.tags?.slice(0, 2).map(t => <span key={t} className="tag-pill">{t}</span>)}
        </div>
        <button className="cook-btn" onClick={e => { e.stopPropagation(); onCook(r); }}>
          <I n="knife" s={14} c="#fff" /><span>Cook Now</span>
        </button>
      </div>
    </div>
  );
}

/* ─── LIST ROW ─── */
function ListRow({ recipe: r, onView, onCook, onDelete, onFav, delay = 0 }) {
  const [favAnim, setFavAnim] = useState(false);
  return (
    <div className="list-row aFadeUp" style={{ animationDelay: `${delay}s` }} onClick={() => onView(r)}>
      <div className="list-thumb">
        <RImg title={r.title} custom={r.image} style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="list-body">
        <div style={{ flex: 1, minWidth: 0 }}>
          {(r.category || r.cuisine) && <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>{r.category || r.cuisine}</div>}
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="card-meta"><I n="clock" s={11} c="var(--ink4)" /> {r.time}m</span>
            <span className="card-meta"><I n="users" s={11} c="var(--ink4)" /> {r.servings}</span>
            <LevelBadge level={r.level} />
            {r.rating > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--gold)', fontWeight: 500 }}><I n="star" s={10} c="var(--gold)" style={{ fill: 'var(--gold)' }} />{r.rating}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: 12 }} onClick={e => { e.stopPropagation(); onCook(r); }}>Cook</button>
          <button className="ibtn" style={{ width: 34, height: 34, ...(favAnim ? { animation: 'heartPop .4s' } : {}) }} onClick={e => { e.stopPropagation(); setFavAnim(true); onFav(r.id); setTimeout(() => setFavAnim(false), 400); }}>
            <I n="heart" s={14} c={r.isFav ? '#E05555' : 'currentColor'} style={{ fill: r.isFav ? '#E05555' : 'none' }} />
          </button>
          <button className="ibtn danger" style={{ width: 34, height: 34 }} onClick={e => { e.stopPropagation(); onDelete(r.id); }}>
            <I n="trash" s={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── ADD / EDIT DRAWER ─── */
const BLANK = { title: '', time: 30, level: 'Easy', servings: 4, category: '', cuisine: '', calories: '', rating: 0, isFav: false, tags: [], notes: '', ingredients: [{ qty: '', unit: 'g', name: '' }], instructions: '', image: '' };

function AddDrawer({ open, initial, onClose, onSave, toast }) {
  const [d, setD] = useState(BLANK);
  const [tab, setTab] = useState(0);
  const [imgPrev, setImgPrev] = useState('');
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();
  const bodyRef = useRef();

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setD(initial ? { ...initial } : BLANK);
      setImgPrev(initial?.image || '');
      setTab(0);
      setTimeout(() => bodyRef.current?.scrollTo(0, 0), 50);
    }
  }, [open, initial]);

  const upd = p => setD(q => ({ ...q, ...p }));
  const updIng = (i, f, v) => { const a = [...d.ingredients]; a[i] = { ...a[i], [f]: v }; upd({ ingredients: a }); };
  const addIng = () => upd({ ingredients: [...d.ingredients, { qty: '', unit: 'g', name: '' }] });
  const rmIng = i => upd({ ingredients: d.ingredients.filter((_, j) => j !== i) });
  const togTag = t => upd({ tags: d.tags.includes(t) ? d.tags.filter(x => x !== t) : [...d.tags, t] });
  const loadFile = f => {
    if (!f) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type) || f.size > 200000) { toast('Use a JPG, PNG or WebP photo under 200 KB.'); return; }
    const reader = new FileReader();
    reader.onload = () => { setImgPrev(reader.result); upd({ image: reader.result }); };
    reader.onerror = () => toast('Could not read this photo. Try another one.');
    reader.readAsDataURL(f);
  };

  const submit = e => {
    e.preventDefault();
    if (!d.title.trim()) { toast('Recipe title is required'); return; }
    if (!d.instructions.trim()) { toast('Add at least one instruction step'); return; }
    onSave({ ...d, id: d.id || crypto.randomUUID() });
  };

  if (!open) return null;

  const TABS = ['Details', 'Ingredients', 'Method'];
  const fl = txt => <label className="field-label">{txt}</label>;

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="drawer-wrap">
        <div className="drawer">
          <div className="drawer-handle" />
          <div className="drawer-header">
            <div>
              <div className="drawer-title">{d.id ? 'Edit Recipe' : 'New Recipe'}</div>
              <div className="drawer-sub">Step {tab + 1} of 3 — {TABS[tab]}</div>
            </div>
            <button className="ibtn" style={{ width: 34, height: 34 }} onClick={onClose}><I n="x" s={15} /></button>
          </div>
          {/* Progress bar */}
          <div style={{ padding: '12px 28px 0', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {TABS.map((_, i) => (
                <div key={i} onClick={() => setTab(i)} style={{ flex: 1, height: 2, borderRadius: 99, cursor: 'pointer', background: i <= tab ? 'var(--accent)' : 'var(--border)', transition: 'background 0.35s' }} />
              ))}
            </div>
          </div>
          <div className="drawer-tabs">
            {TABS.map((t, i) => <button key={i} className={`drawer-tab ${tab === i ? 'on' : ''}`} onClick={() => setTab(i)}>{t}</button>)}
          </div>
          <form onSubmit={submit} style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div ref={bodyRef} className="drawer-body">
              <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

                {tab === 0 && <>
                  {/* Photo */}
                  <div>
                    {fl('Photo')}
                    <div
                      onClick={() => fileRef.current.click()}
                      onDragOver={e => { e.preventDefault(); setDrag(true); }}
                      onDragLeave={() => setDrag(false)}
                      onDrop={e => { e.preventDefault(); setDrag(false); loadFile(e.dataTransfer.files[0]); }}
                      style={{ height: 168, borderRadius: 14, overflow: 'hidden', cursor: 'pointer', border: `2px dashed ${drag ? 'var(--accent)' : 'var(--border2)'}`, background: drag ? 'var(--accentBg)' : 'var(--bg2)', transition: 'all .25s', position: 'relative' }}>
                      {imgPrev
                        ? <img src={imgPrev} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--ink3)' }}>
                          <I n="camera" s={30} />
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink2)' }}>Drop or click to upload</span>
                          <span style={{ fontSize: 11, color: 'var(--ink3)' }}>JPG, PNG or WebP · up to 200 KB</span>
                        </div>}
                      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => loadFile(e.target.files[0])} />
                    </div>
                    {imgPrev && <button type="button" onClick={() => { setImgPrev(''); upd({ image: '' }); }} style={{ marginTop: 6, fontSize: 11, color: 'var(--ink3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Poppins', fontWeight: 500 }}>Remove photo</button>}
                  </div>

                  <div>{fl('Recipe Title *')}<input required className="input input-xl" value={d.title} onChange={e => upd({ title: e.target.value })} placeholder="e.g. Braised Short Ribs" /></div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {[
                      ['Difficulty', <select className="input" value={d.level} onChange={e => upd({ level: e.target.value })}>{LEVELS.map(l => <option key={l}>{l}</option>)}</select>],
                      ['Category', <select className="input" value={d.category} onChange={e => upd({ category: e.target.value })}><option value="">Select...</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>],
                      ['Cook Time (min)', <input type="number" min={1} max={1440} className="input" value={d.time} onChange={e => upd({ time: parseInt(e.target.value) || 1 })} />],
                      ['Servings', <input type="number" min={1} max={100} className="input" value={d.servings} onChange={e => upd({ servings: parseInt(e.target.value) || 1 })} />],
                      ['Calories / serving', <input type="number" min={0} className="input" value={d.calories} onChange={e => upd({ calories: e.target.value })} placeholder="Optional" />],
                      ['Cuisine', <><input className="input" list="cuisine-options" maxLength={100} value={d.cuisine} onChange={e => upd({ cuisine: e.target.value })} placeholder="Pick one or type your own" /><datalist id="cuisine-options">{CUISINES.filter(Boolean).map(c => <option key={c} value={c} />)}</datalist></>],
                    ].map(([lbl, el]) => <div key={lbl}><label className="field-label">{lbl}</label>{el}</div>)}
                  </div>

                  <div>{fl('Your Rating')}<div style={{ marginTop: 4 }}><Stars value={d.rating} onChange={v => upd({ rating: v })} /></div></div>

                  <label className="toggle-wrap" onClick={() => upd({ isFav: !d.isFav })}>
                    <button type="button" className="toggle-track" style={{ background: d.isFav ? 'var(--accent)' : 'var(--border2)' }}>
                      <div className="toggle-thumb" style={{ left: d.isFav ? 21 : 3 }} />
                    </button>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Add to Favorites</div>
                      <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 2 }}>Pin to your favorites list</div>
                    </div>
                  </label>

                  <div>{fl('Tags')}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                      {TAGS.map(t => (
                        <button key={t} type="button" className={`chip ${d.tags.includes(t) ? 'active' : ''}`} style={{ fontSize: 11, padding: '5px 12px' }} onClick={() => togTag(t)}>{t}</button>
                      ))}
                    </div>
                  </div>
                </>}

                {tab === 1 && <>
                  <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.7, background: 'var(--bg2)', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--border)' }}>Add all ingredients with exact quantities for precise cooking mode.</p>
                  {d.ingredients.map((ing, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--bg2)', borderRadius: 12, padding: '10px 12px', border: '1.5px solid var(--border)' }}>
                      <span style={{ fontSize: 11, color: 'var(--ink3)', fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{i + 1}</span>
                      <input placeholder="Qty" value={ing.qty} onChange={e => updIng(i, 'qty', e.target.value)} className="input" style={{ width: 64, padding: '8px', fontSize: 13, textAlign: 'center' }} />
                      <select value={ing.unit} onChange={e => updIng(i, 'unit', e.target.value)} className="input" style={{ width: 78, padding: '8px', fontSize: 12 }}>
                        {UNITS.map(u => <option key={u}>{u}</option>)}
                      </select>
                      <input required placeholder="Ingredient name" value={ing.name} onChange={e => updIng(i, 'name', e.target.value)} className="input" style={{ flex: 1, background: 'transparent', border: 'none', boxShadow: 'none', padding: '8px 6px' }} />
                      <button type="button" className="ibtn danger" style={{ width: 28, height: 28 }} onClick={() => rmIng(i)}><I n="x" s={13} /></button>
                    </div>
                  ))}
                  <button type="button" className="btn-secondary" style={{ width: '100%', padding: 12, fontSize: 13, borderStyle: 'dashed' }} onClick={addIng}><I n="plus" s={15} /> Add Ingredient</button>
                </>}

                {tab === 2 && <>
                  <div>
                    {fl('Cooking Instructions * — separate each step with a period')}
                    <textarea required className="input" value={d.instructions} onChange={e => upd({ instructions: e.target.value })}
                      placeholder="Preheat the oven to 220°C. Season the meat generously with salt. Heat oil in a heavy pan. Sear on all sides until golden brown."
                      style={{ resize: 'vertical', minHeight: 200, lineHeight: 1.8 }} />
                  </div>
                  <div>
                    {fl("Chef's Notes — optional")}
                    <textarea className="input" value={d.notes} onChange={e => upd({ notes: e.target.value })}
                      placeholder="Wine pairing, substitutions, make-ahead tips, storage instructions..."
                      style={{ resize: 'vertical', minHeight: 90, lineHeight: 1.8 }} />
                  </div>
                  {d.instructions.trim() && (
                    <div style={{ background: 'var(--bg2)', border: '1.5px solid var(--border)', borderRadius: 12, padding: 16 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 12 }}>Preview — {d.instructions.split('.').filter(s => s.trim()).length} steps</div>
                      {d.instructions.split('.').filter(s => s.trim()).slice(0, 3).map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, fontWeight: 700, color: '#fff' }}>{i + 1}</div>
                          <p style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--ink2)', paddingTop: 2 }}>{s.trim()}.</p>
                        </div>
                      ))}
                      {d.instructions.split('.').filter(s => s.trim()).length > 3 && <p style={{ fontSize: 11, color: 'var(--ink3)', fontStyle: 'italic' }}>+{d.instructions.split('.').filter(s => s.trim()).length - 3} more steps...</p>}
                    </div>
                  )}
                </>}
              </div>
            </div>
            <div className="drawer-footer">
              <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', gap: 10 }}>
                {tab > 0 && <button type="button" className="btn-secondary" style={{ flex: 1, padding: 12, fontSize: 13 }} onClick={() => setTab(t => t - 1)}>← Back</button>}
                {tab < 2
                  ? <button type="button" className="btn-primary" style={{ flex: 3, padding: 12, fontSize: 14 }} onClick={() => setTab(t => t + 1)}><span>Continue →</span></button>
                  : <button type="submit" className="btn-primary" style={{ flex: 3, padding: 13, fontSize: 14 }}><I n={d.id ? 'check' : 'book'} s={15} /><span>{d.id ? 'Save Changes' : 'Save Recipe'}</span></button>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

/* ─── DETAIL MODAL ─── */
function DetailModal({ recipe: r, onClose, onEdit, onCook, onFav, onShareChange, push }) {
  const [scaled, setScaled] = useState(r?.servings || 4);
  const [favAnim, setFavAnim] = useState(false);
  const [shared, setShared] = useState(!!r?.shared);
  const [sharing, setSharing] = useState(false);
  if (!r) return null;
  const steps = r.instructions.split('.').map(s => s.trim()).filter(Boolean);
  const ratio = scaled / r.servings;

  const hFav = () => { setFavAnim(true); onFav(r.id); setTimeout(() => setFavAnim(false), 400); push(r.isFav ? 'Removed from favorites' : 'Added to favorites!'); };
  const share = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const data = await api(`/recipes/${r.id}/share`, { method: 'PUT', body: {} });
      await navigator.clipboard.writeText(`${window.location.origin}/r/${data.share_token}`);
      setShared(true); onShareChange?.(r.id, true);
      push('Share link copied! The cover is public; viewing needs sign-in.');
    } catch (e) { push('Could not create the share link. ' + e.message); }
    finally { setSharing(false); }
  };
  const unshare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      await api(`/recipes/${r.id}/share`, { method: 'DELETE', body: {} });
      setShared(false); onShareChange?.(r.id, false);
      push('Sharing stopped. The link no longer works.');
    } catch (e) { push('Could not stop sharing. ' + e.message); }
    finally { setSharing(false); }
  };
  const copy = () => {
    const txt = [`# ${r.title}`, `${r.level} · ${r.time}min · ${r.servings} servings`, '', '## Ingredients', ...r.ingredients.map(i => `- ${i.qty} ${i.unit} ${i.name}`), '', '## Method', ...steps.map((s, i) => `${i + 1}. ${s}.`)].join('\n');
    navigator.clipboard.writeText(txt);
    push('Recipe copied to clipboard!');
  };
  const scaleQty = qty => { const n = parseFloat(qty); if (isNaN(n)) return qty; const res = n * ratio; return res % 1 === 0 ? res : parseFloat(res.toFixed(2)); };

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="modal-wrap">
        <div className="modal">
          <div className="modal-hero">
            <RImg title={r.title} custom={r.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div className="modal-hero-grad" />
            <div className="modal-hero-top">
              <button className="ibtn glass" style={{ width: 36, height: 36, ...(favAnim ? { animation: 'heartPop .4s' } : {}) }} onClick={hFav}><I n="heart" s={15} c={r.isFav ? '#E05555' : 'rgba(255,255,255,.85)'} style={{ fill: r.isFav ? '#E05555' : 'none', transition: 'fill .2s' }} /></button>
              <button className="ibtn glass" style={{ width: 36, height: 36 }} onClick={share} disabled={sharing} title="Copy public share link"><I n="share" s={15} /></button>
              <button className="ibtn glass" style={{ width: 36, height: 36 }} onClick={copy}><I n="copy" s={15} /></button>
              <button className="ibtn glass" style={{ width: 36, height: 36 }} onClick={onClose}><I n="x" s={16} /></button>
            </div>
            <div className="modal-hero-bot">
              {r.category && <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginBottom: 7 }}>{r.category}</div>}
              <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.03em', textShadow: '0 2px 14px rgba(0,0,0,.4)', marginBottom: 10 }}>{r.title}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <LevelBadge level={r.level} />
                {r.cuisine && <span style={{ fontSize: 11, color: 'rgba(255,255,255,.65)', fontWeight: 400 }}>{r.cuisine}</span>}
                {r.isFav && <span style={{ fontSize: 10, fontWeight: 600, color: '#ffaaaa', background: 'rgba(224,85,85,.18)', padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(224,85,85,.3)' }}>Favorited</span>}
              </div>
            </div>
          </div>
          <div className="modal-grid">
            <div className="modal-left">
              <div className="stats-row">
                {[{ n: 'clock', l: 'Time', v: `${r.time}m` }, { n: 'users', l: 'Serves', v: r.servings }, { n: 'star', l: 'Rating', v: r.rating > 0 ? `${r.rating}/5` : '—' }, { n: 'flame', l: 'Kcal', v: r.calories || '—' }].map(m => (
                  <div key={m.l} className="stat-card">
                    <I n={m.n} s={14} c="var(--accent)" style={{ margin: '0 auto 5px' }} />
                    <div className="stat-card-val">{m.v}</div>
                    <div className="stat-card-lbl">{m.l}</div>
                  </div>
                ))}
              </div>
              {r.tags?.length > 0 && <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>{r.tags.map(t => <span key={t} className="tag-pill">{t}</span>)}</div>}

              {/* Serving Scaler */}
              <div className="scaler">
                <div className="scaler-info">
                  <div className="scaler-label">Serving Scaler</div>
                  <div className="scaler-count">{scaled} {scaled === 1 ? 'serving' : 'servings'}</div>
                </div>
                <div className="scaler-controls">
                  <button className="ibtn" style={{ width: 30, height: 30 }} onClick={() => setScaled(s => Math.max(1, s - 1))}><I n="x" s={11} /></button>
                  <span className="scaler-num">{scaled}</span>
                  <button className="ibtn" style={{ width: 30, height: 30 }} onClick={() => setScaled(s => s + 1)}><I n="plus" s={13} /></button>
                </div>
              </div>

              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 12 }}>Ingredients</div>
              {r.ingredients.map((ing, i) => (
                <div key={i} className="ing-row">
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{ing.name}</span>
                  <span className="ing-qty">{scaleQty(ing.qty)} {ing.unit}</span>
                </div>
              ))}

              {r.notes && (
                <div className="notes-box">
                  <div className="notes-label">Chef's Notes</div>
                  <p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--ink2)' }}>{r.notes}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                <button className="btn-secondary" style={{ flex: 1, padding: 11, fontSize: 13 }} onClick={onEdit}><I n="edit" s={14} /> Edit</button>
                <button className="btn-primary" style={{ flex: 2, padding: 12, fontSize: 14 }} onClick={onCook}><I n="knife" s={15} /><span>Start Cooking</span></button>
              </div>
              {shared && (
                <p style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 12, textAlign: 'center' }}>
                  Shared by link.{' '}
                  <button onClick={unshare} disabled={sharing} style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' }}>Stop sharing</button>
                </p>
              )}
            </div>
            <div className="modal-right">
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 16 }}>Method — {steps.length} steps</div>
              {steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 700, color: '#fff', boxShadow: '0 2px 10px rgba(46,18,32,0.18)' }}>{i + 1}</div>
                  <p style={{ fontSize: 13, lineHeight: 1.85, color: 'var(--ink2)', paddingTop: 4 }}>{s}.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── COOK MODE ─── */
function CookMode({ recipe: r, onClose }) {
  const [tab, setTab] = useState(0);
  const [ingDone, setIngDone] = useState([]);
  const [stepsDone, setStepsDone] = useState([]);
  const [secs, setSecs] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [fontSize, setFontSize] = useState(15);
  const steps = useMemo(() => r.instructions.split('.').map(s => s.trim()).filter(Boolean), [r]);
  const prog = tab === 0 ? (r.ingredients.length ? ingDone.length / r.ingredients.length : 0) : (steps.length ? stepsDone.length / steps.length : 0);

  useEffect(() => {
    if (!timerOn) return;
    const id = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [timerOn]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const togI = i => setIngDone(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  const togS = i => setStepsDone(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  const allDone = tab === 1 && stepsDone.length === steps.length && steps.length > 0;

  return (
    <div className="cook-screen">
      <div className="cook-topbar">
        <div className="cook-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <button className="ibtn" style={{ width: 36, height: 36 }} onClick={onClose}><I n="back" s={16} /></button>
            <div style={{ flex: 1, minWidth: 0, fontSize: 17, fontWeight: 700, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.02em' }}>{r.title}</div>
            {/* Font size control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button className="ibtn" style={{ width: 28, height: 28 }} onClick={() => setFontSize(s => Math.max(12, s - 1))} title="Smaller"><I n="x" s={10} /></button>
              <span style={{ fontSize: 10, color: 'var(--ink3)', width: 18, textAlign: 'center', fontWeight: 600 }}>{fontSize}</span>
              <button className="ibtn" style={{ width: 28, height: 28 }} onClick={() => setFontSize(s => Math.min(22, s + 1))} title="Larger"><I n="plus" s={11} /></button>
            </div>
            {/* Timer */}
            <span className={`timer-display ${secs > 0 ? 'timer-active' : ''}`}>{fmt(secs)}</span>
            <button className="ibtn" style={{ width: 32, height: 32, background: timerOn ? 'var(--ink)' : '', borderColor: timerOn ? 'var(--ink)' : '' }} onClick={() => setTimerOn(t => !t)}>
              <I n={timerOn ? 'check' : 'timer'} s={14} c={timerOn ? '#fff' : 'currentColor'} />
            </button>
            {secs > 0 && <button className="ibtn" style={{ width: 32, height: 32 }} onClick={() => { setSecs(0); setTimerOn(false); }}><I n="refresh" s={13} /></button>}
          </div>
          <div className="prog-bar"><div className="prog-fill" style={{ width: `${prog * 100}%` }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink3)' }}>
            <span style={{ color: prog > 0 ? 'var(--accent)' : 'var(--ink3)' }}>{Math.round(prog * 100)}% done</span>
            <span>{tab === 0 ? `${ingDone.length}/${r.ingredients.length} prepped` : `${stepsDone.length}/${steps.length} steps`}</span>
          </div>
        </div>
      </div>

      <div className="cook-content">
        <div style={{ borderRadius: 20, overflow: 'hidden', height: 220, marginBottom: 28, position: 'relative', boxShadow: '0 4px 24px rgba(46,18,32,0.12)' }}>
          <RImg title={r.title} custom={r.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(46,18,32,.88), transparent 55%)' }} />
          <div style={{ position: 'absolute', bottom: 20, left: 22, fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', textShadow: '0 2px 12px rgba(0,0,0,.4)' }}>{r.title}</div>
          {r.time && <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(8px)', padding: '5px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600, color: '#fff', border: '1px solid rgba(255,255,255,.2)' }}>{r.time} min</div>}
        </div>

        {/* Tab Toggle */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg2)', border: '1.5px solid var(--border)', borderRadius: 14, padding: 4, marginBottom: 24, gap: 4 }}>
          {['Ingredients', 'Method'].map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{ padding: '12px', borderRadius: 10, border: 'none', cursor: 'pointer', background: tab === i ? 'var(--ink)' : 'transparent', color: tab === i ? '#fff' : 'var(--ink2)', fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 13, transition: 'all .25s var(--spring)' }}>
              {t} <span style={{ fontSize: 11, opacity: 0.65 }}>({i === 0 ? `${ingDone.length}/${r.ingredients.length}` : `${stepsDone.length}/${steps.length}`})</span>
            </button>
          ))}
        </div>

        {tab === 0 && <>
          {r.ingredients.map((ing, i) => (
            <div key={i} className={`cing-row ${ingDone.includes(i) ? 'done' : ''}`} onClick={() => togI(i)}>
              <div className="cbox">{ingDone.includes(i) && <I n="check" s={11} c="#fff" w={2.5} />}</div>
              <span style={{ flex: 1, fontSize: fontSize, fontWeight: 500, color: 'var(--ink)', textDecoration: ingDone.includes(i) ? 'line-through' : 'none' }}>{ing.name}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: 'var(--ink2)', background: 'var(--bg2)', padding: '3px 10px', borderRadius: 99 }}>{ing.qty} {ing.unit}</span>
            </div>
          ))}
          {ingDone.length === r.ingredients.length && r.ingredients.length > 0 && (
            <button className="btn-primary aScaleIn" style={{ width: '100%', padding: 14, fontSize: 14, marginTop: 14 }} onClick={() => setTab(1)}>
              <I n="check" s={16} /><span>All prepped — Let's Cook!</span>
            </button>
          )}
        </>}

        {tab === 1 && <>
          {steps.map((s, i) => (
            <div key={i} className={`step-card ${stepsDone.includes(i) ? 'done' : ''}`} onClick={() => togS(i)}>
              <div className="step-num">{stepsDone.includes(i) ? <I n="check" s={14} c="#fff" w={2.5} /> : i + 1}</div>
              <p style={{ fontSize: fontSize, lineHeight: 1.85, color: 'var(--ink)', flex: 1, textDecoration: stepsDone.includes(i) ? 'line-through' : 'none', paddingTop: 3 }}>{s}.</p>
            </div>
          ))}
          {allDone && (
            <div className="aScaleIn" style={{ textAlign: 'center', padding: '56px 20px' }}>
              <div style={{ width: 80, height: 80, borderRadius: 22, background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 32px rgba(46,18,32,0.2)', animation: 'float 3s ease-in-out infinite' }}>
                <I n="award" s={36} c="#fff" />
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--ink)', marginBottom: 10, letterSpacing: '-0.04em' }}>Bon Appétit!</div>
              <p style={{ fontSize: 15, color: 'var(--ink2)', marginBottom: secs > 0 ? 8 : 28, lineHeight: 1.7, fontWeight: 300 }}>Your {r.title} is complete.</p>
              {secs > 0 && <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', marginBottom: 28, letterSpacing: '.04em' }}>Cooked in {fmt(secs)}</p>}
              <button className="btn-primary" style={{ padding: '14px 40px', fontSize: 14 }} onClick={onClose}><span>Back to Collection</span></button>
            </div>
          )}
        </>}
      </div>
    </div>
  );
}

/* ─── EMPTY STATE ─── */
function EmptyState({ search, onAdd }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><I n={search ? 'search' : 'book'} s={32} c="var(--ink3)" /></div>
      <div className="empty-title">{search ? `No results for "${search}"` : 'Nothing here yet'}</div>
      <p className="empty-desc">{search ? 'Try different keywords or clear your search.' : 'Build your personal culinary archive — every dish you love, organized and ready to cook.'}</p>
      {!search && <button className="btn-primary" style={{ padding: '14px 32px', fontSize: 14 }} onClick={onAdd}><I n="plus" s={16} /><span>Add Your First Recipe</span></button>}
    </div>
  );
}

/* ─── MAIN APP ─── */
export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [storageState, setStorageState] = useState('loading');
  const [storageError, setStorageError] = useState('');
  const [legacy, setLegacy] = useState(readLegacy);
  const operation = useRef(false);
  useEffect(() => {
    let active = true;
    api('/recipes').then(data => { if (active) { setRecipes(data.recipes); setStorageState('ready'); } }).catch(e => { if (active) { setStorageError(e.message); setStorageState('error'); } });
    return () => { active = false; };
  }, []);
  const [search, setSearch] = useState('');
  const [searchMode, setSearchMode] = useState('all');
  const [catFilter, setCatFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [cols, setCols] = useState(3);
  const [favOnly, setFavOnly] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editRecipe, setEditRecipe] = useState(null);
  const [viewRecipe, setViewRecipe] = useState(null);
  const [cookRecipe, setCookRecipe] = useState(null);
  const { toasts, push } = useToast();
  const scrolled = useScrolled(12);
  const isSm = useMQ('(max-width:640px)');
  const isMd = useMQ('(max-width:900px)');
  const isLg = useMQ('(max-width:1200px)');

  /* Inject CSS (idempotent; main.jsx also calls injectCss for the public share view) */
  useEffect(() => { injectCss(); }, []);

  /* Responsive columns */
  useEffect(() => {
    if (isSm) setCols(1);
    else if (isMd) setCols(2);
    else if (isLg) setCols(3);
    else setCols(4);
  }, [isSm, isMd, isLg]);

  const mutate = async action => {
    if (operation.current || storageState !== 'ready') return false;
    if (!navigator.onLine) { push('Offline: reconnect to save changes.'); return false; }
    operation.current = true;
    try { await action(); return true; }
    catch (e) { push(e.message); return false; }
    finally { operation.current = false; }
  };
  const save = async r => mutate(async () => {
    const { recipe } = await api(`/recipes/${encodeURIComponent(r.id)}`, { method: 'PUT', body: r });
    setRecipes(p => p.find(x => x.id === recipe.id) ? p.map(x => x.id === recipe.id ? recipe : x) : [recipe, ...p]);
    setDrawerOpen(false); setEditRecipe(null); push('Recipe saved to your private collection');
  });
  const del = async id => {
    if (!window.confirm('Remove this recipe?')) return;
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return;
    await mutate(async () => {
      await api(`/recipes/${encodeURIComponent(id)}`, { method: 'DELETE', body: { version: recipe.version } });
      setRecipes(p => p.filter(r => r.id !== id)); setViewRecipe(null); push('Recipe removed');
    });
  };
  const fav = async id => {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return;
    await mutate(async () => {
      const data = await api(`/recipes/${encodeURIComponent(id)}`, { method: 'PUT', body: { ...recipe, isFav: !recipe.isFav } });
      setRecipes(p => p.map(r => r.id === id ? data.recipe : r));
    });
  };
  const importLegacy = async () => {
    if (!window.confirm('Copy this browser’s old recipes into the account currently shown above? Originals will remain on this browser.')) return;
    await mutate(async () => {
      const importedKey = 'mep-imported-' + (await api('/me')).user.username;
      let imported;
      try { imported = JSON.parse(localStorage.getItem(importedKey) || '{}'); } catch { imported = {}; }
      const known = recipes.map(r => r.id);
      let copied = 0;
      for (const old of legacy) {
        // Remember source-to-target mapping so a partial retry cannot duplicate successful copies.
        const targetId = imported[old.id] || crypto.randomUUID();
        if (known.includes(targetId)) continue;
        if (old.image?.startsWith('blob:')) throw new Error('An old recipe has a temporary photo. Re-add or remove its photo before importing. Nothing was removed.');
        const { recipe } = await api(`/recipes/${targetId}`, { method: 'PUT', body: { ...old, id: targetId, version: 0 } });
        imported[old.id] = targetId;
        localStorage.setItem(importedKey, JSON.stringify(imported));
        setRecipes(p => [recipe, ...p]); copied++;
      }
      setLegacy([]); push(`${copied} recipes copied. Browser originals were kept.`);
    });
  };
  const openAdd = () => { if (storageState !== 'ready') { push('Wait until your recipes load.'); return; } setEditRecipe(null); setDrawerOpen(true); };
  const openEdit = useCallback(r => { setViewRecipe(null); setEditRecipe(r); setDrawerOpen(true); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let r = [...recipes];
    if (q) r = r.filter(x => {
      if (searchMode === 'ingredient') return x.ingredients.some(i => i.name.toLowerCase().includes(q));
      if (searchMode === 'name') return x.title.toLowerCase().includes(q);
      return x.title.toLowerCase().includes(q)
        || x.ingredients.some(i => i.name.toLowerCase().includes(q))
        || (x.category || '').toLowerCase().includes(q)
        || (x.cuisine || '').toLowerCase().includes(q)
        || (x.tags || []).some(t => t.toLowerCase().includes(q));
    });
    if (favOnly) r = r.filter(x => x.isFav);
    if (catFilter) r = r.filter(x => x.category === catFilter);
    if (tagFilter) r = r.filter(x => x.tags?.includes(tagFilter));
    r.sort((a, b) => {
      if (sortBy === 'newest') return 0; // Server returns creation order; UUIDs are not timestamps.
      if (sortBy === 'quickest') return a.time - b.time;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0;
    });
    return r;
  }, [recipes, search, searchMode, favOnly, catFilter, tagFilter, sortBy]);

  const allTags = useMemo(() => [...new Set(recipes.flatMap(r => r.tags || []))].sort(), [recipes]);
  const usedCats = useMemo(() => [...new Set(recipes.map(r => r.category).filter(Boolean))], [recipes]);
  const favCount = useMemo(() => recipes.filter(r => r.isFav).length, [recipes]);
  const avgTime = useMemo(() => recipes.length ? Math.round(recipes.reduce((s, r) => s + (r.time || 0), 0) / recipes.length) : 0, [recipes]);
  const cuisineCount = useMemo(() => new Set(recipes.map(r => r.cuisine).filter(Boolean)).size, [recipes]);
  const gridClass = viewMode === 'list' ? '' : `g${cols}`;

  if (cookRecipe) return <CookMode recipe={cookRecipe} onClose={() => setCookRecipe(null)} />;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'Poppins, sans-serif' }}>

      {/* TICKER */}
      {storageState === 'loading' && <div className="storage-note" role="status">Loading your private collection...</div>}
      {storageState === 'error' && <div className="storage-note" role="alert">Could not load recipes: {storageError}. No local data was removed.<button onClick={() => window.location.reload()}>Retry</button></div>}
      {storageState === 'ready' && legacy.length > 0 && <div className="storage-note">{legacy.length} old recipes are still on this browser. Import only if they belong to you.<button onClick={importLegacy}>Copy into my account</button></div>}
      <Ticker recipes={recipes} />

      {/* NAV */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="brand" onClick={() => { setCatFilter(''); setTagFilter(''); setFavOnly(false); setSearch(''); }}>
            <div className="brand-logo">
              <I n="knife" s={15} c="#fff" w={2} />
            </div>
            <div className="brand-text">
              <span className="brand-name">Mise en Place</span>
              {!isSm && <span className="brand-sub">Recipe Archive</span>}
            </div>
          </div>

          {/* Nav stats */}
          {!isSm && recipes.length > 0 && (
            <div style={{ display: 'flex', gap: 18, padding: '0 18px', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
              {[{ n: recipes.length, l: 'recipes' }, { n: favCount, l: 'favorites' }].map(s => (
                <span key={s.l} style={{ fontSize: 12, color: 'var(--ink3)', fontWeight: 400 }}>
                  <span style={{ color: 'var(--ink)', fontWeight: 700, fontSize: 14 }}>{s.n}</span> {s.l}
                </span>
              ))}
            </div>
          )}

          <button className="btn-primary" style={{ padding: isSm ? '8px 14px' : '9px 20px', fontSize: 13 }} onClick={openAdd}>
            <I n="plus" s={16} />{!isSm && <span>Add Recipe</span>}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-wrap">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="hero-eyebrow aFadeUp" style={{ animationDelay: '.05s' }}>
              <span className="hero-line" />Personal Recipe Archive
            </div>
            <h1 className="hero-h1 aFadeUp" style={{ animationDelay: '.1s' }}>Cook with<br /><em>intention.</em></h1>
            <p className="hero-sub aFadeUp" style={{ animationDelay: '.15s' }}>Your personal culinary library — every recipe indexed, searchable, and ready to guide you through each dish with precision.</p>
            <div className="aFadeUp" style={{ animationDelay: '.2s' }}>
              <div className="search-box" style={{ marginBottom: 12 }}>
                <span className="search-icon"><I n="search" s={17} /></span>
                <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder={searchMode === 'ingredient' ? 'Search by ingredient...' : searchMode === 'name' ? 'Search by recipe name...' : 'Search recipes, ingredients, cuisine...'} />
                {search && <button className="search-clear" onClick={() => setSearch('')}><I n="x" s={12} /></button>}
              </div>
              <div className="search-modes">
                {[['all', 'Everything'], ['name', 'By Name'], ['ingredient', 'By Ingredient']].map(([v, l]) => (
                  <button key={v} className={`chip ${searchMode === v ? 'active' : ''}`} style={{ fontSize: 11, padding: '5px 14px' }} onClick={() => setSearchMode(v)}>{l}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="stat-panel aFadeUp" style={{ animationDelay: '.25s' }}>
            {[{ num: recipes.length, label: 'Recipes' }, { num: favCount, label: 'Favorites' }, { num: cuisineCount || '—', label: 'Cuisines' }, { num: avgTime ? `${avgTime}m` : '—', label: 'Avg. Time' }].map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <div className="filter-scroll">
          <I n="filter" s={13} c="var(--ink3)" style={{ flexShrink: 0 }} />
          <button className={`chip ${!catFilter && !favOnly && !tagFilter ? 'active' : ''}`} onClick={() => { setCatFilter(''); setFavOnly(false); setTagFilter(''); }}>All</button>
          {usedCats.map(c => <button key={c} className={`chip ${catFilter === c ? 'active' : ''}`} onClick={() => { setCatFilter(catFilter === c ? '' : c); setFavOnly(false); }}>{c}</button>)}
          {favCount > 0 && (
            <><div className="chip-sep" />
              <button className={`chip ${favOnly ? 'fav-active' : ''}`} onClick={() => { setFavOnly(!favOnly); setCatFilter(''); }}>
                <I n="heart" s={10} c="inherit" style={{ fill: favOnly ? '#fff' : 'none' }} /> Favorites
              </button>
            </>
          )}
          {allTags.length > 0 && (
            <><div className="chip-sep" />
              {allTags.map(t => <button key={t} className={`chip ${tagFilter === t ? 'active' : ''}`} onClick={() => setTagFilter(tagFilter === t ? '' : t)}>{t}</button>)}
            </>
          )}
        </div>
      </div>

      {/* MAIN */}
      <main>
        <div className="main-wrap">
          <div className="toolbar">
            <div>
              <span className="result-count"><strong>{filtered.length}</strong> recipe{filtered.length !== 1 ? 's' : ''}{(search || catFilter || tagFilter || favOnly) && ' found'}</span>
              {(search || catFilter || tagFilter || favOnly) && (
                <button onClick={() => { setSearch(''); setCatFilter(''); setTagFilter(''); setFavOnly(false); }} style={{ marginLeft: 10, fontSize: 11, color: 'var(--ink3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Poppins', textDecoration: 'underline', fontWeight: 500 }}>Clear all</button>
              )}
            </div>
            <div className="toolbar-actions">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-select">
                <option value="newest">Newest first</option>
                <option value="quickest">Quickest first</option>
                <option value="rating">Top rated</option>
                <option value="name">A – Z</option>
              </select>
              {viewMode === 'grid' && !isSm && (
                <div className="toggle-group">
                  {[2, 3, 4].map(n => <button key={n} className={`toggle-btn ${cols === n ? 'on' : ''}`} style={{ width: 28, height: 28 }} onClick={() => setCols(n)}>{n}</button>)}
                </div>
              )}
              <div className="toggle-group">
                {['grid', 'list'].map(v => <button key={v} className={`toggle-btn ${viewMode === v ? 'on' : ''}`} style={{ width: 30, height: 28 }} onClick={() => setViewMode(v)}><I n={v} s={14} /></button>)}
              </div>
            </div>
          </div>

          {filtered.length === 0 && <EmptyState search={search} onAdd={openAdd} />}

          {filtered.length > 0 && viewMode === 'grid' && (
            <div className={`recipe-grid ${gridClass}`}>
              {filtered.map((r, i) => <RecipeCard key={r.id} recipe={r} delay={Math.min(i, 8) * 0.055} onView={setViewRecipe} onCook={setCookRecipe} onDelete={del} onFav={fav} />)}
            </div>
          )}

          {filtered.length > 0 && viewMode === 'list' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map((r, i) => <ListRow key={r.id} recipe={r} delay={Math.min(i, 8) * 0.04} onView={setViewRecipe} onCook={setCookRecipe} onDelete={del} onFav={fav} />)}
            </div>
          )}
        </div>
      </main>

      {/* Mobile FAB */}
      {isSm && <button className="fab" onClick={openAdd}><I n="plus" s={24} c="#fff" /></button>}

      {/* Modals */}
      <AddDrawer open={drawerOpen} initial={editRecipe} onClose={() => { setDrawerOpen(false); setEditRecipe(null); }} onSave={save} toast={push} />
      {viewRecipe && <DetailModal recipe={viewRecipe} onClose={() => setViewRecipe(null)} onEdit={() => openEdit(viewRecipe)} onFav={fav} push={push} onCook={() => { setCookRecipe(viewRecipe); setViewRecipe(null); }} onShareChange={(id, shared) => setRecipes(rs => rs.map(x => x.id === id ? { ...x, shared } : x))} />}

      {/* Toasts */}
      <div className="toast-host">
        {toasts.map(t => <div key={t.id} className="toast"><div className="toast-dot" />{t.msg}</div>)}
      </div>
    </div>
  );
                                     }
