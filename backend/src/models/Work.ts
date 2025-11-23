import mongoose, { Schema, Document } from 'mongoose';

export interface IWork extends Document {
  title: string;
  description: string;
  fileUrl: string;
  fileHash: string; // keccak256 hash for blockchain registration
  txHash?: string; // transaction hash after on-chain confirmation
  walletAddress?: string; // user's wallet address
  parentHash?: string; // parent work hash for derivatives
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
}

const WorkSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileHash: { type: String, required: true, unique: true }, // unique content hash
  txHash: { type: String }, // blockchain transaction hash
  walletAddress: { type: String },
  parentHash: { type: String }, // for derivative works
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IWork>('Work', WorkSchema);