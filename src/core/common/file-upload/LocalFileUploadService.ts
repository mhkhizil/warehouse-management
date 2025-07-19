import { Injectable, BadRequestException } from '@nestjs/common';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class LocalFileUploadService {
  private readonly uploadDir = 'uploads/profile-images';
  private readonly maxSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  constructor() {
    // Ensure upload directory exists
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadProfileImage(file: UploadedFile): Promise<string> {
    // Validate file size
    if (file.size > this.maxSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    // Validate file type
    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed',
      );
    }

    // Generate unique filename
    const fileExtension = extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const relativePath = `${this.uploadDir}/${fileName}`;

    // Save file to disk
    try {
      const fs = await import('fs/promises');
      await fs.writeFile(relativePath, file.buffer);

      // Return the relative path (will be served as static file)
      return `/${relativePath}`;
    } catch (error) {
      throw new BadRequestException('Failed to save file');
    }
  }

  async deleteProfileImage(filePath: string): Promise<boolean> {
    try {
      if (!filePath || !filePath.includes('profile-images')) {
        return false;
      }

      // Remove leading slash and construct full path
      const cleanPath = filePath.startsWith('/')
        ? filePath.substring(1)
        : filePath;

      if (existsSync(cleanPath)) {
        const fs = await import('fs/promises');
        await fs.unlink(cleanPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  getImageUrl(relativePath: string): string {
    // This will be the URL clients can use to access the image
    // Assumes you'll set up static file serving at the root
    return relativePath;
  }
}
