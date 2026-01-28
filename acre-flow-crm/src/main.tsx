import { createRoot } from 'react-dom/client'
import App from './layout/App.jsx'
import '@/styles/index.css'
import { registerSW } from 'virtual:pwa-register'

createRoot(document.getElementById("root")!).render(<App />); 

registerSW({
  immediate: true,
})