import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './pages/Gallery';
import Upload from './pages/Upload';
import Auth from './pages/Auth';
import WorkDetail from './pages/WorkDetail';

const App = ({ animeLoaded }) => {
  const navigate = useNavigate();
  
  console.log('App rendering, animeLoaded:', animeLoaded);

  const handleExplore = () => {
    navigate('/gallery');
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-slate-950 text-white">
                <Hero onExplore={handleExplore} />
                {/* ChainPub scrollable info section */}
                <section className="relative border-t border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/90">
                  <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 space-y-12">
                    <header className="text-center space-y-3">
                      <p className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/70 px-4 py-1 text-[11px] font-mono uppercase tracking-[0.3em] text-cyan-300/80">
                        <span className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                        ChainPub • Blockchain Publication Layer
                      </p>
                      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">What is ChainPub?</h2>
                      <p className="mx-auto max-w-2xl text-sm md:text-base text-slate-400">
                        ChainPub turns your drafts, designs, lyrics, and research into a verifiable stream of time-stamped publications on-chain—like a cryptographic journal for your creative life.
                      </p>
                    </header>

                    <div className="grid gap-8 md:grid-cols-3">
                      <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.85)]">
                        <h3 className="mb-2 text-sm font-semibold text-slate-50">
                          1. Capture &amp; Hash
                        </h3>
                        <p className="text-xs md:text-sm text-slate-400">
                          You upload a work to ChainPub. We compute a content hash—your work’s unique fingerprint—without needing to expose the raw file to the chain.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.85)]">
                        <h3 className="mb-2 text-sm font-semibold text-slate-50">
                          2. Anchor On-Chain
                        </h3>
                        <p className="text-xs md:text-sm text-slate-400">
                          The hash, timestamp, and your wallet identity are anchored to a smart contract, giving you a tamper‑resistant proof of existence and authorship.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.85)]">
                        <h3 className="mb-2 text-sm font-semibold text-slate-50">
                          3. Verify Anytime
                        </h3>
                        <p className="text-xs md:text-sm text-slate-400">
                          Anyone can later prove that a file matches an earlier ChainPub record, without seeing your private drafts—perfect for disputes, takedowns, or portfolio proof.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-50">Why does this matter?</h3>
                        <p className="text-xs md:text-sm text-slate-400">
                          Creators are pushed to publish quickly, but proof usually comes last. ChainPub flips that order: you can lock your authorship into an immutable log before the world ever sees your work.
                        </p>
                        <p className="text-xs md:text-sm text-slate-400">
                          For students, indie artists, researchers, and developers, ChainPub acts like a cryptographic notebook—protecting you from plagiarism claims and quiet idea theft.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-700/70 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.9)]">
                        <h3 className="mb-3 text-sm font-semibold text-slate-50">What you can do here</h3>
                        <ul className="space-y-2 text-xs md:text-sm text-slate-400 list-disc list-inside">
                          <li>Upload creative work and anchor its fingerprint on-chain.</li>
                          <li>Browse a public gallery of ChainPub‑registered pieces.</li>
                          <li>Prove a given file existed at a specific on-chain time.</li>
                          <li>Experiment locally without spending mainnet gas first.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            }
          />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/work/:id" element={<WorkDetail />} />
        </Routes>
        
        {/* Loading indicator for anime.js */}
        {!animeLoaded && (
          <div className="fixed bottom-4 right-4 text-xs text-slate-500 bg-red-500 p-2">
            Loading animations...
          </div>
        )}
      </div>
    </AuthProvider>
  );
};

export default App;
