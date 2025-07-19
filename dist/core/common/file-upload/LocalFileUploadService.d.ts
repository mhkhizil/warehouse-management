export interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}
export declare class LocalFileUploadService {
    private readonly uploadDir;
    private readonly maxSize;
    private readonly allowedTypes;
    constructor();
    uploadProfileImage(file: UploadedFile): Promise<string>;
    deleteProfileImage(filePath: string): Promise<boolean>;
    getImageUrl(relativePath: string): string;
}
