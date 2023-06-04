import {TextField} from "@mui/material";
import {Dispatch, SetStateAction} from "react";

type SearchProps = {
    value: string;
    setQuery: Dispatch<SetStateAction<string>>
}

export function Search({value, setQuery}: SearchProps) {
    return <TextField
        id="search"
        label="Search"
        variant="outlined"
        fullWidth
        value={value}
        onChange={(e) => setQuery(e.target.value)}
        sx={{mb: 2}}
    />;
}
