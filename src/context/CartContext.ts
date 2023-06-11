import {createContext, Dispatch, SetStateAction} from "react";
import {ProductCart} from "../types/product";
import {LocalStorageValue} from "../types/localStorage";

export const CartContext = createContext<[LocalStorageValue<ProductCart[]>, Dispatch<SetStateAction<LocalStorageValue<ProductCart[]>>>]>([
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
