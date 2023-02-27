import multer from "multer";
import multer_s3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { environment } from "../config/env";
import { Request } from "express";

export class UploadBuilder{
    private _fieldName: string;
    private _maxSize: number;
    private _allowedMimeTypes: string[];
    private _isPublic: boolean;

    get fieldName(): string{
        return this._fieldName;
    }

    addFieldName(fieldName: string): UploadBuilder{
        this._fieldName = fieldName;
        return this;
    }

    get maxSize(): number{
        return this._maxSize;
    }

    addMaxSize(maxSize: number): UploadBuilder{
        this._maxSize = maxSize;
        return this;
    }

    get allowedMimeTypes(): string[]{
        return this._allowedMimeTypes;
    }

    addAllowedMimeTypes(data: string[]): UploadBuilder{ 
        this._allowedMimeTypes = data;
        return this;
    }

    get isPublic(): boolean{
        return this._isPublic;
    }

    addIsPublic(isPublic: boolean): UploadBuilder{
        this._isPublic = isPublic;
        return this;
    }

    build(): UploadOptions{
        return new UploadOptions(this);
    }
}

export class UploadOptions{
    readonly fieldName: string;
    readonly maxSize: number;
    readonly allowedMimeTypes: string[];
    readonly destination: string;
    readonly isPublic: boolean;

    constructor(builder: UploadBuilder){
        this.fieldName = builder.fieldName;
        this.maxSize = builder.maxSize;
        this.allowedMimeTypes = builder.allowedMimeTypes;
        this.isPublic = builder.isPublic;
    }
}


export class Upload{
    save(options: UploadOptions){
        return multer({
            limits: { fileSize: options.maxSize },
            storage: multer_s3({
                s3: new S3Client({
                    region: environment.AWS_REGION,
                    credentials: {
                        accessKeyId: environment.AWS_ACCESS_KEY_ID,
                        secretAccessKey: environment.AWS_ACCESS_KEY_SECRET
                    }
                }),
                bucket: environment.AWS_BUCKET_NAME,
                acl: options.isPublic ? 'public-read-write' : 'private',
                contentType: function(req: Request, file, cb) {
                    cb(null, file.mimetype);
                },
                metadata: function(req: Request, file, cb) {
                    cb(null, {fieldName: file.fieldname});
                },
                key: function(req: Request, file: Express.Multer.File, cb) {
                    const mimetype = file.mimetype 
                    const isFileAllowed = options.allowedMimeTypes.includes(mimetype);
                    if(!isFileAllowed){
                        return cb(new Error('File type not allowed'));
                    }
                    const originalname = file.originalname.slice(0, file.originalname.lastIndexOf('.'));
                    const extension = file.originalname.split('.')[1];
                    const fileName = `${originalname}-${Date.now()}.${extension}`;
                    req.body[options.fieldName] = fileName;
                    cb(null, fileName);
                },
            })
        }).single(options.fieldName)
    }
}

export const upload = new Upload();
export const mimetypes: string[] = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
]