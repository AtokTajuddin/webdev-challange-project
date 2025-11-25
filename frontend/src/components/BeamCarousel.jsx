import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BeamCarousel = ({ works }) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const cardLineRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const scannerCanvasRef = useRef(null);
  
  const [position, setPosition] = useState(0);
  const animationRef = useRef(null);
  const stateRef = useRef({
    position: 0,
    velocity: 120, // auto scroll speed (px/s)
    direction: -1,
    lastTime: 0,
    // drag interaction
    isDragging: false,
    lastPointerX: 0,
    samples: [], // {x,t}
    manualVelocity: 0, // inertia px/s
  });

  const codeChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/\"'`~?";

  // Update card clipping function
  const updateCardClipping = () => {
    if (!cardLineRef.current) return;

    const scannerX = window.innerWidth / 2;
    const scannerWidth = 8;
    const scannerLeft = scannerX - scannerWidth / 2;
    const scannerRight = scannerX + scannerWidth / 2;

    const wrappers = cardLineRef.current.querySelectorAll('.beam-card-wrapper');
    wrappers.forEach((wrapper) => {
      const rect = wrapper.getBoundingClientRect();
      const cardLeft = rect.left;
      const cardRight = rect.right;
      const cardWidth = rect.width;

      const normalCard = wrapper.querySelector('.beam-card-normal');
      const asciiCard = wrapper.querySelector('.beam-card-ascii');

      if (!normalCard || !asciiCard) return;

      if (cardLeft < scannerRight && cardRight > scannerLeft) {
        const scannerIntersectLeft = Math.max(scannerLeft - cardLeft, 0);
        const scannerIntersectRight = Math.min(scannerRight - cardLeft, cardWidth);

        const normalClipRight = (scannerIntersectLeft / cardWidth) * 100;
        const asciiClipLeft = (scannerIntersectRight / cardWidth) * 100;

        normalCard.style.clipPath = `inset(0 0 0 ${normalClipRight}%)`;
        asciiCard.style.clipPath = `inset(0 calc(100% - ${asciiClipLeft}%) 0 0)`;
      } else {
        if (cardRight < scannerLeft) {
          normalCard.style.clipPath = 'inset(0 0 0 100%)';
          asciiCard.style.clipPath = 'inset(0 0 0 0)';
        } else {
          normalCard.style.clipPath = 'inset(0 0 0 0%)';
          asciiCard.style.clipPath = 'inset(0 100% 0 0)';
        }
      }
    });
  };

  // Generate ASCII code content
  const generateCode = (width, height) => {
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const pick = (arr) => arr[randInt(0, arr.length - 1)];

    const library = [
      "// compiled preview • scanner demo",
      "const SCAN_WIDTH = 8;",
      "const FADE_ZONE = 35;",
      "function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }",
      "function lerp(a, b, t) { return a + (b - a) * t; }",
      "const now = () => performance.now();",
      "class Particle { constructor(x, y, vx, vy, r, a) { this.x = x; this.y = y; } }",
      "const scanner = { x: window.innerWidth / 2, width: 8 };",
      "function tick(t) { const dt = 0.016; }",
    ];

    let flow = library.join(" ").replace(/\s+/g, " ");
    const totalChars = width * height;
    
    while (flow.length < totalChars + width) {
      flow += " " + pick(library).replace(/\s+/g, " ");
    }

    let out = "";
    let offset = 0;
    for (let row = 0; row < height; row++) {
      let line = flow.slice(offset, offset + width);
      if (line.length < width) line = line + " ".repeat(width - line.length);
      out += line + (row < height - 1 ? "\n" : "");
      offset += width;
    }
    return out;
  };

  // Initialize 2D Canvas particle system
  useEffect(() => {
    if (!particleCanvasRef.current) return;

    const canvas = particleCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const w = window.innerWidth;
    const h = 250;
    canvas.width = w;
    canvas.height = h;

    const particleCount = 300;
    const particles = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.random() * 60 + 30,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      
      particles.forEach((p) => {
        p.x += p.vx * 0.016;
        if (p.x > w + 100) {
          p.x = -100;
          p.y = Math.random() * h;
        }

        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      ctx.clearRect(0, 0, w, h);
    };
  }, []);

  // Initialize scanner canvas
  useEffect(() => {
    if (!scannerCanvasRef.current) return;

    const canvas = scannerCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const w = window.innerWidth;
    const h = 300;
    canvas.width = w;
    canvas.height = h;

    let scanningActive = false;
    let currentGlowIntensity = 1;

    const drawLightBar = () => {
      const lightBarX = w / 2;
      const lightBarWidth = 3;
      const fadeZone = 60;

      ctx.clearRect(0, 0, w, h);
      
      const targetGlow = scanningActive ? 3.5 : 1;
      currentGlowIntensity += (targetGlow - currentGlowIntensity) * 0.05;

      // Draw vertical gradient mask
      const vertGradient = ctx.createLinearGradient(0, 0, 0, h);
      vertGradient.addColorStop(0, 'rgba(255,255,255,0)');
      vertGradient.addColorStop(fadeZone / h, 'rgba(255,255,255,1)');
      vertGradient.addColorStop(1 - fadeZone / h, 'rgba(255,255,255,1)');
      vertGradient.addColorStop(1, 'rgba(255,255,255,0)');

      ctx.globalCompositeOperation = 'source-over';
      
      // Core light bar
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgba(255,255,255,${currentGlowIntensity * 0.8})`;
      ctx.fillRect(lightBarX - lightBarWidth / 2, 0, lightBarWidth, h);

      // Glow layers
      ctx.globalAlpha = 0.6;
      const glow = ctx.createLinearGradient(lightBarX - 20, 0, lightBarX + 20, 0);
      glow.addColorStop(0, 'rgba(139,92,246,0)');
      glow.addColorStop(0.5, `rgba(196,181,253,${currentGlowIntensity * 0.6})`);
      glow.addColorStop(1, 'rgba(139,92,246,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(lightBarX - 20, 0, 40, h);

      // Apply vertical gradient mask
      ctx.globalCompositeOperation = 'destination-in';
      ctx.globalAlpha = 1;
      ctx.fillStyle = vertGradient;
      ctx.fillRect(0, 0, w, h);
    };

    const animate = () => {
      drawLightBar();
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      ctx.clearRect(0, 0, w, h);
    };
  }, []);

  // Animation loop with auto scroll + drag + inertia
  useEffect(() => {
    if (!containerRef.current || !cardLineRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const cardWidth = 400;
    const cardGap = 60;
    const cardCount = works.length;
    const cardLineWidth = (cardWidth + cardGap) * cardCount;

    stateRef.current.lastTime = performance.now();

    const animate = () => {
      const currentTime = performance.now();
      const deltaTime = (currentTime - stateRef.current.lastTime) / 1000;
      stateRef.current.lastTime = currentTime;
      // Movement priority: drag > inertia > auto
      if (stateRef.current.isDragging) {
        // position already updated in pointer move handler
      } else if (Math.abs(stateRef.current.manualVelocity) > 1) {
        // inertia motion
        stateRef.current.position += stateRef.current.manualVelocity * deltaTime;
        const decel = 1800; // px/s^2
        if (stateRef.current.manualVelocity > 0) {
          stateRef.current.manualVelocity = Math.max(0, stateRef.current.manualVelocity - decel * deltaTime);
        } else {
          stateRef.current.manualVelocity = Math.min(0, stateRef.current.manualVelocity + decel * deltaTime);
        }
      } else {
        // auto scroll
        stateRef.current.position += stateRef.current.velocity * stateRef.current.direction * deltaTime;
      }

      // Loop seamlessly (wrap position)
      if (stateRef.current.position < -cardLineWidth) {
        stateRef.current.position = containerWidth;
      } else if (stateRef.current.position > containerWidth) {
        stateRef.current.position = -cardLineWidth;
      }

      setPosition(stateRef.current.position);
      updateCardClipping();

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []); // Empty dependency - runs once, never resets

  // Pointer event handlers for drag
  const beginDrag = (clientX, pointerId) => {
    stateRef.current.isDragging = true;
    stateRef.current.lastPointerX = clientX;
    stateRef.current.samples = [{ x: clientX, t: performance.now() }];
    stateRef.current.manualVelocity = 0; // cancel inertia
    if (containerRef.current && pointerId !== undefined) {
      try { containerRef.current.setPointerCapture(pointerId); } catch {}
    }
    if (containerRef.current) containerRef.current.classList.add('select-none');
  };

  const dragMove = (clientX) => {
    if (!stateRef.current.isDragging) return;
    const dx = clientX - stateRef.current.lastPointerX;
    stateRef.current.position += dx;
    stateRef.current.lastPointerX = clientX;
    const nowT = performance.now();
    stateRef.current.samples.push({ x: clientX, t: nowT });
    // keep only recent samples (<=120ms)
    stateRef.current.samples = stateRef.current.samples.filter(s => nowT - s.t <= 120);
  };

  const endDrag = (clientX, pointerId) => {
    if (!stateRef.current.isDragging) return;
    dragMove(clientX); // final update
    const samples = stateRef.current.samples;
    if (samples.length >= 2) {
      const first = samples[0];
      const last = samples[samples.length - 1];
      const dt = (last.t - first.t) / 1000;
      if (dt > 0) {
        const dist = last.x - first.x;
        // velocity scaled; clamp
        let v = dist / dt;
        const maxV = 2000; // clamp to avoid extremes
        if (v > maxV) v = maxV;
        if (v < -maxV) v = -maxV;
        stateRef.current.manualVelocity = v;
      }
    }
    stateRef.current.isDragging = false;
    stateRef.current.samples = [];
    if (containerRef.current && pointerId !== undefined) {
      try { containerRef.current.releasePointerCapture(pointerId); } catch {}
    }
    if (containerRef.current) containerRef.current.classList.remove('select-none');
  };

  const handlePointerDown = (e) => {
    beginDrag(e.clientX, e.pointerId);
  };
  const handlePointerMove = (e) => {
    dragMove(e.clientX);
  };
  const handlePointerUp = (e) => {
    endDrag(e.clientX, e.pointerId);
  };
  const handlePointerLeave = (e) => {
    endDrag(e.clientX, e.pointerId);
  };

  const handleCardClick = (workId) => {
    navigate(`/work/${workId}`);
  };

  return (
    <div className="relative w-full h-[300px] mb-12 overflow-hidden">
      {/* Background Particles */}
      <canvas
        ref={particleCanvasRef}
        className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[250px] pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Scanner Beam */}
      <canvas
        ref={scannerCanvasRef}
        className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[300px] pointer-events-none"
        style={{ zIndex: 15 }}
      />

      {/* Scrolling Card Display */}
      <div
        ref={containerRef}
        className="absolute w-full h-[180px] top-1/2 -translate-y-1/2 flex items-center overflow-visible cursor-grab"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'none', cursor: stateRef.current.isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          ref={cardLineRef}
          className="flex items-center gap-[60px] whitespace-nowrap"
          style={{
            transform: `translateX(${position}px)`,
            willChange: 'transform',
          }}
        >
          {works.map((work, index) => (
            <div
              key={work._id}
              className="beam-card-wrapper relative w-[400px] h-[250px] flex-shrink-0 cursor-pointer"
              onClick={() => handleCardClick(work._id)}
            >
              {/* Normal Card with Image */}
              <div className="beam-card-normal absolute top-0 left-0 w-[400px] h-[250px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 p-6 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono text-cyan-400 mb-2">
                      {work.fileHash?.substring(0, 16)}...
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{work.title}</h3>
                    <p className="text-sm text-slate-300 line-clamp-2">{work.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600"></div>
                      <span className="text-xs text-slate-300">{work.owner?.name || 'Anonymous'}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(work.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* ASCII Overlay Card */}
              <div className="beam-card-ascii absolute top-0 left-0 w-[400px] h-[250px] rounded-2xl overflow-hidden">
                <pre className="absolute top-0 left-0 w-full h-full text-[11px] leading-[13px] text-purple-300/60 font-mono m-0 p-0 whitespace-pre overflow-hidden">
                  {generateCode(67, 19)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Speed Indicator */}
      <div className="absolute top-4 right-4 text-white text-sm bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm z-20">
        Speed: {Math.round(stateRef.current.velocity)} px/s
      </div>
    </div>
  );
};

export default BeamCarousel;
