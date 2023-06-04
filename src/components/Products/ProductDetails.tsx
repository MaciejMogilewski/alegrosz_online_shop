import {useParams, useNavigate} from "react-router-dom";
import {Product} from "../../types/product";
import {useEffect, useState} from "react";
import {Loader} from "../Feedback/Loader";
import {Button} from "@mui/material";

async function getProduct(endpoint: string, signal: AbortSignal): Promise<Product> {
    const response = await fetch(`/api/v1/${endpoint}`, {signal});

    return response.json();
}

async function deleteProduct(endpoint: string): Promise<Record<string, never>> {
    const response = await fetch(`/api/v1/${endpoint}`, {
        method: "DELETE"
    });

    return response.json();
}

function ProductDetails() {
    const {id} = useParams();
    const [product, setProduct] = useState<Product | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController()

        if (id !== undefined) {
            getProduct(`products/${id}`, controller.signal).then(setProduct);
        } else {
            // TODO create error boundary for this component
            throw new Error(`Invalid query params id: ${id}`);
        }

        return () => {
            controller.abort();
        }


    }, [id]);

    async function handleDelete() {
        await deleteProduct(`products/${id}`);
        navigate(`/`, {
            state: {
                productName: product?.name as string,
                deleted: true
            }
        });
    }

    if (!product) {
        return (
            <Loader/>
        )
    }

    return (
        <div>
            Product: {product.name}
            <Button variant="outlined" color="error" onClick={handleDelete}>
                Delete
            </Button>
        </div>
    )
}

export default ProductDetails;
