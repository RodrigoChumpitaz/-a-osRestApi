import { Request, Response, Router } from "express";
import DocumenType from "../../../model/documentType";
import { ok, err} from "neverthrow";
import Verificar from "../../../helpers/verificarToken";
import validate from "../../../middlewares/checkout";


const router = Router();
const verificar = new Verificar();

// router.use(validate);

router.get("/getDocTypes", async (req: Request, res: Response) => {
    const data = await DocumenType.find();
    return ok(res.status(200).json(data));
})
router.post("/addDocType", async (req: Request, res: Response) => {
    try {
        const isAdmin = await verificar.isAdmin(req);
        if (!isAdmin) return res.status(401).json({ msg: 'The user dont have authorization' });
        const { type } = req.body;
        if(!type) return res.status(400).json({ message: "Type is required" });
        const newDocType = new DocumenType({ type });
        await newDocType.save();
        return ok(res.status(200).json({ 
            message: "Document type created",
            data: newDocType 
        }));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
})


export default router;