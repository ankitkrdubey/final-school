// Safe localStorage/sessionStorage wrapper to prevent QuotaExceededError crashes
const originalSetItem = Storage.prototype.setItem;
Storage.prototype.setItem = function (key, value) {
  try {
    originalSetItem.apply(this, arguments);
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22 || e.number === 0x8007000E) {
      console.warn(`[Storage Quota Exceeded] Could not write key "${key}" to local/session storage.`, e);
    } else {
      throw e;
    }
  }
};

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
