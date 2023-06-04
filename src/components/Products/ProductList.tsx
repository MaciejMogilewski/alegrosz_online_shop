import {ProductWithCategories} from "../../types/product";
import ProductItem from "./ProductItem";

type ProductListProps = {
    products: ProductWithCategories[];
    query: string;
    sortParam: string;
}

function ProductList({products, query, sortParam}: ProductListProps) {
    return (
        <>
            {products
                .filter((product) => `${product.name} ${product.description}`
                    .toLowerCase()
                    .includes(query.toLowerCase())
                )
                .sort((a, b) => {
                    if (sortParam === 'asc') {
                        return a.price - b.price;
                    }

                    if (sortParam === 'desc') {
                        return b.price - a.price
                    }

                    return 0

                })
                .map((product) => (
                    <ProductItem product={product} key={product.id}/>
                ))
            }
        </>
    );
}

export default ProductList;
