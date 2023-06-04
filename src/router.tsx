import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProductForm from './components/Products/ProductForm';
import ProductDetails from "./components/Products/ProductDetails";
import HomePage from "./components/HomePage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/contact',
                element: <h1>Contact</h1>,
            },
            {
                path: '/add-product',
                element: <ProductForm />,
            },
            {
                path: '/products/:id',
                element: <ProductDetails />,
            }
        ],
    },
    {
        path: '/register',
        element: <h1>Register</h1>,
    },
]);
