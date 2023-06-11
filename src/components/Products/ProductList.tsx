import {memo, useCallback, useContext, useState} from "react";

import {Grid, Typography} from "@mui/material";

import {ProductCart, ProductWithCategories} from "../../types/product";
import ProductItem from "./ProductItem";
import {CartContext} from "../../context/CartContext";
import {LocalStorageValue} from "../../types/localStorage";

type ProductListProps = {
    products: ProductWithCategories[];
    query: string;
    sortParam: string;
}

function ProductList({products, query, sortParam}: ProductListProps) {
    const [watchList, setWatchList] = useState<number>(0);
    const [cartProducts, setCartProducts] = useContext(CartContext);

    const handleAddToWatchList = useCallback(function () {
        setWatchList((prevState) => prevState + 1);
    }, []);

    const handleAddToCart = useCallback(function (product: ProductCart) {
        setCartProducts((prevState: LocalStorageValue<ProductCart[]> | undefined): LocalStorageValue<ProductCart[]> => {
            if (prevState === undefined) {
                return [];
            }

            const cartProduct: ProductCart | undefined = prevState
                .find((cartProduct) => cartProduct.id === product.id);

            if (cartProduct === undefined) {
                return [...prevState, product];
            }

            cartProduct.quantity += 1;
            return [...prevState];
        });


    }, [setCartProducts]);

    return (
        <>
            <Grid item xs={12}>
                <Typography>
                    Watched products: {watchList}
                </Typography>
            </Grid>
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
                    <ProductItem
                        product={product}
                        key={product.id}
                        handleAddToWatchList={handleAddToWatchList}
                        handleAddToCart={handleAddToCart}/>
                ))
            }
        </>
    );
}

const ProductListMemoized = memo(ProductList);

export default ProductListMemoized;
