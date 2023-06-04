import {useFormik} from 'formik';
import Grid from '@mui/material/Unstable_Grid2';
import {
    Alert,
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import DropInput from '../DropInput/DropInput';
import {useEffect, useState} from "react";
import {useNavigate, NavigateFunction} from "react-router-dom";
import {Product, ProductWithId} from "../../types/product";
import {Category, CategoryApi, Subcategory} from "../../types/category";

// [{id, category, subcategory: [{id, name}]}]

async function getKind<T>(endpoint: string): Promise<T[]> {
    const response = await fetch(`/api/v1/${endpoint}`);

    return response.json();
}

async function getCategoriesWithSubcategories(): Promise<Category[]> {

    const response: [CategoryApi[], Subcategory[]] = await Promise.all([
        getKind<CategoryApi>('categories'),
        getKind<Subcategory>('subcategories')]);

    const [categories, subcategories] = response;

    return categories.map((category) => ({
        ...category,
        subcategories: category.subcategories
            .map((subcategoryId) => subcategories
                .find((subcategory) => subcategory.id === subcategoryId))
    }))
}

async function addProduct(endpoint: string, product: ProductWithId): Promise<Product> {
    const response = await fetch(`/api/v1/${endpoint}`, {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(product)
    })

    return response.json();
}

function delay(timer: number, fn: NavigateFunction, arg: string): Promise<number> {
    return new Promise((resolve) => {
        const interval = window.setTimeout(() => {
            fn(arg);
        }, timer)
        resolve(interval);
    })
}

function ProductForm() {

    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

    const [isMessage, setIsMessage] = useState(false);
    const [productId, setProductId] = useState<number | undefined>(undefined);

    const navigate = useNavigate();

    useEffect(() => {
        getCategoriesWithSubcategories().then(setCategories);
    }, [])

    useEffect(() => {
        let intervalId: number | undefined;

        if (isMessage) {
            delay(5000, navigate, `/products/${productId}`)
                .then((interval) => {
                    intervalId = interval;
                })
        }
        return () => {
            clearInterval(intervalId);
        }
    },[isMessage, navigate, productId])

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            price: 0,
            image: '',
            stockCount: 0,
            barcode: '',
            category: 0,
            subcategory: 0
        },
        onSubmit: async (values) => {
            const product = await addProduct('products', values);
            setIsMessage(true);
            setProductId(product.id)
        },
    });

    function updateSubcategories(selectedCategory: number) {
        if (selectedCategory === 0) {
            setSubcategories([]);
        }

        const selectedCategoryObj = categories
            .find((category) => category.id === selectedCategory);

        if (selectedCategoryObj !== undefined) {
            const subcategoriesFiltered = selectedCategoryObj.subcategories.filter(Boolean) as Subcategory[];
            setSubcategories(subcategoriesFiltered);
        }


    }

    return (
        <Box sx={{my: '20px'}}>
            {isMessage && (
                <Alert severity="success" sx={{mb: '20px'}}>Product has been added.</Alert>
            )}
            <form onSubmit={formik.handleSubmit}>
                <Grid spacing={2} container>
                    <Grid xs={12}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            id="name"
                            label="Name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            id="description"
                            label="Description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            multiline
                        />
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            id="price"
                            label="Price"
                            type="number"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <DropInput/>
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            id="stockCount"
                            label="Stock Count"
                            type="number"
                            value={formik.values.stockCount}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            id="barcode"
                            label="Bar code"
                            value={formik.values.barcode}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="categoryLbl">Category</InputLabel>
                            <Select
                                labelId="categoryLbl"
                                id="category"
                                name="category"
                                value={formik.values.category}
                                label="Category"
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    updateSubcategories(e.target.value);
                                    formik.values.subcategory = 0;
                                }}
                            >
                                <MenuItem value={0}>---</MenuItem>
                                {categories.map((category) => (
                                    <MenuItem
                                        value={category.id}
                                        key={category.id}
                                    >
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="subcategoryLbl">
                                Sub Category
                            </InputLabel>
                            <Select
                                labelId="subcategoryLbl"
                                id="subcategory"
                                name="subcategory"
                                value={formik.values.subcategory}
                                label="Sub Category"
                                onChange={formik.handleChange}
                                disabled={!subcategories.length}
                            >
                                <MenuItem value={0}>---</MenuItem>
                                {subcategories.map((subcategory) => (
                                    <MenuItem
                                        value={subcategory.id}
                                        key={subcategory.id}
                                    >
                                        {subcategory.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid xs={12}>
                        <Button variant="contained" type="submit">
                            Add Product
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}

export default ProductForm;
