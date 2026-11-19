import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/noto-sans-kr';
import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/900.css';
import './styles.css';
import App from './App.jsx';
createRoot(document.getElementById('root')).render(<App />);
