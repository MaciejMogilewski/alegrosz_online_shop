import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { CssBaseline } from '@mui/material';
import CategoriesProviders from "./components/Providers/CategoriesProviders";

function App() {
    return (
        <>
            <CssBaseline />
            <CategoriesProviders>
                <RouterProvider router={router} />
            </CategoriesProviders>
        </>
    );
}

export default App;
