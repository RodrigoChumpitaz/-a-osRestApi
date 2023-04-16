"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDistritosMasive = exports.getDistritosLima = void 0;
const neverthrow_1 = require("neverthrow");
const node_fetch_1 = __importDefault(require("node-fetch"));
const distritos_1 = __importDefault(require("../../model/distritos"));
const getDistritosLima = async (req, res) => {
    try {
        const data = await (0, node_fetch_1.default)('https://bogota-laburbano.opendatasoft.com/api/records/1.0/search/?dataset=distritos-peru&q=&rows=80&facet=nombdep&facet=nombprov&refine.nombdep=LIMA&refine.nombprov=LIMA');
        const response = await data.json();
        const distritosToApi = response.records.map((distrito) => {
            return {
                id: distrito.recordid,
                name: distrito.fields.nombdist
            };
        });
        // return res.status(200).json({
        //     count: distritos.length,
        //     data: distritos
        // })
        const distritos = await distritos_1.default.find({ active: true }).populate({ "path": "locals", "select": "-distrito -createdAt -updatedAt -__v" });
        return (0, neverthrow_1.ok)(res.status(200).json(
        // originalData: distritosToApi,
        distritos));
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};
exports.getDistritosLima = getDistritosLima;
const addDistritosMasive = async (req, res) => {
    const data = await (0, node_fetch_1.default)('http://localhost:3500/commons/distritos');
    const response = await data.json();
    /*
     ? METODO PARA AGREGAR DISTRITOS MASIVAMENTE
    */
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
};
exports.addDistritosMasive = addDistritosMasive;
