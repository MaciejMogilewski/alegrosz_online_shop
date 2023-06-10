import {createContext} from "react";
import {ProductCart} from "../types/product";

export const CartContext = createContext<[ProductCart[], (products: ProductCart[]) => void]>([
    [
        {
            id: 1,
            name: 'MacBook Air',
            price: 666,
            quantity: 4
        }
    ],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {}
]);
