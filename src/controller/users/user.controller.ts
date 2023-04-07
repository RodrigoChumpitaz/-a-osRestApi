import e, { Request, Response } from 'express';
import User from '../../model/user';
import { IUser } from '../../interfaces/user.interface';
import { createAuthToken, createRefreshToken } from '../../helpers/createtoken';
import Verificar from '../../helpers/verificarToken';
import Rol from '../../model/rol';
import DocumentType from '../../model/documentType';
import { IDocumentType } from '../../interfaces/documentType.interface';
import { ok, err, Result } from "neverthrow";
import { generarId } from '../../helpers/create-strings';
import { UserInsertResultApp, UserListResultApp } from '../../config/results/user.result';
import { UserInsertException, UserListException, Uservalidators } from '../../config/exceptions/user.exception';

const verificar = new Verificar();
const validator = new Uservalidators();
export type UserInsertResult = Result<UserInsertResultApp, UserInsertException>;
export type UserListResult = Result<UserListResultApp, UserListException>;

export const signup = async (req: Request, res: Response): Promise<UserInsertResult | Response>  => {
    try {
        const { name, lastname, email, password, documentType, documentNumber, roles } = req.body;
        const { token_insert_user } = req.headers;

        if(!name || !email || !password || !documentType || !documentNumber) {
            return res.status(400).json({
                msg: 'All fields are required',
                success: false
            });
        }
        const user: IUser = await User.findOne({ $or: [
            { email: email },
            { documentNumber: documentNumber } 
        ]});
        if(user) {
            return res.status(400).json({
                msg: 'The user already exists',
                success: false
            });
        }
        const docType: IDocumentType = await DocumentType.findOne({ type: documentType });
        if(!docType) return res.status(400).json({ msg: 'The document type does not exist', success: false });

        const newUser: IUser = new User({ name, lastname, email, documentType: docType, documentNumber, password });
        if(roles && token_insert_user){
            const findRol: any[] = await Rol.find({rol: { $in: roles }}); // find roles in db
            newUser.roles = findRol.map(rol => rol._id); // get ids of roles
        }else{
            const rol: any = await Rol.findOne({ rol: 'user' });
            newUser.roles = [rol._id];
        }
        const validateDocNumberResult = validator.validateDocumentNumber(documentType, documentNumber);
        if (validateDocNumberResult.message) return res.status(validator.status).json({ msg: validateDocNumberResult.message, success: false });

        const existDocNumber = await validator.existDocumentNumber(documentType, documentNumber);
        
        if(token_insert_user) {
            newUser.token = null;
            newUser.confirmed = true;
            existDocNumber.response.success = true;
        }
        if(documentType === 'CE') existDocNumber.response.success = true;

        if(existDocNumber.response.success === false) return res.status(validator.status).json({ msg: existDocNumber.message, success: false });


        if(validator.validatePassword(password) != null) {
            return res.status(validator.status).json({ msg: validator.validatePassword(password).message, success: false });
        }
        await newUser.save();
        return res.status(201).json({
            msg: 'User created successfully',
            token: newUser.token,
            success: true
        });
    } catch (error) {
        return err(new UserInsertException(error.message));
    }
};


export const signin = async (req: Request, res: Response) => {  
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({
                msg: 'Please send your email and password',
                status: false
            });
        }

        const user: IUser = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({
                msg: 'The user does not exist',
                status: false
            });
        }

        if(user.confirmed === false) return res.status(400).json({ msg: 'The user is not confirmed' });
        if(user.status === "inactive") return res.status(400).json({ msg: 'The user is inactive' });

        const isMatch = await user.comparePassword(password)
        if(isMatch && user.token  === null) {
            res.cookie('access_token', createAuthToken(user), { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            res.cookie('refresh_token', createRefreshToken(user), { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
            return res.status(200).json({
                token: createAuthToken(user),
                status: true,
            });
        }

        return err(res.status(400).json({
            msg: 'The password is incorrect',
            status: false
        }));
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

export const confirmedUser = async (req: Request, res: Response)=> {
    const { token } = req.params;
    const userToken = await User.findOne({ token });
    if(!userToken) return err(res.status(400).json({ msg: 'The token is not valid' }));
    try {
        userToken.token = null;
        userToken.confirmed = true;
        await userToken.save();
        return ok(res.status(200).json({ msg: 'User confirmed successfully' }));
    } catch (error) {
        return err(res.status(500).json({ msg: error.message }));
    }
}

export const userList = async (req: Request, res: Response): Promise<UserListResult | Response> => {
    try {
        const isEjecutor = await verificar.verificarToken(req);
        if(!isEjecutor) return res.status(401).json({ msg: 'You are not authorized to access this resource' });
        const users: IUser[] = await User.find().populate('roles');
        return res.status(200).json(users);
    } catch (error) {
        return err(new UserListException(error.message));
    }
}

export const perfil = async (req: Request, res: Response) => {
    try {
        const { user } = req;
        return ok(res.json(user));
    } catch (error) {
        return err(res.status(500).json({ msg: error.message }));
    }
}

export const olvidePassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const userByEmail: IUser = await User.findOne({ email });
    if(!userByEmail) return res.status(400).json({ msg: 'The email dont exist' });
    try {
        userByEmail.token = generarId();
        userByEmail.confirmed = false;
        await userByEmail.save();
        return ok(res.status(200).json({ 
            msg: 'Se ha enviado un email con token a confirmar',
            data: userByEmail.token
        }));
    } catch (error) {
        return err(res.status(500).json({ msg: error.message }));
    }
}

export const comprobarToken = async (req: Request, res: Response) => {
    const { new_token } = req.params;
    const tokenValido = await User.findOne({ token: new_token }).select('-documentType -documentNumber -roles -confirmed');
    try {
        if(!tokenValido) return res.status(400).json({ msg: 'The token is not valid' });
        return ok(res.status(200).json({ 
            msg: 'The token is valid',
            data: tokenValido
        }));
    } catch (error) {
        return err(res.status(500).json({ msg: error.message }));
    }
}

export const cambiarPassword = async (req: Request, res: Response) => {
    const { new_token } = req.params;
    const { password } = req.body;
    const userToken = await User.findOne({ token: new_token });
    console.log(userToken);
    if(!userToken) return res.status(400).json({ msg: 'The token is not valid or dont match the users' });
    try {
        userToken.token = null;
        userToken.password = password;
        userToken.confirmed = true;
        await userToken.save();
        return ok(res.status(200).json({ msg: 'Password changed successfully', data: userToken.password }));
    }
    catch(error) {
        return err(res.status(500).json({ msg: error.message }));
    }
}


export const updateUserById = async (req: Request, res: Response) => {
    try {
        const { name, lastname, email, password, roles }  = req.body;
        const { id } = req.params;
        const userById: IUser = await User.findById(id);
        console.log(userById);
        if(!userById || userById === null) return res.status(400).json({ msg: 'The user dont exist' });
        userById.name = name || userById.name;
        userById.lastname = lastname || userById.lastname;
        userById.email = email || userById.email;
        if(!password || password === "") {
            userById.password = userById.password;
        }
        else{
            userById.password = password.trim();
        }
        if(roles){
            const findRol: any[] = await Rol.find({rol: { $in: roles }});
            userById.roles = findRol.map(rol => rol._id);
        }
        else{
            userById.roles = userById.roles;
        }
        await userById.save();
        return res.status(200).json({ msg: 'User updated successfully', data: userById });
    } catch (error) {
        return err(res.status(500).json({ msg: error.message }));   
    }
}


export const changeUserStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userById: IUser = await User.findById(id);
        if(!userById || userById === null) return res.status(400).json({ msg: 'The user dont exist' });
        if(userById.status === "active"){
            await User.findByIdAndUpdate(id, { status: "inactive" });
            return res.status(200).json({ msg: 'User status changed to inactive'});
        }
        await User.findByIdAndUpdate(id, { status: "active" });
        return res.status(200).json({ msg: 'User status changed to active'});
    } catch (error) {
        return err(res.status(500).json({ msg: error.message }));
    }
}