import { Request, Response } from "express";
import { ok } from "neverthrow";
import fetch from 'node-fetch';
import { IDistrito } from "src/interfaces/distrito.interface";
import Distrito from "../../model/distritos";


export const getDistritosLima = async(req: Request, res: Response): Promise<any> => {
    try {
        const data: any = await fetch('https://bogota-laburbano.opendatasoft.com/api/records/1.0/search/?dataset=distritos-peru&q=&rows=80&facet=nombdep&facet=nombprov&refine.nombdep=LIMA&refine.nombprov=LIMA');
        const response: any = await data.json();
        const distritosToApi: any[] = response.records.map((distrito: any) => {
            return {
                id: distrito.recordid,
                name: distrito.fields.nombdist
            }
        });
        // return res.status(200).json({
        //     count: distritos.length,
        //     data: distritos
        // })
        const distritos: IDistrito[] = await Distrito.find({ active: true }).populate({ "path": "locals", "select": "-distrito -createdAt -updatedAt -__v" });
        return ok(res.status(200).json(
            // originalData: distritosToApi,
            distritos
        ));
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

export const addDistritosMasive = async(req: Request, res: Response): Promise<any> => {
    const data = await fetch('http://localhost:3500/commons/distritos');
    const response = await data.json();
    // response.data.forEach(async ({name}: any) => {
    //     // console.log(name);
    //     let newDistrito = new Distrito({ nombre: name });
    //     await newDistrito.save();
    //     // console.log(newDistrito);
    // })
    // return res.status(200).json({
    //     msg: 'Distritos added successfully'
    // })
    return res.status(200).json({
        msg: "There are'nt distritos to add",
    });
}