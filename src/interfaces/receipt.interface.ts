import { Document } from "mongoose";

export interface IReceipt extends Document{
    orderId: string;
    payment: {
        id: string;
        slug: string;
    };
    igv: number;
    subtotal: number;
    total: number;
    discount: number;
    receiptNumber: number;
    slug: string;
    createdAt: string;
    updatedAt: string;
    generatedSlug: () => string;
}