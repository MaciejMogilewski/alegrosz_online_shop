export interface Product {
    "name": string;
    "description": string;
    "price": number;
    "image": string;
    "stockCount": number;
    "barcode": string;
    "category": number;
    "subcategory": number;
    "id": number;
}

export type ProductWithId = Omit<Product, "id">
