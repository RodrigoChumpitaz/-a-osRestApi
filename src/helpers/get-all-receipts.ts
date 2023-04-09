import Receipt from "../model/receipt"

export const getReceiptsLenght = async () => {
    const receipts = await Receipt.find();
    return receipts.length;
}