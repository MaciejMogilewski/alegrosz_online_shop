import {useParams, useNavigate} from "react-router-dom";
import {Product, ProductCart, ProductWithCategoriesAndSubcategories} from "../../types/product";
import {ChangeEvent, useContext, useEffect, useState} from "react";
import {Loader} from "../Feedback/Loader";
import {Box, Button, Card, CardMedia, Grid, Paper, TextField, Typography} from "@mui/material";
import {faker} from "@faker-js/faker";
import CategoriesContext from "../../context/CategoriesContext";
import {Category} from "../../types/category";
import {CartContext} from "../../context/CartContext";

async function getProduct(endpoint: string, signal: AbortSignal): Promise<Product> {
    const response = await fetch(`/api/v1/${endpoint}`, {signal});

    return response.json();
}

function addCategoryNamesToProduct(product: Product, categories: Category[] | null): ProductWithCategoriesAndSubcategories {
    const category = categories ? categories
        .find((category) => category.id === product.category) : undefined;

    if (category === undefined) {
        throw new Error(`Cannot find category with id: ${product.category}`)
    }

    return {
        ...product,
        category,
        subcategory: category.subcategories
            .find((subcategory) => product.subcategory === subcategory?.id)
    }
}

async function deleteProduct(endpoint: string): Promise<Record<string, never>> {
    const response = await fetch(`/api/v1/${endpoint}`, {
        method: "DELETE"
    });

    return response.json();
}

function ProductDetails() {
    const {id} = useParams();
    const [product, setProduct] = useState<ProductWithCategoriesAndSubcategories | null>(null);
    const categories = useContext(CategoriesContext);
    const [cartProducts, setCartProducts] = useContext(CartContext);

    const [quantity, setQuantity] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController()

        if (id !== undefined && categories) {
            getProduct(`products/${id}`, controller.signal).then(
                (product) => {
                    setProduct(addCategoryNamesToProduct(product, categories));
                }
            );
        }

        return () => {
            controller.abort();
        }

    }, [categories, id]);

    async function handleDelete() {
        await deleteProduct(`products/${id}`);
        navigate(`/`, {
            state: {
                productName: product?.name as string,
                deleted: true
            }
        });
    }

    function addToCart() {
        if (!product) {
            throw new Error('Product not found')
        }

        let cartProduct: ProductCart | undefined = cartProducts.find((cartProduct) => cartProduct.id === product.id);

        if (cartProduct === undefined) {
            cartProduct = {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity
            } as ProductCart

            setCartProducts([...cartProducts, cartProduct])

        } else {
            cartProduct.quantity += quantity;

            setCartProducts([...cartProducts])
        }
    }

    if (!product) {
        return (
            <Loader/>
        )
    }

    return (
        <Box sx={{my: '20px'}}>
            <Grid spacing={2} container>
                <Grid item xs={12}>
                    <Typography variant="h1" gutterBottom>
                        {product.name}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        {product.category?.name}/{product.subcategory?.name}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Card sx={{maxWidth: 645}}>
                                <CardMedia
                                    sx={{height: 440}}
                                    image={faker.image.urlLoremFlickr({
                                        category: "technics",
                                    })}
                                    title={product.name}
                                />
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper
                                elevation={1}
                                style={{
                                    padding: 10,
                                    marginBottom: 5
                                }}>
                                <Typography variant="body1">
                                    {product.description}
                                </Typography>
                            </Paper>
                            <Paper
                                elevation={1}
                                style={{
                                    padding: 10,
                                    display: 'flex',
                                    gap: 15,
                                    marginBottom: 30
                                }}>
                                <Typography variant="h4">
                                    Price: ${product.price}
                                </Typography>
                                <TextField
                                    id='quantity'
                                    type='number'
                                    label='Quantity'
                                    value={quantity}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setQuantity(+e.target.value)}
                                />
                                <Button variant='contained' onClick={addToCart}>
                                    Buy now!
                                </Button>
                            </Paper>
                            <Paper style={{display: "flex", gap: 10, padding: 10}}>
                                <Button variant="contained">
                                    Edit
                                </Button>
                                <Button variant="contained" color="error" onClick={handleDelete}>
                                    Delete
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ProductDetails;
