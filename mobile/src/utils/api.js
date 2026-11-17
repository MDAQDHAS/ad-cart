const BASE_URL = 'http://10.246.211.80:8000/api/v1';

export const getProducts = async (searchParams = '') => {
    try {
        const response = await fetch(`${BASE_URL}/products?${searchParams}`);
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

export const getSingleProduct = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/product/${id}`);
        const data = await response.json();
        return data.product;
    } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
    }
};

export const placeOrder = async (cartItems) => {
    try {
        const response = await fetch(`${BASE_URL}/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cartItems)
        });
        return await response.json();
    } catch (error) {
        console.error('Error placing order:', error);
        return { success: false };
    }
};

export const getImageUrl = (imagePath) => {
    // Ensuring the image path starts with a slash
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `http://10.246.211.80:8000${path}`;
};
