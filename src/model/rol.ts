import { Schema, model } from "mongoose";
import { IRol } from "src/interfaces/rol.interface";

const rolSchema: Schema = new Schema({
    rol: { 
        type: String, 
        required: true, 
        unique: true 
    },
    permissions: [{
        type: Schema.Types.ObjectId,
        ref: 'Permission',
        required: true
    }]
},{
    timestamps: true,
    versionKey: false
})

export default model<IRol>('Rol', rolSchema);