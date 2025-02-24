/* eslint-disable no-undef */
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucketName: string;
  //   accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  //   secretAccessKey: process.env.AWS_S3_KEY_SECRET,
  //   region: process.env.S3_UPLOAD_REGION,
  constructor() {
    this.s3 = new S3Client({
      region: process.env.S3_UPLOAD_REGION,
      endpoint: `https://s3.${process.env.S3_UPLOAD_REGION}.amazonaws.com`,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_KEY_SECRET,
      },
    });
    this.bucketName = process.env.AWS_S3_BUCKET;
  }

  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${path}/${uuidv4()}${originalName}`;
    const params = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read', // Optional: Makes the file publicly accessible
    });
    const uploadedImg = await this.s3.send(params);

    return `https://${this.bucketName}.s3.${process.env.S3_UPLOAD_REGION}.amazonaws.com/${key}`;
  }
}
