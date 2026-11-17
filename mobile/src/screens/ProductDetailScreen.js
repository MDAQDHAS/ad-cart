import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getSingleProduct, getImageUrl } from '../utils/api';

export default function ProductDetailScreen({ route, navigation, cartItems, setCartItems }) {
    const { id } = route.params;
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getSingleProduct(id);
            setProduct(data);
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    function addToCart() {
        const itemExist = cartItems.find((item) => item.product._id === product._id);
        if (!itemExist) {
            const newItem = { product, qty };
            setCartItems([...cartItems, newItem]);
            alert("Cart Item added successfully!");
        } else {
            alert("Item already in cart!");
        }
    }

    function increaseQty() {
        if (product.stock > qty) {
            setQty(qty + 1);
        }
    }

    function decreaseQty() {
        if (qty > 1) {
            setQty(qty - 1);
        }
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#febd69" />
            </View>
        );
    }

    if (!product) return null;

    return (
        <ScrollView style={styles.container}>
            <Image 
                source={{ uri: getImageUrl(product.images[0].image) }} 
                style={styles.image}
                resizeMode="contain"
            />
            
            <View style={styles.details}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.productId}>Product #{product._id}</Text>
                
                <View style={styles.divider} />
                
                <View style={styles.ratingOuter}>
                    <View style={[styles.ratingInner, { width: `${(product.ratings / 5) * 100}%` }]} />
                </View>
                
                <View style={styles.divider} />
                
                <Text style={styles.price}>${product.price}</Text>
                
                <View style={styles.qtyContainer}>
                    <TouchableOpacity style={[styles.qtyBtn, styles.minus]} onPress={decreaseQty}>
                        <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.qtyInput}>
                        <Text style={styles.qtyText}>{qty}</Text>
                    </View>
                    
                    <TouchableOpacity style={[styles.qtyBtn, styles.plus]} onPress={increaseQty}>
                        <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.cartBtn, product.stock === 0 && styles.disabledBtn]} 
                        onPress={addToCart}
                        disabled={product.stock === 0}
                    >
                        <Text style={styles.cartBtnText}>Add to Cart</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.divider} />
                
                <Text style={styles.status}>
                    Status: <Text style={product.stock > 0 ? styles.inStock : styles.outStock}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </Text>
                </Text>
                
                <View style={styles.divider} />
                
                <Text style={styles.sectionTitle}>Description:</Text>
                <Text style={styles.description}>{product.description}</Text>
                
                <View style={styles.divider} />
                
                <Text style={styles.seller}>Sold by: <Text style={styles.sellerName}>{product.seller}</Text></Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 350,
        backgroundColor: '#fff',
    },
    details: {
        padding: 20,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#232f3e',
        marginBottom: 5,
    },
    productId: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 15,
    },
    ratingOuter: {
        width: 100,
        height: 20,
        backgroundColor: '#eee',
        borderRadius: 4,
    },
    ratingInner: {
        height: '100%',
        backgroundColor: '#febd69',
        borderRadius: 4,
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#b12704',
        marginBottom: 20,
    },
    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qtyBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    minus: {
        backgroundColor: '#d9534f',
    },
    plus: {
        backgroundColor: '#0275d8',
    },
    qtyBtnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    qtyInput: {
        width: 60,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        marginHorizontal: 10,
        borderRadius: 4,
    },
    qtyText: {
        fontSize: 18,
    },
    cartBtn: {
        flex: 1,
        backgroundColor: '#febd69',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginLeft: 20,
    },
    cartBtnText: {
        color: '#232f3e',
        fontWeight: 'bold',
        fontSize: 16,
    },
    disabledBtn: {
        backgroundColor: '#ccc',
    },
    status: {
        fontSize: 16,
    },
    inStock: {
        color: 'green',
        fontWeight: 'bold',
    },
    outStock: {
        color: 'red',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
    },
    seller: {
        fontSize: 14,
    },
    sellerName: {
        fontWeight: 'bold',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
