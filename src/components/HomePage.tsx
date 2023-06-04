import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {
    Alert,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    FormControl,
    InputLabel, MenuItem, Select,
    Typography
} from "@mui/material";
import {useLocation} from "react-router-dom"
import {useEffect, useState} from "react";
import {Product, ProductWithCategories} from "../types/product";
import {ApiType} from "../types/api";
import {CategoryApi, Subcategory} from "../types/category";
import {Search} from "./Inputs/Search";
import ProductList from "./Products/ProductList";


async function getData<T>(
    {
        endpoint,
        signal
    }: ApiType
): Promise<T[]> {
    const init: { signal?: AbortSignal } = {};

    if (signal !== undefined) {
        init.signal = signal
    }

    const response = await fetch(`/api/v1/${endpoint}`, init)

    return response.json();
}

async function getProductsWithCategories(signal: AbortSignal): Promise<ProductWithCategories[]> {
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

function HomePage() {
    const [products, setProducts] = useState<ProductWithCategories[]>([]);
    const [query, setQuery] = useState('');
    const [sortParam, setSortParam] = useState<string>('');
    const location = useLocation();
    const [msg, setMsg] = useState<boolean | undefined>(location.state?.deleted);

    useEffect(() => {

        const controller = new AbortController();
        getProductsWithCategories(controller.signal).then(setProducts);

        return () => {
            controller.abort();
        }
    }, [])

    // TODO create loader

    function handleSortPrice(e) {
        setSortParam(e.target.value);
    }

    return (
        <Box sx={{my: '20px'}}>
            <Grid spacing={2} container>
                <Grid item xs={12}>
                    {/* TODO doesn't disappear on reload */}
                    {msg && (
                        <Alert
                            severity="success"
                            onClose={() => {
                                setMsg(false);
                            }}
                            sx={{mb: '20px'}}
                        >
                            Product: {location.state.productName} has been delete.
                        </Alert>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <Search value={query} setQuery={setQuery}/>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth sx={{mb: 4}}>
                        <InputLabel id="priceSortingLabel">Sort by price</InputLabel>
                        <Select
                            labelId="priceSortingLabel"
                            id="priceSorting"
                            value={sortParam}
                            label="Sort by price"
                            onChange={handleSortPrice}
                        >
                            <MenuItem value={''}>---</MenuItem>
                            <MenuItem value={'asc'}>Ascending</MenuItem>
                            <MenuItem value={'degitsc'}>Descending</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item container spacing={2}>
                    <ProductList products={products} query={query} sortParam={sortParam}/>
                </Grid>
            </Grid>
        </Box>
    );
}

export default HomePage;
