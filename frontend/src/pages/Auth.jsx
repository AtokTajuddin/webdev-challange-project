import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cardRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const anime = window.anime;
    if (!anime || !cardRef.current || !glowRef.current) return;

    anime({
      targets: cardRef.current,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      easing: 'easeOutExpo',
    });

    anime({
      targets: glowRef.current,
      opacity: [0, 0.8],
      scale: [0.9, 1.05],
      duration: 2000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
    });
  }, [isLogin]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          navigate('/gallery');
        } else {
          setError(result.message);
        }
      } else {
        const result = await register(formData.username, formData.email, formData.password);
        if (result.success) {
          setError('');
          setIsLogin(true); // Switch to login after successful registration
          alert('Registration successful! Please login.');
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative pt-24 px-6 pb-20 min-h-screen flex items-center justify-center overflow-hidden">
      {/* backdrop grid + glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.12),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:80px_80px] opacity-40" />

      <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-10 items-center">
        {/* Left side intro */}
        <div className="hidden lg:block">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-[11px] font-semibold uppercase tracking-[0.2em] mb-6">
            <ShieldCheck size={14} />
            Identity Layer
          </div>
          <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tight mb-4">
            {isLogin ? 'Welcome back to your ledger' : 'Create your cryptographic identity'}
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-6">
            Use zero-knowledge backed credentials to sign uploads, trace forks, and prove authorship without revealing more than you want.
          </p>
          <div className="flex flex-wrap gap-3 text-[11px] text-slate-300">
            <span className="px-3 py-1 rounded-full bg-slate-900/60 border border-slate-700/80">JWT-secured session</span>
            <span className="px-3 py-1 rounded-full bg-slate-900/60 border border-slate-700/80">Rate-limited API</span>
            <span className="px-3 py-1 rounded-full bg-slate-900/60 border border-slate-700/80">Cryptographic hashes</span>
          </div>
        </div>

        {/* Right side auth card */}
        <div className="relative max-w-md w-full mx-auto">
          <div
            ref={glowRef}
            className="absolute -inset-0.5 bg-gradient-to-tr from-cyan-500 via-sky-500 to-purple-500 opacity-0 blur-2xl"
          />

          <div
            ref={cardRef}
            className="relative bg-slate-950/80 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.9)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-25 pointer-events-none" />

            <div className="relative mb-6 text-center">
              <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-cyan-300/80 mb-2">
                {isLogin ? 'Sign in to continue' : 'Join the registry'}
              </p>
              <h2 className="text-2xl font-bold text-white mb-1">
                {isLogin ? 'Access your provenance vault' : 'Protect your IP in seconds'}
              </h2>
              <p className="text-slate-400 text-xs">
                {isLogin ? 'Use your credentials to view and manage registered works.' : 'Create an account to start notarizing your creations.'}
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/40 rounded-lg flex items-center gap-3 text-red-200 text-xs">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="relative">
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition"
                placeholder="Enter email"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:via-sky-400 hover:to-blue-500 text-white font-semibold rounded-xl transition disabled:opacity-50 mb-3 text-sm tracking-wide flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-3 h-3 rounded-full border-2 border-white/40 border-t-transparent animate-spin" />
                  Processing...
                </>
              ) : (
                isLogin ? 'Sign in securely' : 'Create protected account'
              )}
            </button>

            <p className="text-center text-slate-400 text-[11px]">
              {isLogin ? "Don’t have an account? " : "Already registered? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-cyan-300 hover:text-cyan-200 font-medium ml-1"
              >
                {isLogin ? 'Create one' : 'Sign in'}
              </button>
            </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
