import fetch from "node-fetch";

export class UserInsertException extends Error{
    status: number = 500;
    constructor(message: string){
        super(UserInsertException.getMessage(message));
        this.name = 'UserInsertException';
    }

    static getMessage(message: string){
        return `An error occurred while inserting the user: ${message}`
    }
    
}

export class UserListException extends Error{
    status: number = 500;
    constructor(message: string){
        super(UserListException.getMessage(message));
        this.name = 'UserListException';
    }

    static getMessage(message: string){
        return `An error occurred while listing the users: ${message}`
    }
}

export class Uservalidators{
    status: number = 400;
    pattern: RegExp = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.#?!@$%^&*-]).{8,}$/;

    validateDocumentNumber(type: string, documentNumber: string){
        let message: string;
        if(!type || !documentNumber){ message = 'All fields are required'};

        if(type === 'DNI'){
            if(documentNumber.length != 8){ message = 'The DNI number must have 8 digits'};
            if(!documentNumber.match(/^[0-9]+$/)){ message = 'The DNI must be a number'};
        }
        if(type === 'CE'){
            if(documentNumber.length != 12){ message = 'The CE number must have 12 digits'};
            if(!documentNumber.match(/^[0-9]+$/)){ message = 'The CE must be a number'};
        }
        if(type === 'RUC'){
            if(documentNumber.length != 11){ message = 'The RUC number must have 11 digits' };
            if(!documentNumber.match(/^[0-9]+$/)){ message = 'The RUC must be a number' };
        }
        return {
            message,
            status: this.status
        };
    }
    
    async existDocumentNumber(type: string, documentNumber: string){
        let message: string = 'The document number doesnt exist';
        const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRpZWdvYW5nZWxlczEzMDcwM0BnbWFpbC5jb20ifQ.1RWsafOIIGEfBJwiae1MseCEQ4kKyvQgflmXnj9b6ck';
        if(type === 'CE') type = 'dni';
        const data: any = await fetch(`https://dniruc.apisperu.com/api/v1/${type.toLowerCase()}/${documentNumber}?token=${token}`)
        const response: any = await data.json();
        return {
            response: response,
            message: message,
        };
    }

    validatePassword(password: string){
        if(!this.pattern.test(password)) return {
            message: 'The password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character',
            status: this.status
        };
        return null;
    }
}