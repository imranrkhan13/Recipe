import { useState, useEffect } from 'react';
import { api } from './api.js';
import { InstallButton } from './install.jsx';
export function AccountGate({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    api('/me').then(data => { if (active) setUser(data.user); }).catch(() => {}).finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, []);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    const fields = new FormData(event.currentTarget);
    try { const data = await api(`/auth/${mode}`, { method: 'POST', body: { username: fields.get('username'), password: fields.get('password') } }); setUser(data.user); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  async function logout() {
    setBusy(true); setError('');
    try { await api('/auth/logout', { method: 'POST', body: {} }); setUser(null); }
    catch (e) { setError('Could not sign out. Reconnect and try again. ' + e.message); }
    finally { setBusy(false); }
  }
  return <>
    <style>{`
      *,*::before,*::after{box-sizing:border-box}body{margin:0}
      .account-screen{min-height:100dvh;background:#f2efe9;color:#1c1a16;display:grid;place-items:center;padding:24px;font-family:system-ui,sans-serif}
      .account-card{width:100%;max-width:420px;padding:32px;background:#faf8f4;border:1px solid #ddd8ce;border-radius:24px;box-shadow:0 16px 60px #40302012}
      .account-card h1{font-size:32px;line-height:1.15;margin:12px 0}.account-card p{line-height:1.6;margin:12px 0;color:#6b6456;font-size:14px}
      .account-card label{display:block;margin:20px 0 6px;font-size:14px;font-weight:600}.account-card input{width:100%;min-height:48px;padding:12px;border:1px solid #ccc6b8;border-radius:10px;background:white;font-size:16px}
      .account-card button,.account-bar button{min-height:44px;border:0;border-radius:10px;cursor:pointer;font:inherit;padding:10px 14px}.account-card button[type=submit]{background:#d4550c;color:#fff;width:100%;margin-top:24px;font-weight:600}.account-card .switch{background:transparent;color:#98400b;width:100%;margin-top:8px}
      .account-error{color:#a32323!important;overflow-wrap:anywhere}.account-bar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:space-between;padding:8px 20px;background:#faf8f4;color:#403729;border-bottom:1px solid #ddd8ce;font:13px system-ui}.account-bar span{overflow-wrap:anywhere}.account-bar button{background:#ede9e1}.install-app{display:inline-flex;flex-direction:column;gap:6px;max-width:100%}.install-app button{background:#d4550c;color:#fff}.install-help{font-size:13px;line-height:1.5;color:#6b6456;max-width:340px}.account-card .install-app{display:flex;margin-top:12px}.account-card .install-app button{width:100%;background:transparent;color:#98400b;border:1px solid #d4550c}.account-card .install-help{max-width:none}.account-bar .install-help{background:#fbf0eb;padding:8px;border-radius:8px}.storage-note{padding:12px 20px;background:#fbf0eb;font:13px/1.6 system-ui;color:#783908}.storage-note button{min-height:44px;padding:8px 12px;border:1px solid currentColor;border-radius:8px;background:transparent;color:inherit;margin-left:10px}
      @media(max-width:480px){.account-card{padding:24px}.account-bar{padding:8px 12px}.storage-note{padding:12px}.account-card h1{font-size:28px}}
    `}</style>
    {checking ? <main className="account-screen"><div className="account-card"><h1>Une recette</h1><p>Checking your account...</p></div></main>
      : user ? <><div className="account-bar"><span>Private collection · {user.username}</span><InstallButton /><button onClick={logout} disabled={busy}>Sign out</button>{error && <span role="alert" className="account-error">{error}</span>}</div>{children(user)}</>
        : <main className="account-screen"><section className="account-card"><small>MISE EN PLACE</small><h1>Your recipes.<br />Only yours.</h1><p>{mode === 'login' ? 'Sign in to open your private collection on any device.' : 'Create your private recipe collection.'}</p><form onSubmit={submit}>
          <label htmlFor="username">Username</label><input id="username" name="username" autoComplete="username" required minLength={3} maxLength={40} pattern="[a-zA-Z0-9_-]+" spellCheck="false" autoCapitalize="none" />
          <label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={12} maxLength={128} />
          <p>Use 12 or more characters. Keep your password safe: password recovery is not available yet.</p>{error && <p role="alert" className="account-error">{error}</p>}
          <button type="submit" disabled={busy}>{busy ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
        </form><button className="switch" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>{mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}</button><InstallButton /><p>Internet is needed for your private recipes. Old recipes on this browser are kept until you choose to import them after signing in.</p></section></main>}
  </>;
}
