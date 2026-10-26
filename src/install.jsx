import { useEffect, useState } from 'react';

function isStandalone() {
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
}
function isIos() {
  const ua = window.navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) || (ua.includes('Macintosh') && window.navigator.maxTouchPoints > 1);
}

function steps() {
  const ua = window.navigator.userAgent;
  if (isIos()) return 'In Safari, tap the Share button, then "Add to Home Screen".';
  if (/Android/.test(ua)) return 'In Chrome, open the menu (three dots), then tap "Install app" or "Add to Home screen".';
  if (/Edg\//.test(ua)) return 'In Edge, open the menu (three dots), then Apps, then "Install this site as an app".';
  if (/Firefox/.test(ua)) return 'Firefox on desktop cannot install web apps. Open this site in Chrome or Edge to install it.';
  if (/Chrome/.test(ua)) return 'In Chrome, click the install icon at the right of the address bar, or open the menu and choose "Install Une recette".';
  if (/Safari/.test(ua)) return 'In Safari on Mac, choose File, then "Add to Dock".';
  return 'Open your browser menu and look for "Install" or "Add to Home Screen".';
}

// Install app button. Uses the browser's native prompt when it offers one
// (beforeinstallprompt: Chrome, Edge, Android). Otherwise it shows install steps
// for the current browser. Hidden once the app runs installed (standalone).
export function InstallButton() {
  const [prompt, setPrompt] = useState(null);
  const [installed, setInstalled] = useState(() => typeof window !== 'undefined' && isStandalone());
  const [help, setHelp] = useState(false);
  useEffect(() => {
    const onPrompt = event => { event.preventDefault(); setPrompt(event); };
    const onInstalled = () => { setInstalled(true); setPrompt(null); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => { window.removeEventListener('beforeinstallprompt', onPrompt); window.removeEventListener('appinstalled', onInstalled); };
  }, []);
  if (installed) return null;
  async function install() {
    if (!prompt) { setHelp(value => !value); return; }
    const event = prompt;
    setPrompt(null);
    await event.prompt();
    await event.userChoice.catch(() => {});
  }
  return <span className="install-app">
    <button type="button" onClick={install} aria-expanded={prompt ? undefined : help}>Install app</button>
    {help && !prompt && <span role="note" className="install-help">{steps()} It still needs internet for your private recipes.</span>}
  </span>;
}
