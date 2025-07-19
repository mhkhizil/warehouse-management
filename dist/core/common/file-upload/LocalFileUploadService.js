"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFileUploadService = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const fs_1 = require("fs");
const uuid_1 = require("uuid");
let LocalFileUploadService = class LocalFileUploadService {
    constructor() {
        this.uploadDir = 'uploads/profile-images';
        this.maxSize = 5 * 1024 * 1024;
        this.allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
        ];
        if (!(0, fs_1.existsSync)(this.uploadDir)) {
            (0, fs_1.mkdirSync)(this.uploadDir, { recursive: true });
        }
    }
    async uploadProfileImage(file) {
        if (file.size > this.maxSize) {
            throw new common_1.BadRequestException('File size exceeds 5MB limit');
        }
        if (!this.allowedTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed');
        }
        const fileExtension = (0, path_1.extname)(file.originalname);
        const fileName = `${(0, uuid_1.v4)()}${fileExtension}`;
        const relativePath = `${this.uploadDir}/${fileName}`;
        try {
            const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
            await fs.writeFile(relativePath, file.buffer);
            return `/${relativePath}`;
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to save file');
        }
    }
    async deleteProfileImage(filePath) {
        try {
            if (!filePath || !filePath.includes('profile-images')) {
                return false;
            }
            const cleanPath = filePath.startsWith('/')
                ? filePath.substring(1)
                : filePath;
            if ((0, fs_1.existsSync)(cleanPath)) {
                const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
                await fs.unlink(cleanPath);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }
    getImageUrl(relativePath) {
        return relativePath;
    }
};
exports.LocalFileUploadService = LocalFileUploadService;
exports.LocalFileUploadService = LocalFileUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LocalFileUploadService);
//# sourceMappingURL=LocalFileUploadService.js.map