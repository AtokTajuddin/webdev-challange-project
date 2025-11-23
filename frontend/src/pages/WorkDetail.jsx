import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Share2, GitFork, FileText, User, Calendar, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import api from '../services/api';

const WorkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkDetail();
  }, [id]);

  const fetchWorkDetail = async () => {
    try {
      const response = await api.get(`/works/${id}`);
      setWork(response.data);
    } catch (error) {
      console.error('Failed to fetch work detail:', error);
      alert('Work not found');
      navigate('/gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/work/${id}`;
    const shareText = `Check out "${work.title}" on ChainPub`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: work.title,
          text: work.description,
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

  const handleFork = () => {
    navigate(`/upload?fork=${work.fileHash}`);
  };

  if (loading) {
    return (
      <div className="pt-24 px-6 pb-20 container mx-auto min-h-screen flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="pt-24 px-6 pb-20 container mx-auto min-h-screen flex items-center justify-center">
        <div className="text-slate-400">Work not found</div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 pb-20 container mx-auto min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate('/gallery')}
        className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Gallery
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="flex items-start justify-between mb-4">
              <div className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-2 ${work.parentHash && work.parentHash !== '' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'}`}>
                {work.parentHash && work.parentHash !== '' ? (
                  <>
                    <GitFork size={14} />
                    Derivative Work
                  </>
                ) : (
                  <>
                    <ShieldCheck size={14} />
                    Original Root
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                  title="Share"
                >
                  <Share2 size={18} />
                </button>
                <button
                  onClick={handleFork}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg flex items-center gap-2 font-medium transition-all"
                >
                  <GitFork size={18} />
                  Fork This Work
                </button>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">{work.title}</h1>
            <p className="text-slate-300 text-lg leading-relaxed">{work.description}</p>

            {work.parentHash && work.parentHash !== '' && (
              <div className="mt-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <GitFork size={16} className="text-purple-400" />
                  <span className="text-xs font-bold text-purple-400 uppercase">Forked From</span>
                </div>
                <div className="font-mono text-sm text-purple-300 break-all">{work.parentHash}</div>
              </div>
            )}
          </div>

          {/* Document Preview */}
          {work.fileUrl && (
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText size={20} className="text-cyan-500" />
                Document Preview
              </h2>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <FileText size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {work.fileUrl.split('/').pop()}
                    </div>
                    <div className="text-xs text-slate-500">
                      Uploaded {new Date(work.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <a
                  href={`http://localhost:3000${work.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
                  title="Open file"
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Creator Info */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Creator</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600"></div>
              <div>
                <div className="text-white font-medium">
                  {work.owner?.name || 'Anonymous'}
                </div>
                <div className="text-xs text-slate-500">
                  {work.owner?.email || 'No email'}
                </div>
              </div>
            </div>
          </div>

          {/* Blockchain Info */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Blockchain Info</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">File Hash</div>
                <div className="font-mono text-xs text-slate-300 break-all bg-slate-950 p-2 rounded">
                  {work.fileHash || 'Not available'}
                </div>
              </div>

              {work.txHash && (
                <div>
                  <div className="text-xs text-slate-500 mb-1">Transaction Hash</div>
                  <div className="font-mono text-xs text-slate-300 break-all bg-slate-950 p-2 rounded">
                    {work.txHash}
                  </div>
                </div>
              )}

              {work.walletAddress && (
                <div>
                  <div className="text-xs text-slate-500 mb-1">Wallet Address</div>
                  <div className="font-mono text-xs text-slate-300 break-all bg-slate-950 p-2 rounded">
                    {work.walletAddress}
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs text-slate-500 mb-1">Registered</div>
                <div className="text-sm text-slate-300 flex items-center gap-2">
                  <Calendar size={14} className="text-cyan-500" />
                  {new Date(work.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkDetail;
