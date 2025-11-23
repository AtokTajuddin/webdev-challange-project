import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

console.log('main.jsx loading...');

const Root = () => {
  const [animeLoaded, setAnimeLoaded] = useState(false);

  useEffect(() => {
    console.log('Root mounted');
    // Check if anime.js already loaded
    if (window.anime) {
      setAnimeLoaded(true);
      console.log('Anime.js already loaded');
      return;
    }

    // Load anime.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
    script.async = true;
    script.onload = () => {
      console.log('Anime.js loaded successfully');
      setAnimeLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load anime.js');
    };
    document.body.appendChild(script);
  }, []);
  
  console.log('Root rendering, animeLoaded:', animeLoaded);
  
  return (
    <React.StrictMode>
      <BrowserRouter>
        <App animeLoaded={animeLoaded} />
      </BrowserRouter>
    </React.StrictMode>
  );
};

const root = document.getElementById('root');
console.log('Root element:', root);

if (root) {
  ReactDOM.createRoot(root).render(<Root />);
} else {
  console.error('Root element not found!');
}
