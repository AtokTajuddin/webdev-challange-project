import React from 'react';
import { ShieldCheck, LogOut, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user) {
      logout();
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-white font-semibold text-lg tracking-tight hover:opacity-90 transition"
        >
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 via-sky-500 to-purple-500" />
            <div className="absolute inset-[2px] rounded-xl bg-slate-950 flex items-center justify-center">
              <ShieldCheck size={16} className="text-cyan-300" />
            </div>
          </div>
          <span className="flex items-baseline gap-1">
            <span>ChainPub</span>
            <span className="text-cyan-400 text-xs">.chain</span>
          </span>
        </Link>

        {/* nav links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/gallery" className="hover:text-white transition-colors">Public Gallery</Link>
          <Link to="/upload" className="hover:text-white transition-colors">Upload</Link>
        </div>

        {/* auth pill */}
        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden sm:inline text-[11px] text-slate-300">
              Signed in as <span className="text-cyan-300 font-medium">{user.email}</span>
            </span>
          )}
          <button
            onClick={handleAuthAction}
            className="relative px-3.5 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border border-white/10 bg-slate-900/80 hover:border-cyan-400/60 hover:bg-slate-900/90 text-slate-100 transition"
          >
            {user ? (
              <>
                <LogOut size={13} /> Logout
              </>
            ) : (
              <>
                <LogIn size={13} /> Login
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;