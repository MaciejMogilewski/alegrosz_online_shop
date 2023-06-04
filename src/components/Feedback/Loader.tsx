import {CircularProgress} from "@mui/material";

export function Loader() {
    return <div style={{display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh"}}>
        <CircularProgress />
    </div>;
}
