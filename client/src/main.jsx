import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { ThemeProvider } from './context/ThemeContext'
import { SettingsProvider } from './context/SettingsContext'
import { SpeedInsights } from "@vercel/speed-insights/react"

console.log('MAIN.JSX LOADING APP WITH CSS');
const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ThemeProvider>
        <SettingsProvider>
          <App />
          <SpeedInsights />
        </SettingsProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}
