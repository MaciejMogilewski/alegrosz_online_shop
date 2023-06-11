import {Product, ProductWithCart} from "../types/product";
import {CategoryApi, Subcategory} from "../types/category";
import {getData} from "../src/api/api";

export async function getProductsWithCategories(signal: AbortSignal): Promise<ProductWithCart[]> {
    const response: [Product[], CategoryApi[], Subcategory[]] = await Promise.all([
        getData<Product>({endpoint: "products", signal}),
        getData<CategoryApi>({endpoint: "categories", signal}),
        getData<Subcategory>({endpoint: "subcategories", signal})
    ]);

    const [products, categories, subcategories] = response;

    return products.map((product) => ({
        ...product,
        category: categories.find((category) => product.category === category.id),
        subcategory: subcategories.find((subcategory) => product.subcategory === subcategory.id)
    }))
}
