import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import BeamCard from '../components/BeamCard';
import BeamCarousel from '../components/BeamCarousel';
import api from '../services/api';

const Gallery = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const response = await api.get('/works');
      setWorks(response.data);
    } catch (error) {
      console.error('Failed to fetch works:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorks = works.filter(work => 
    work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    work.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (work.owner?.name && work.owner.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (work.owner?.email && work.owner.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (work.fileHash && work.fileHash.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="pt-24 px-6 pb-20 container mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 border-b border-white/10 pb-6">
         <div>
            <h2 className="text-4xl font-bold text-white mb-2">Public Registry</h2>
            <p className="text-slate-400">Immutable proof of ownership on the blockchain.</p>
         </div>
         <div className="mt-4 md:mt-0 relative w-full md:w-96 z-20">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Title, Creator, or Hash..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all relative z-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                title="Clear search"
              >
                ✕
              </button>
            )}
         </div>
      </div>

      {/* Beam Carousel */}
      {!loading && works.length > 0 && (
        <div className="mb-12 relative z-0">
          <BeamCarousel works={works} />
        </div>
      )}

      <div className="border-t border-white/10 pt-8 relative z-10"></div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-cyan-500" size={48} />
        </div>
      ) : filteredWorks.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg">
            {searchTerm ? 'No works found matching your search' : 'No works uploaded yet. Be the first!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorks.map((work, index) => (
            <BeamCard 
              key={work._id}
              workId={work._id}
              title={work.title}
              description={work.description}
              hash={work.fileHash || work._id.substring(0, 10) + '...' + work._id.slice(-4)}
              author={work.owner?.name || work.owner?.email || 'Anonymous'}
              isFork={!!work.parentHash && work.parentHash !== ''}
              parentHash={work.parentHash || ''}
              delay={index * 100}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;