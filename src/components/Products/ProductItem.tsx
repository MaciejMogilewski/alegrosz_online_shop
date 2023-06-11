import {memo} from "react";
import {Link} from "react-router-dom";

import {faker} from "@faker-js/faker";
import {Button, Card, CardActions, CardContent, CardMedia, Chip, Grid, Typography} from "@mui/material";

import {ProductWithCart} from "../../types/product";

type ProductItemProps = {
    product: ProductWithCart;
    handleAddToWatchList: () => void;
    handleAddToCart: (product) => void;
}

function ProductItem({product, handleAddToWatchList, handleAddToCart}: ProductItemProps) {

    function addToCartQuick() {
        handleAddToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    console.log('magic')

    function cancelProduct() {
        // const updatedCart: ProductCart[] = [];
        //
        // for (const cartProduct of cartProducts || []) {
        //     if (cartProduct.id !== product.id) {
        //         updatedCart.push(cartProduct);
        //     } else {
        //         if (cartProduct.quantity > 1) {
        //             cartProduct.quantity -= 1;
        //             updatedCart.push(cartProduct);
        //         }
        //     }
        // }
        //
        // setCartProducts(updatedCart);
    }

    return (
        <Grid item xs={4}>
            <Card sx={{maxWidth: 345}}>
                <CardMedia
                    sx={{height: 140}}
                    image={faker.image.urlLoremFlickr({
                        category: "technics",
                    })}
                    title={product.name}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {product.name}
                    </Typography>
                    <Chip label={`$${product.price}`} variant="filled"/>
                </CardContent>
                <CardContent>
                    <Chip label={product.category?.name} variant="outlined" sx={{mr: 1}}/>
                    <Chip label={product.subcategory?.name} variant="outlined"/>
                </CardContent>
                <CardActions style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Link to={`/products/${product.id}`}>
                        <Button variant='contained' size="small" sx={{mr: 1}}>More info</Button>
                    </Link>
                    <Button variant='contained' color='success' size='small' onClick={addToCartQuick}>
                        Quick buy!
                    </Button>
                    <Button variant='contained' color='secondary' size='small' onClick={handleAddToWatchList}>
                        Add to Watch List
                    </Button>
                    {product.isInCart && (
                        <Button variant='contained' color='warning' onClick={cancelProduct}>
                            Undo
                        </Button>
                    )}
                </CardActions>
            </Card>
        </Grid>
    );
}

const ProductItemMemoized = memo(ProductItem);

export default ProductItemMemoized;
