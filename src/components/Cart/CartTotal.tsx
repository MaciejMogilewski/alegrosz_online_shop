import {useContext} from "react";

import {Box, Button, Typography} from "@mui/material";

import {CartContext} from "../../context/CartContext";
import {ProductCart} from "../../types/product";

function CartTotal() {
    const [cartProducts, setCartProducts] = useContext(CartContext);

    function clearCart() {
        setCartProducts([]);
    }

    function calculateTotal(products: ProductCart[]): string {
        return products.reduce((acc, ce) => acc + ce.price * ce.quantity, 0).toFixed(2)
    }

    return (
        <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 3, alignItems: 'center'}}>
            <Typography variant='subtitle2'>
                {cartProducts && cartProducts.length > 0
                    ? `Total cost: $${calculateTotal(cartProducts)}`
                    : 'Your cart is empty'}
            </Typography>
            {cartProducts && cartProducts.length > 0 && (
                <Button variant='contained' color='error' size='small' onClick={clearCart}>
                    Clear
                </Button>
            )}
        </Box>
    );
}

export default CartTotal;
