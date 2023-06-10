import {faker} from "@faker-js/faker";
import {Button, Card, CardActions, CardContent, CardMedia, Chip, Grid, Typography} from "@mui/material";
import {ProductCart, ProductWithCategories} from "../../types/product";
import {Link} from "react-router-dom";
import {useContext} from "react";
import {CartContext} from "../../context/CartContext";

type ProductItemProps = {
    product: ProductWithCategories
}

function ProductItem({product}: ProductItemProps) {
    const [cartProducts, setCartProducts] = useContext(CartContext);

    function addToCartQuick() {
        let cartProduct: ProductCart | undefined = cartProducts.find((cartProduct) => cartProduct.id === product.id);

        if (cartProduct === undefined) {
            cartProduct = {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            } as ProductCart

            setCartProducts([...cartProducts, cartProduct])

        } else {
            cartProduct.quantity += 1;

            setCartProducts([...cartProducts])
        }
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
                        <Button variant='contained' size="small">More info</Button>
                    </Link>
                    <Button variant='contained' color='success' size='small' onClick={addToCartQuick}>
                        Quick buy!
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
}

export default ProductItem;
