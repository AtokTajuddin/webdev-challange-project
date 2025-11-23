import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { UploadCloud, FileText, Loader2, GitFork } from 'lucide-react';
import api from '../services/api';

// --- CONFIG ---
// When true, skip real blockchain tx and simulate on-chain
// registration so the app works without MetaMask/Anvil.
const DEMO_MODE = true; // Keep demo mode ON for now - backend needs fixes first
// Default address is a placeholder; replace with the address
// you get after deploying IPRegistry.sol to Anvil/testnet.
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update this after forge script runs
// ABI aligned with contracts/IPRegistry.sol
const CONTRACT_ABI = [
  "function registerPublication(bytes32 fileHash, string title, string parentHash) external"
];

const Upload = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [parentHash, setParentHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // Untuk menampilkan progres

  useEffect(() => {
    // Cek apakah ini forking?
    const forkSource = searchParams.get("fork");
    if (forkSource) setParentHash(forkSource);
  }, [searchParams]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      let walletAddress = "demo-wallet";

      // 1. Connect Web3 (only when not in demo mode)
      if (!DEMO_MODE) {
        if (!window.ethereum) {
          alert("Please install Metamask or switch DEMO_MODE on.");
          setLoading(false);
          return;
        }
        setStatus("Connecting to Wallet...");
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        walletAddress = await signer.getAddress();
      }

      // 2. Upload to Backend (always)
      setStatus("Uploading & Hashing File...");
      const formData = new FormData();
      formData.append("file", file); // backend expects 'file' not 'document'
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("walletAddress", walletAddress);
      formData.append("parentHash", parentHash || "");

      // Use existing API instance (baseURL already includes /api)
      const res = await api.post('/works', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Backend response:', res.data);
      const { fileHash, dbId, parentHash: validParent } = res.data;

      // fileHash is expected to be a 0x-prefixed 32-byte hex string
      // compatible with bytes32 in the IPRegistry contract.
      let simulatedTxHash = `0x${fileHash.replace(/^0x/, '').slice(0, 64)}`;

      if (!DEMO_MODE) {
        // 3. Real Blockchain Transaction
        setStatus("Minting to Blockchain (Check Metamask)...");
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        const tx = await contract.registerPublication(fileHash, form.title, validParent);
        setStatus("Waiting for Block Confirmation...");
        await tx.wait();
        simulatedTxHash = tx.hash;
      } else {
        // Demo: pretend we mined a tx without touching a real chain
        setStatus("Simulating on-chain registration (DEMO MODE)...");
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }

      // 4. Confirm to Backend (demo or real)
      setStatus("Finalizing Registration...");
      await api.post('/works/confirm', { dbId, txHash: simulatedTxHash });

      alert(DEMO_MODE 
        ? "Success! (Demo) Work registered with simulated on-chain proof."
        : "Success! Work registered on chain.");
      navigate("/gallery");

    } catch (err) {
      console.error('Upload error:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      
      let errorMsg = 'Unknown error';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.error) {
          errorMsg = Array.isArray(err.response.data.error) 
            ? JSON.stringify(err.response.data.error) 
            : err.response.data.error;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        } else {
          errorMsg = JSON.stringify(err.response.data);
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      alert("Error: " + errorMsg);
    }
    setLoading(false);
    setStatus("");
  };

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen container mx-auto flex justify-center">
      <div className="w-full max-w-2xl">
        
        {/* Header */}
        <div className="mb-8">
           <h2 className="text-3xl font-bold text-white mb-2">
             {parentHash ? "Fork Existing Project" : "Register New Work"}
           </h2>
           <p className="text-slate-400">Upload your work to generate a permanent proof of ownership.</p>
        </div>

        {/* Forking Banner */}
        {parentHash && (
          <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-xl mb-6 flex items-center gap-3 text-purple-300">
             <GitFork size={20} />
             <div className="text-sm">
                <strong>You are creating a derivative work.</strong>
                <br/>
                Parent Hash: <span className="font-mono opacity-80">{parentHash}</span>
             </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
          <form onSubmit={handleUpload} className="space-y-6">
            
            {/* Title Input */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Title</label>
              <input 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="e.g. Quantum Research V1"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                required 
              />
            </div>

            {/* Desc Input */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Description</label>
              <textarea 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors h-32"
                placeholder="Briefly describe your work (min 3 characters)..."
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                required
              />
            </div>

            {/* File Dropzone Style */}
            <div>
               <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Document / Image</label>
               <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:bg-slate-800/50 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    required
                  />
                  <div className="flex flex-col items-center gap-2 pointer-events-none">
                     {file ? (
                        <FileText className="text-cyan-500" size={32} />
                     ) : (
                        <UploadCloud className="text-slate-500" size={32} />
                     )}
                     <span className="text-sm font-medium text-slate-300">
                        {file ? file.name : "Click or Drag file here"}
                     </span>
                     <span className="text-xs text-slate-500">PDF, JPG, PNG (Max 10MB)</span>
                  </div>
               </div>
            </div>

            {/* Submit Button */}
            <button 
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  {status}
                </>
              ) : (
                "Register to Blockchain"
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Upload;