import { ICategoria } from "../../interfaces/categoria.interface"

export const getDataByCategory = (category: ICategoria) => {
    return {
        id: category.id,
        name: category.description,
        slug: category.slug
    }
}