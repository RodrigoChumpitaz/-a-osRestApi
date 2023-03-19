export interface IPedido extends Document {
    deliveryData: Date;
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