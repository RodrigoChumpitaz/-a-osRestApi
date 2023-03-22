export interface IPedido extends Document {
    deliveryDate: Date;
    imgPrueba: string;
    observation: string;
    status: string;
    client: {
        id: string;
        name: string;
        slug: string;
    };
    slug: string;
    orderDetail: string[];
    generatedSlug: () => string;
}