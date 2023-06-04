import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {Alert} from "@mui/material";
import {useLocation} from "react-router-dom"
import {useState} from "react";

function HomePage() {
    const location = useLocation();
    const [msg, setMsg] = useState<boolean | undefined>(location.state?.deleted);

    return (
        <Box sx={{my: '20px'}}>
            <Grid spacing={2} container>
                <Grid item xs={12}>
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
            </Grid>
        </Box>
    );
}

export default HomePage;
