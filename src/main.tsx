import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.clear()
console.log(
  '%c✨ Made with ❤️ by nhtoby.com ✨',
  'font-size:16px;font-weight:bold;color:#b9beff;background:#1a1a2e;padding:8px 16px;border-radius:8px;',
  '\nhttps://nhtoby.com',
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
