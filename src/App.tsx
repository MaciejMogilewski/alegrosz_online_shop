import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { CssBaseline } from '@mui/material';
import CategoriesProviders from "./components/Providers/CategoriesProviders";
import CartProvider from "./components/Providers/CartProvider";

function App() {
    return (
        <>
            <CssBaseline />
            <CartProvider>
                <CategoriesProviders>
                    <RouterProvider router={router} />
                </CategoriesProviders>
            </CartProvider>
        </>
    );
}

export default App;
