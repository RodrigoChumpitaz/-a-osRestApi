import { Request, Response, Router } from "express";
import DocumenType from "../../model/documentType";
import { ok, err, Result } from "neverthrow";

const router = Router();

router.get("/getDocTypes", async (req: Request, res: Response) => {
    const data = await DocumenType.find();
    return ok(res.status(200).json(data));
})
router.post("/addDocType", async (req: Request, res: Response) => {
    try {
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