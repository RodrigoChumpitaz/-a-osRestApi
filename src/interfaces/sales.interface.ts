import { Document } from "mongoose";

export interface ISales extends Document {
    orderId: string;
    paymentId: string;
    amount: number;
    aditional: number;
    paymentMethod: string;
    currency: string;
    status: string;
    slug: string;
    generatedSlug: () => string;
}