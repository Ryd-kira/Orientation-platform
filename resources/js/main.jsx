import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import OrientationApp from './OrientationApp.jsx';

const root = document.getElementById('app');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <OrientationApp />
    </React.StrictMode>
  );
}
