import fs from 'fs';
import path from 'path';

export const buildFileUrl = (filename: string): string => {
  return `/uploads/${filename}`;
};

export const deleteFile = (filePath: string): void => {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};