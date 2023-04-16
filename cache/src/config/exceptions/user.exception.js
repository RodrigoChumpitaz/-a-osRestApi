"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uservalidators = exports.UserListException = exports.UserInsertException = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
class UserInsertException extends Error {
    constructor(message) {
        super(UserInsertException.getMessage(message));
        this.status = 500;
        this.name = 'UserInsertException';
    }
    static getMessage(message) {
        return `An error occurred while inserting the user: ${message}`;
    }
}
exports.UserInsertException = UserInsertException;
class UserListException extends Error {
    constructor(message) {
        super(UserListException.getMessage(message));
        this.status = 500;
        this.name = 'UserListException';
    }
    static getMessage(message) {
        return `An error occurred while listing the users: ${message}`;
    }
}
exports.UserListException = UserListException;
class Uservalidators {
    constructor() {
        this.status = 400;
        this.pattern = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.#?!@$%^&*-]).{8,}$/;
    }
    validateDocumentNumber(type, documentNumber) {
        let message;
        if (!type || !documentNumber) {
            message = 'All fields are required';
        }
        ;
        if (type === 'DNI') {
            if (documentNumber.length != 8) {
                message = 'The DNI number must have 9 digits';
            }
            ;
            if (!documentNumber.match(/^[0-9]+$/)) {
                message = 'The DNI must be a number';
            }
            ;
        }
        if (type === 'CE') {
            if (documentNumber.length != 12) {
                message = 'The CE number must have 12 digits';
            }
            ;
            if (!documentNumber.match(/^[0-9]+$/)) {
                message = 'The CE must be a number';
            }
            ;
        }
        if (type === 'RUC') {
            if (documentNumber.length != 11) {
                message = 'The RUC number must have 11 digits';
            }
            ;
            if (!documentNumber.match(/^[0-9]+$/)) {
                message = 'The RUC must be a number';
            }
            ;
        }
        return {
            message,
            status: this.status
        };
    }
    async existDocumentNumber(type, documentNumber) {
        let message = 'The document number doesnt exist';
        const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRpZWdvYW5nZWxlczEzMDcwM0BnbWFpbC5jb20ifQ.1RWsafOIIGEfBJwiae1MseCEQ4kKyvQgflmXnj9b6ck';
        if (type === 'CE')
            type = 'dni';
        const data = await (0, node_fetch_1.default)(`https://dniruc.apisperu.com/api/v1/${type.toLowerCase()}/${documentNumber}?token=${token}`);
        const response = await data.json();
        return {
            response: response,
            message: message,
        };
    }
    validatePassword(password) {
        if (!this.pattern.test(password))
            return {
                message: 'The password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character',
                status: this.status
            };
        return null;
    }
}
exports.Uservalidators = Uservalidators;
