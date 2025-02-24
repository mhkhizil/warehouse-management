export declare class S3Service {
    private s3;
    private bucketName;
    constructor();
    uploadFile(file: Express.Multer.File, path: string): Promise<string>;
}
