import mongoose from 'mongoose';
import { CONFIG } from './env.ts';

export const connect_db = async () => {
    try {
    const conn = await mongoose.connect(CONFIG.MONGODB_URI);
    console.log(`MongoDB sudah konek : ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(1);
        });

    mongoose.connection.on('disconnected', () => {
       console.warn('MongoDB koneksi terputus, mencoba reconnect...');
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Gagal konek ke MongoDB: ${message}`);
        process.exit(1);
    }
};