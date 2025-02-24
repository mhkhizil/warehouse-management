"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let S3Service = class S3Service {
    constructor() {
        this.s3 = new client_s3_1.S3Client({
            region: process.env.S3_UPLOAD_REGION,
            endpoint: `https://s3.${process.env.S3_UPLOAD_REGION}.amazonaws.com`,
            credentials: {
                accessKeyId: process.env.AWS_S3_ACCESS_KEY,
                secretAccessKey: process.env.AWS_S3_KEY_SECRET,
            },
        });
        this.bucketName = process.env.AWS_S3_BUCKET;
    }
    async uploadFile(file, path) {
        const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = `${path}/${(0, uuid_1.v4)()}${originalName}`;
        const params = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        });
        const uploadedImg = await this.s3.send(params);
        return `https://${this.bucketName}.s3.${process.env.S3_UPLOAD_REGION}.amazonaws.com/${key}`;
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], S3Service);
//# sourceMappingURL=UploadS3Service.js.map