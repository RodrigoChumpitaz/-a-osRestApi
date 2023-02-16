import { IRol } from '../../interfaces/rol.interface';

export interface UserInsertResultApp {
    readonly msg:  string;
    readonly data: Data;
}

export interface Data {
    name:           string;
    lastname:       string;
    documentType:   DocumentType;
    documentNumber: string;
    email:          string;
    password:       string;
    address:        string;
    token:          string;
    confirmed:      boolean;
    roles:          string[];
    _id:            string;
    createdAt:      Date;
    updatedAt:      Date;
}

export interface DocumentType {
    _id:       string;
    type:      string;
    createdAt: Date;
    updatedAt: Date;
    slug:      string;
}


export interface UserListResultApp {
    readonly _id:            string;
    readonly name:           string;
    readonly lastname:       string;
    readonly documentType:   string;
    readonly documentNumber: string;
    readonly email:          string;
    readonly password:       string;
    readonly address:        string;
    readonly token:          null | string;
    readonly confirmed:      boolean;
    readonly roles:          Partial<IRol[]>;
    readonly createdAt:      Date;
    readonly updatedAt:      Date;
}
