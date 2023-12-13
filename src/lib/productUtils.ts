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

export const getDailyProducts = async() => {
    function getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const productIds = [1, 1, 1, 1, 1].map((productId) => productId * getRandomInt(1, 99))

    const products = await Promise.all(productIds.map(async (productId) => {
        return await getProductById(productId);
    }))
    return products;
}