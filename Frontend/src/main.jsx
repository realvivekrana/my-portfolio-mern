import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { registerServiceWorker } from './utils/registerServiceWorker.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)

/*
|--------------------------------------------------------------------------
| PWA — SERVICE WORKER
|--------------------------------------------------------------------------
|
| Registers sw.js so the portfolio becomes installable and keeps
| working (with an offline fallback page) when the visitor loses
| their internet connection. No-op in dev/unsupported browsers.
|
|--------------------------------------------------------------------------
*/

registerServiceWorker()