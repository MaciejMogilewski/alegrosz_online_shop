import {memo, useContext, useEffect, useState} from "react";
import {useLocation, useSearchParams} from "react-router-dom"

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {Alert, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";

import {Search} from "./Inputs/Search";
import ProductList from "./Products/ProductList";
import CategoriesContext from "../context/CategoriesContext";

function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [query, setQuery] = useState('');
    const [category, setCategory] = useState<string>(searchParams.get('categories') || '');
    const [sortParam, setSortParam] = useState<string>(searchParams.get('sortBy') || '');

    const location = useLocation();
    const [msg, setMsg] = useState<boolean | undefined>(location.state?.deleted);
    const categories = useContext(CategoriesContext);

    useEffect(() => {
        // TODO create query params for search products
        const queryParams: { sortBy?: string } = {};

        if (sortParam) {
            queryParams.sortBy = sortParam
        }

        setSearchParams(queryParams);

    }, [setSearchParams, sortParam])

    // TODO create loader
    function handleSortPrice(e: SelectChangeEvent) {
        setSortParam(e.target.value);
    }

    function handleFilterCategory(e: SelectChangeEvent) {
        setCategory(e.target.value);
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
                            <MenuItem value={'desc'}>Descending</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth sx={{mb: 4}}>
                        <InputLabel id="categoriesLabel">Filter by category</InputLabel>
                        <Select
                            labelId="categoriesLabel"
                            id="categories"
                            value={category}
                            label="Choose category"
                            onChange={handleFilterCategory}
                        >
                            <MenuItem value={''}>---</MenuItem>
                            {categories && categories.map(({name, id}) => (
                                <MenuItem value={name} key={id}>{name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item container spacing={2}>
                    <ProductList query={query} sortParam={sortParam} category={category} setCategory={setCategory}/>
                </Grid>
            </Grid>
        </Box>
    );
}

const HomePageMemoized = memo(HomePage)

export default HomePageMemoized;
