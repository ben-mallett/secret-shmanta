import axios from "axios";

export const getAllProducts = async () => {
    const response = await axios.get("https://dummyjson.com/products");
    const data = await response.data;
    return data;
}

export const getProductById = async (id: number) => {
    const response = await axios.get(`https://dummyjson.com/products/${id}`);
    const data = await response.data;
    return data;
}

export const searchProducts = async (query: string) => {
    const response = await axios.get(`https://dummyjson.com/products/search?q=${query}`)
    const data = await response.data;
    return data;
}

