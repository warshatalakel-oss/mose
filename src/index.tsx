import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

// Prevent iframe sandbox DOMException when window.alert/window.confirm are invoked
if (typeof window !== 'undefined') {
  const origAlert = window.alert;
  window.alert = (msg?: any) => {
    try {
      origAlert?.(msg);
    } catch {
      console.warn('[Notice]:', msg);
    }
  };
  const origConfirm = window.confirm;
  window.confirm = (msg?: any) => {
    try {
      return origConfirm ? origConfirm(msg) : true;
    } catch {
      console.warn('[Confirm Notice]:', msg);
      return true;
    }
  };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);