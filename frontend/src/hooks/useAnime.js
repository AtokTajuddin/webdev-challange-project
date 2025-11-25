import { useState, useEffect } from 'react';

// Hook ini bertugas meload library Anime.js dari CDN
// agar animasi berjalan tanpa error build
const useAnime = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Cek kalau sudah ada di window
    if (window.anime) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup jika perlu
    };
  }, []);

  return loaded;
};

export default useAnime;