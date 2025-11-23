import type { Response } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import Work from '../models/Work.js';
import { workSchema } from '../utils/validators.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';

export const createWork = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'File is required' });
    return;
  }

  const validation = workSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ error: validation.error.issues });
    return;
  }

  try {
    const { title, description } = validation.data;
    const walletAddress = req.body.walletAddress || 'demo-wallet';
    const parentHash = req.body.parentHash || '';
    
    // Construct URL (assuming you serve uploads statically)
    const fileUrl = `/uploads/${req.file.filename}`;
    
    // Compute file hash (keccak256-compatible via sha3-256)
    const filePath = path.join(process.cwd(), 'uploads', req.file.filename);
    const fileBuffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    const fileHash = `0x${hash}`; // format as 0x-prefixed hex for bytes32 compatibility

    const newWork = new Work({
      title,
      description,
      fileUrl,
      fileHash,
      walletAddress,
      parentHash,
      owner: req.user?.userId
    });

    await newWork.save();
    
    // Return hash + dbId for frontend to call smart contract
    res.status(201).json({
      fileHash: newWork.fileHash,
      dbId: newWork._id.toString(),
      parentHash: newWork.parentHash || '',
      title: newWork.title,
      success: true
    });
  } catch (error: any) {
    console.error('Create work error:', error);
    res.status(500).json({ error: error.message || 'Failed to create work' });
  }
};

export const getWorks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Populate owner name, exclude password
    const works = await Work.find().populate('owner', 'name email').sort({ createdAt: -1 });
    res.json(works);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch works' });
  }
};

export const getWorkById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const work = await Work.findById(id).populate('owner', 'name email');
    
    if (!work) {
      res.status(404).json({ error: 'Work not found' });
      return;
    }
    
    res.json(work);
  } catch (error) {
    console.error('Get work by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch work' });
  }
};

export const confirmWork = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { dbId, txHash } = req.body;
    
    if (!dbId || !txHash) {
      res.status(400).json({ error: 'dbId and txHash required' });
      return;
    }

    const work = await Work.findById(dbId);
    if (!work) {
      res.status(404).json({ error: 'Work not found' });
      return;
    }

    // Update with blockchain transaction hash
    work.txHash = txHash;
    await work.save();

    res.json({ success: true, work });
  } catch (error: any) {
    console.error('Confirm work error:', error);
    res.status(500).json({ error: error.message || 'Failed to confirm work' });
  }
};

export const deleteWork = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const work = await Work.findById(id);

    if (!work) {
      res.status(404).json({ error: 'Work not found' });
      return;
    }

    // Authorization: Only owner can delete
    if (work.owner.toString() !== req.user?.userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    await work.deleteOne();
    res.json({ message: 'Work deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete work' });
  }
};