import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AccountGate } from './account.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AccountGate>{user => <App key={user.username} />}</AccountGate>
  </StrictMode>,
)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('RecipeBox PWA Registered!', reg))
      .catch(err => console.log('PWA Registration failed: ', err));
  });
}
