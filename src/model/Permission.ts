import { Schema, model } from "mongoose";
import { IPermission } from "../interfaces/permission.interface";

const permissionSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true, trim: true, lowercase: true },
},{
    timestamps: true,
})

export default model<IPermission>('Permission', permissionSchema);