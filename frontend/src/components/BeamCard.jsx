import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, ShieldCheck, GitFork, FileText } from 'lucide-react';

const BeamCard = ({ title, description, hash, author, isFork, parentHash, delay, workId }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const beamRef = useRef(null);
  const anime = window.anime; // Ambil dari window setelah diload hook

  useEffect(() => {
    if (!anime || !cardRef.current || !beamRef.current) return;

    // Animasi putaran cahaya (Beam)
    anime({
      targets: beamRef.current,
      rotate: '1turn',
      duration: 5000,
      loop: true,
      easing: 'linear'
    });

    // Animasi muncul (Fade In)
    anime({
      targets: cardRef.current,
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 800,
      delay: delay, 
      easing: 'easeOutExpo'
    });
  }, [anime, delay]);

  const handleShare = async (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/work/${workId}`;
    const shareText = `Check out "${title}" on ChainPub - ${shareUrl}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy link');
    });
  };

  const handleViewFork = () => {
    // Navigate to detail page with fork option
    navigate(`/work/${workId}`);
  };

  const handleFork = () => {
    // Navigate to upload page with parent hash
    navigate(`/upload?fork=${hash}`);
  };

  return (
    <div ref={cardRef} className="relative group opacity-0 w-full max-w-sm mx-auto">
      {/* GLOWING BACKGROUND LAYER */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 rounded-2xl opacity-75 blur-sm group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      
      {/* ROTATING BEAM LAYER */}
      <div className="absolute -inset-1 rounded-2xl overflow-hidden">
         <div ref={beamRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[50%] bg-gradient-to-r from-transparent via-white/50 to-transparent rotate-45 pointer-events-none mix-blend-overlay"></div>
      </div>

      {/* CONTENT LAYER (GLASSMORPHISM) */}
      <div className="relative h-full bg-slate-950/90 backdrop-blur-xl rounded-xl p-6 ring-1 ring-white/10 leading-none flex flex-col justify-between overflow-hidden">
        
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

        <div>
          <div className="flex justify-between items-start mb-4 z-10 relative">
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 ${isFork ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'}`}>
              {isFork ? <GitFork size={12} /> : <ShieldCheck size={12} />}
              {isFork ? "Derivative" : "Original Root"}
            </div>
            <div className="text-slate-500 text-xs font-mono">{new Date().toLocaleDateString()}</div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 z-10 relative group-hover:text-cyan-400 transition-colors">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4 z-10 relative">{description}</p>
          
          {isFork && (
             <div className="mb-4 text-xs p-2 rounded bg-purple-900/20 border border-purple-500/20 text-purple-300/80 font-mono truncate">
               ↳ Forked from: {parentHash.substring(0, 10)}...
             </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 z-10 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600"></div>
              <span className="text-xs text-slate-300 font-medium">{author}</span>
            </div>
            <button 
              onClick={handleShare}
              className="text-slate-400 hover:text-white transition-colors"
              title="Share this work"
            >
              <Share2 size={16} />
            </button>
          </div>
          
          <div 
            onClick={handleViewFork}
            className="bg-slate-900/80 rounded p-2 mb-3 flex items-center justify-between group-hover:bg-slate-800 transition-colors cursor-pointer"
            title="Click to view details"
          >
             <div className="flex items-center gap-2 overflow-hidden">
                <FileText size={14} className="text-cyan-500 flex-shrink-0" />
                <span className="font-mono text-[10px] text-slate-500 truncate">HASH: {hash}</span>
             </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleViewFork}
              className="flex-1 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-900/20"
            >
              View Details
            </button>
            <button 
              onClick={handleFork}
              className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-1"
            >
              <GitFork size={12} />
              Fork
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeamCard;