import React, { useEffect, useRef, useState } from 'react';
import { Play, ShieldCheck } from 'lucide-react';

const Hero = ({ onExplore }) => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const btnRef = useRef(null);
  const pathRef = useRef(null);
  const canvasRef = useRef(null);
  const anime = window.anime;
  const [activeTagline, setActiveTagline] = useState(0);

  useEffect(() => {
    // existing text/path animation
    if (!anime) return;

    const timeline = anime.timeline({
      easing: 'easeOutExpo',
      duration: 1000
    });

    timeline.add({
      targets: pathRef.current,
      strokeDashoffset: [anime.setDashoffset, 0],
      opacity: [0, 1],
      duration: 2000,
      easing: 'easeInOutSine'
    })
    .add({
      targets: titleRef.current.children,
      translateY: [100, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      offset: '-=1500'
    })
    .add({
      targets: subtitleRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      offset: '-=800'
    })
    .add({
      targets: btnRef.current,
      scale: [0.8, 1],
      opacity: [0, 1],
      offset: '-=600'
    });

  }, [anime]);

  // simple canvas light-field effect inspired by reference snippet
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
    };
    resize();

    const dots = Array.from({ length: 90 }).map((_, i) => ({
      baseRadius: 40 + i * 4,
      angle: Math.random() * Math.PI * 2,
      speed: 0.002 + Math.random() * 0.003,
    }));

    const mouse = { x: 0.5, y: 0.4 };
    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener('pointermove', handleMove);

    const render = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      const cx = width * mouse.x;
      const cy = height * mouse.y;

      dots.forEach((d, idx) => {
        d.angle += d.speed;
        const r = d.baseRadius * (1.2 + 0.4 * Math.sin(d.angle * 0.7));
        const x = cx + Math.cos(d.angle) * r;
        const y = cy + Math.sin(d.angle) * r * 0.4;
        const alpha = 0.08 + (idx / dots.length) * 0.25;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, 40);
        grad.addColorStop(0, `rgba(56,189,248,${alpha})`);
        grad.addColorStop(1, 'rgba(15,23,42,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, Math.PI * 2);
        ctx.fill();
      });

      frameId = requestAnimationFrame(render);
    };

    render();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  const titleText = "Leasing Creativity With Blockchain".split(" ");
  const taglines = [
    "Timestamp every idea the second it is born.",
    "Generate a cryptographic fingerprint no one can fake.",
    "Prove authorship without exposing your raw files.",
    "Turn messy drafts into verifiable, on-chain provenance.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTagline((prev) => (prev + 1) % taglines.length);
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden px-4 pt-16">
      {/* layered glow background + canvas light field */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-cyan-500/25 blur-[120px]" />
        <div className="absolute bottom-[-180px] right-[-120px] w-[420px] h-[420px] bg-purple-600/30 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.2),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* SVG Path Decoration */}
      <svg className="absolute w-full h-full pointer-events-none top-0 left-0 opacity-40" viewBox="0 0 1440 800">
        <path 
          ref={pathRef}
          d="M-100,400 C300,400 300,200 600,200 C900,200 900,600 1300,600 L1600,600" 
          fill="none" 
          stroke="url(#gradient)" 
          strokeWidth="2"
          className="opacity-0"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      <div className="z-10 max-w-4xl">
        {/* top chip */}
        <div className="mb-4 flex justify-center items-center gap-2 text-cyan-300/90 font-mono text-[11px] md:text-xs tracking-[0.25em] uppercase opacity-90">
           <ShieldCheck size={16} className="drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
           <span className="px-3 py-1 rounded-full bg-slate-900/60 border border-cyan-500/40 shadow-[0_0_24px_rgba(34,211,238,0.55)] backdrop-blur-md">
             On-Chain Provenance Registry
           </span>
        </div>
        
        <h1 ref={titleRef} className="text-6xl md:text-8xl font-black text-white leading-tight tracking-tighter mb-6 overflow-hidden">
          {titleText.map((word, i) => (
            <span key={i} className="inline-block mr-4 origin-bottom transform">
              {word}
            </span>
          ))}
        </h1>

        <p ref={subtitleRef} className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed opacity-0">
          Capture, sign, and anchor each creative work into an auditable ledger so you can prove it was yours—first, and forever.
        </p>

        {/* animated glass tagline strip */}
        <div className="relative mx-auto mb-10 max-w-3xl">
          <div className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500/60 via-sky-400/40 to-purple-500/60 opacity-70 blur-sm" />
          <div className="relative overflow-hidden rounded-2xl border border-slate-600/60 bg-slate-950/60 backdrop-blur-xl shadow-[0_0_50px_rgba(15,23,42,0.9)]">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700/60 bg-slate-900/70">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                LIVE
              </span>
              <span className="text-[11px] md:text-xs tracking-[0.25em] uppercase text-slate-400 font-mono">
                Realtime Proof-of-Creation Feed
              </span>
            </div>
            <div className="relative h-16 md:h-[4.25rem]">
              {taglines.map((line, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex items-center justify-center px-6 text-sm md:text-base text-slate-50 transition-all duration-700 ease-out
                    ${index === activeTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  `}
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1 w-8 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 shadow-[0_0_16px_rgba(56,189,248,0.7)]" />
                    <span>{line}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div ref={btnRef} className="opacity-0">
          <button 
            onClick={onExplore}
            className="group relative px-8 py-4 bg-white text-slate-950 font-bold rounded-full text-lg hover:bg-cyan-50 transition-colors flex items-center gap-3 mx-auto shadow-[0_18px_60px_rgba(15,23,42,0.9)]"
          >
            Start Exploring Registry
            <div className="bg-slate-950 text-white rounded-full p-1 group-hover:rotate-90 transition-transform duration-500">
               <Play size={16} fill="white" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;