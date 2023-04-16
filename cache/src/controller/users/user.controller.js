"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserStatus = exports.updateUserById = exports.cambiarPassword = exports.comprobarToken = exports.olvidePassword = exports.perfil = exports.userList = exports.confirmedUser = exports.signin = exports.signup = void 0;
const user_1 = __importDefault(require("../../model/user"));
const createtoken_1 = require("../../helpers/createtoken");
const verificarToken_1 = __importDefault(require("../../helpers/verificarToken"));
const rol_1 = __importDefault(require("../../model/rol"));
const documentType_1 = __importDefault(require("../../model/documentType"));
const neverthrow_1 = require("neverthrow");
const create_strings_1 = require("../../helpers/create-strings");
const user_exception_1 = require("../../config/exceptions/user.exception");
const verificar = new verificarToken_1.default();
const validator = new user_exception_1.Uservalidators();
const signup = async (req, res) => {
    try {
        const { name, lastname, email, password, documentType, documentNumber, roles } = req.body;
        const { token_insert_user } = req.headers;
        if (!name || !email || !password || !documentType || !documentNumber) {
            return res.status(400).json({
                msg: 'All fields are required',
                success: false
            });
        }
        const user = await user_1.default.findOne({ $or: [
                { email: email },
                { documentNumber: documentNumber }
            ] });
        if (user) {
            return res.status(400).json({
                msg: 'The user already exists',
                success: false
            });
        }
        const docType = await documentType_1.default.findOne({ type: documentType });
        if (!docType)
            return res.status(400).json({ msg: 'The document type does not exist', success: false });
        const newUser = new user_1.default({ name, lastname, email, documentType: docType, documentNumber, password });
        if (roles && token_insert_user) {
            const findRol = await rol_1.default.find({ rol: { $in: roles } }); // find roles in db
            newUser.roles = findRol.map(rol => rol._id); // get ids of roles
        }
        else {
            const rol = await rol_1.default.findOne({ rol: 'user' });
            newUser.roles = [rol._id];
        }
        const validateDocNumberResult = validator.validateDocumentNumber(documentType, documentNumber);
        if (validateDocNumberResult.message)
            return res.status(validator.status).json({ msg: validateDocNumberResult.message, success: false });
        const existDocNumber = await validator.existDocumentNumber(documentType, documentNumber);
        if (token_insert_user) {
            newUser.token = null;
            newUser.confirmed = true;
            existDocNumber.response.success = true;
        }
        if (documentType === 'CE')
            existDocNumber.response.success = true;
        if (existDocNumber.response.success === false)
            return res.status(validator.status).json({ msg: existDocNumber.message, success: false });
        if (validator.validatePassword(password) != null) {
            return res.status(validator.status).json({ msg: validator.validatePassword(password).message, success: false });
        }
        await newUser.save();
        return res.status(201).json({
            msg: 'User created successfully',
            token: newUser.token,
            success: true
        });
    }
    catch (error) {
        return (0, neverthrow_1.err)(new user_exception_1.UserInsertException(error.message));
    }
};
exports.signup = signup;
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                msg: 'Please send your email and password',
                status: false
            });
        }
        const user = await user_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: 'The user does not exist',
                status: false
            });
        }
        if (user.confirmed === false)
            return res.status(400).json({ msg: 'The user is not confirmed' });
        if (user.status === "inactive")
            return res.status(400).json({ msg: 'The user is inactive' });
        const isMatch = await user.comparePassword(password);
        if (isMatch && user.token === null) {
            res.cookie('access_token', (0, createtoken_1.createAuthToken)(user), { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            res.cookie('refresh_token', (0, createtoken_1.createRefreshToken)(user), { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
            return res.status(200).json({
                token: (0, createtoken_1.createAuthToken)(user),
                status: true,
            });
        }
        return (0, neverthrow_1.err)(res.status(400).json({
            msg: 'The password is incorrect',
            status: false
        }));
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};
exports.signin = signin;
const confirmedUser = async (req, res) => {
    const { token } = req.params;
    const userToken = await user_1.default.findOne({ token });
    if (!userToken)
        return (0, neverthrow_1.err)(res.status(400).json({ msg: 'The token is not valid' }));
    try {
        userToken.token = null;
        userToken.confirmed = true;
        await userToken.save();
        return (0, neverthrow_1.ok)(res.status(200).json({ msg: 'User confirmed successfully' }));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ msg: error.message }));
    }
};
exports.confirmedUser = confirmedUser;
const userList = async (req, res) => {
    try {
        const isEjecutor = await verificar.verificarToken(req);
        if (!isEjecutor)
            return res.status(401).json({ msg: 'You are not authorized to access this resource' });
        const users = await user_1.default.find().populate('roles');
        return res.status(200).json(users);
    }
    catch (error) {
        return (0, neverthrow_1.err)(new user_exception_1.UserListException(error.message));
    }
};
exports.userList = userList;
const perfil = async (req, res) => {
    try {
        const { user } = req;
        return (0, neverthrow_1.ok)(res.json(user));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ msg: error.message }));
    }
};
exports.perfil = perfil;
const olvidePassword = async (req, res) => {
    const { email } = req.body;
    const userByEmail = await user_1.default.findOne({ email });
    if (!userByEmail)
        return res.status(400).json({ msg: 'The email dont exist' });
    try {
        userByEmail.token = (0, create_strings_1.generarId)();
        userByEmail.confirmed = false;
        await userByEmail.save();
        return (0, neverthrow_1.ok)(res.status(200).json({
            msg: 'Se ha enviado un email con token a confirmar',
            data: userByEmail.token
        }));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ msg: error.message }));
    }
};
exports.olvidePassword = olvidePassword;
const comprobarToken = async (req, res) => {
    const { new_token } = req.params;
    const tokenValido = await user_1.default.findOne({ token: new_token }).select('-documentType -documentNumber -roles -confirmed');
    try {
        if (!tokenValido)
            return res.status(400).json({ msg: 'The token is not valid' });
        return (0, neverthrow_1.ok)(res.status(200).json({
            msg: 'The token is valid',
            data: tokenValido
        }));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ msg: error.message }));
    }
};
exports.comprobarToken = comprobarToken;
const cambiarPassword = async (req, res) => {
    const { new_token } = req.params;
    const { password } = req.body;
    const userToken = await user_1.default.findOne({ token: new_token });
    console.log(userToken);
    if (!userToken)
        return res.status(400).json({ msg: 'The token is not valid or dont match the users' });
    try {
        userToken.token = null;
        userToken.password = password;
        userToken.confirmed = true;
        await userToken.save();
        return (0, neverthrow_1.ok)(res.status(200).json({ msg: 'Password changed successfully', data: userToken.password }));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ msg: error.message }));
    }
};
exports.cambiarPassword = cambiarPassword;
const updateUserById = async (req, res) => {
    try {
        const { name, lastname, email, password, roles } = req.body;
        const { id } = req.params;
        const userById = await user_1.default.findById(id);
        console.log(userById);
        if (!userById || userById === null)
            return res.status(400).json({ msg: 'The user dont exist' });
        userById.name = name || userById.name;
        userById.lastname = lastname || userById.lastname;
        userById.email = email || userById.email;
        if (!password || password === "") {
            userById.password = userById.password;
        }
        else {
            userById.password = password.trim();
        }
        if (roles) {
            const findRol = await rol_1.default.find({ rol: { $in: roles } });
            userById.roles = findRol.map(rol => rol._id);
        }
        else {
            userById.roles = userById.roles;
        }
        await userById.save();
        return res.status(200).json({ msg: 'User updated successfully', data: userById });
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ msg: error.message }));
    }
};
exports.updateUserById = updateUserById;
const changeUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const userById = await user_1.default.findById(id);
        if (!userById || userById === null)
            return res.status(400).json({ msg: 'The user dont exist' });
        if (userById.status === "active") {
            await user_1.default.findByIdAndUpdate(id, { status: "inactive" });
            return res.status(200).json({ msg: 'User status changed to inactive' });
        }
        await user_1.default.findByIdAndUpdate(id, { status: "active" });
        return res.status(200).json({ msg: 'User status changed to active' });
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ msg: error.message }));
    }
};
exports.changeUserStatus = changeUserStatus;
