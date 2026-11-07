import { useEffect, useState } from 'react';
import { api } from './api.js';
import { RImg, LevelBadge } from './App.jsx';

/* Public share flow. /r/<token> renders these instead of the private app.
   Server only sends the cover (title + image) to signed-out visitors;
   the full recipe is returned only when a valid session cookie is present. */

const pageStyle = { minHeight: '100dvh', background: 'var(--bg)', color: 'var(--ink)', fontFamily: "'Poppins', sans-serif" };

export function ShareTeaser({ token }) {
  const [state, setState] = useState({ status: 'loading' });
  useEffect(() => {
    let active = true;
    api(`/shared/${token}`)
      .then(d => { if (active) setState({ status: 'ok', title: d.title, image: d.image }); })
      .catch(e => { if (active) setState({ status: 'error', error: e.message }); });
    return () => { active = false; };
  }, [token]);
  if (state.status === 'loading') return null;
  if (state.status === 'error') return (
    <section className="share-card">
      <p className="share-kicker">Une recette</p>
      <h2 className="share-title">Link unavailable</h2>
      <p className="share-note">{state.error}</p>
    </section>
  );
  return (
    <section className="share-card">
      <p className="share-kicker">Shared recipe</p>
      <div className="share-cover">
        <RImg title={state.title} custom={state.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div className="share-cover-grad" />
        <h2 className="share-cover-title">{state.title}</h2>
      </div>
      <p className="share-note">Only this cover is public. Sign in below to view the full recipe.</p>
    </section>
  );
}

export function SharedRecipe({ token }) {
  const [state, setState] = useState({ status: 'loading' });
  useEffect(() => {
    let active = true;
    api(`/shared/${token}`)
      .then(d => { if (active) setState(d.recipe ? { status: 'ok', recipe: d.recipe } : { status: 'locked' }); })
      .catch(e => { if (active) setState({ status: 'error', error: e.message }); });
    return () => { active = false; };
  }, [token]);
  if (state.status === 'loading') return <main style={pageStyle}><p className="share-note" style={{ padding: 40 }}>Loading recipe...</p></main>;
  if (state.status === 'locked') return <main style={pageStyle}><p className="share-note" style={{ padding: 40 }}>Sign in to view this recipe.</p></main>;
  if (state.status === 'error') return <main style={pageStyle}><p className="share-note" style={{ padding: 40 }}>{state.error}</p></main>;
  const r = state.recipe;
  const steps = (r.instructions || '').split('.').map(x => x.trim()).filter(Boolean);
  return (
    <main style={pageStyle}>
      <div className="share-page">
        <div className="share-cover share-cover-lg">
          <RImg title={r.title} custom={r.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div className="share-cover-grad" />
          <div className="share-cover-bottom">
            {r.category && <p className="share-cover-cat">{r.category}</p>}
            <h1 className="share-cover-title">{r.title}</h1>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
              <LevelBadge level={r.level} />
              {r.cuisine && <span style={{ fontSize: 11, color: 'rgba(255,255,255,.65)' }}>{r.cuisine}</span>}
            </div>
          </div>
        </div>
        <div className="stats-row" style={{ marginTop: 20 }}>
          {[{ l: 'Time', v: `${r.time}m` }, { l: 'Serves', v: r.servings }, { l: 'Rating', v: r.rating > 0 ? `${r.rating}/5` : '—' }, { l: 'Kcal', v: r.calories || '—' }].map(m => (
            <div key={m.l} className="stat-card">
              <div className="stat-card-val">{m.v}</div>
              <div className="stat-card-lbl">{m.l}</div>
            </div>
          ))}
        </div>
        {r.tags?.length > 0 && <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '18px 0' }}>{r.tags.map(t => <span key={t} className="tag-pill">{t}</span>)}</div>}
        <h3 className="share-h">Ingredients</h3>
        {(r.ingredients || []).map((ing, i) => (
          <div key={i} className="ing-row">
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{ing.name}</span>
            <span className="ing-qty">{ing.qty} {ing.unit}</span>
          </div>
        ))}
        {steps.length > 0 && <>
          <h3 className="share-h">Method</h3>
          {steps.map((st, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 700, color: '#fff' }}>{i + 1}</div>
              <p style={{ fontSize: 13, lineHeight: 1.85, color: 'var(--ink2)', paddingTop: 4 }}>{st}.</p>
            </div>
          ))}
        </>}
        {r.notes && <div className="notes-box" style={{ marginTop: 8 }}><div className="notes-label">Chef's Notes</div><p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--ink2)' }}>{r.notes}</p></div>}
        <p className="share-note" style={{ marginTop: 28, textAlign: 'center' }}>Shared with you on Une recette. Only this recipe is visible to you.</p>
      </div>
    </main>
  );
}
