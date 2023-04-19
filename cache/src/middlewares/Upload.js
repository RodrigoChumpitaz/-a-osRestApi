"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mimetypes = exports.upload = exports.Upload = exports.UploadOptions = exports.UploadBuilder = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
const env_1 = require("../config/env");
class UploadBuilder {
    get fieldName() {
        return this._fieldName;
    }
    addFieldName(fieldName) {
        this._fieldName = fieldName;
        return this;
    }
    get maxSize() {
        return this._maxSize;
    }
    addMaxSize(maxSize) {
        this._maxSize = maxSize;
        return this;
    }
    get allowedMimeTypes() {
        return this._allowedMimeTypes;
    }
    addAllowedMimeTypes(data) {
        this._allowedMimeTypes = data;
        return this;
    }
    get isPublic() {
        return this._isPublic;
    }
    addIsPublic(isPublic) {
        this._isPublic = isPublic;
        return this;
    }
    build() {
        return new UploadOptions(this);
    }
}
exports.UploadBuilder = UploadBuilder;
class UploadOptions {
    constructor(builder) {
        this.fieldName = builder.fieldName;
        this.maxSize = builder.maxSize;
        this.allowedMimeTypes = builder.allowedMimeTypes;
        this.isPublic = builder.isPublic;
    }
}
exports.UploadOptions = UploadOptions;
class Upload {
    save(options) {
        return (0, multer_1.default)({
            limits: { fileSize: options.maxSize },
            storage: (0, multer_s3_1.default)({
                s3: new client_s3_1.S3Client({
                    region: env_1.environment.AWS_REGION,
                    credentials: {
                        accessKeyId: env_1.environment.AWS_ACCESS_KEY_ID,
                        secretAccessKey: env_1.environment.AWS_ACCESS_KEY_SECRET
                    }
                }),
                bucket: env_1.environment.AWS_BUCKET_NAME,
                acl: options.isPublic ? 'public-read-write' : 'private',
                contentType: function (req, file, cb) {
                    cb(null, file.mimetype);
                },
                metadata: function (req, file, cb) {
                    cb(null, { fieldName: file.fieldname });
                },
                key: function (req, file, cb) {
                    const mimetype = file.mimetype;
                    const isFileAllowed = options.allowedMimeTypes.includes(mimetype);
                    if (!isFileAllowed) {
                        return cb(new Error('File type not allowed'));
                    }
                    const originalname = file.originalname.slice(0, file.originalname.lastIndexOf('.'));
                    const extension = file.originalname.split('.')[1];
                    const fileName = `${originalname}-${Date.now()}.${extension}`;
                    req.body[options.fieldName] = fileName;
                    cb(null, fileName);
                },
            })
        }).single(options.fieldName);
    }
}
exports.Upload = Upload;
exports.upload = new Upload();
exports.mimetypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
];
