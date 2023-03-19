import { Schema,model } from "mongoose";
import { IUser } from "src/interfaces/user.interface";
import bcrypt from 'bcrypt'
import { generarId } from "../helpers/create-strings";
const userSchema: Schema = new Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    documentType: { 
        type: Schema.Types.ObjectId,
        ref: 'DocumentType',
        required: true 
    },
    documentNumber: { type: String, required: true, unique: true },
    email: { 
        type: String, required: true, 
        unique: true, 
        trim: true, 
        lowercase: true 
    },
    password: { type: String, required: true },
    address: { type: String, required: false, default: 'Perú' },
    token: { type: String, default: generarId() },
    confirmed: { type: Boolean, default: false },
    roles: [{
        type: Schema.Types.ObjectId,
        ref: 'Rol',
        required: true
    }]
},{
    timestamps: true,
    versionKey: false
});

userSchema.pre<IUser>('save', async function(next){
    const user: IUser = this;
    if(!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt)
    user.password = hash;
    next();
})

userSchema.methods.comparePassword = async function(password: string): Promise<boolean>{ 
    return await bcrypt.compare(password, this.password);
};

export default model<IUser>('User', userSchema);