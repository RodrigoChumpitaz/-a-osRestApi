export interface FileResponse {
    fieldname:            string;
    originalname:         string;
    encoding:             string;
    mimetype:             string;
    size:                 number;
    bucket:               string;
    key:                  string;
    acl:                  string;
    contentType:          string;
    contentDisposition:   null;
    contentEncoding:      null;
    storageClass:         string;
    serverSideEncryption: null;
    metadata:             Metadata;
    location:             string;
    etag:                 string;
}

export interface Metadata {
    fieldName: string;
}
