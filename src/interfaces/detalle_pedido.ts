import { ICarta } from "./carta.interface";
import { IPedido } from "./pedido.interface";

export interface IDetallePedido extends Document {
    detail: string;
    Cart: ICarta,
    order: IPedido;
    quantity: number;
    slug: string;
    generatedSlug: () => string;
}