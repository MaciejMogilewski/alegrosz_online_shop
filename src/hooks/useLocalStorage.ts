import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {LocalStorageValue} from "../types/localStorage";

function useLocalStorage<T>(key: string, initialValue?: T): [LocalStorageValue<T>, Dispatch<SetStateAction<LocalStorageValue<T>>>] {
    const [value, setValue] = useState<LocalStorageValue<T>>(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Cannot read value from local storage: ', error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Cannot update value from local storage: ', error);
        }
    }, [key, value]);

    return [value, setValue];
}

export default useLocalStorage;
