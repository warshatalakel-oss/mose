import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import './index.css';

// Register modern html2canvas-pro globally to support oklch colors from Tailwind v4
if (typeof window !== 'undefined') {
  (window as any).html2canvas = html2canvas;
  (window as any).html2canvasPro = html2canvas;
  if (!(window as any).jspdf) {
    (window as any).jspdf = { jsPDF };
  }
}

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