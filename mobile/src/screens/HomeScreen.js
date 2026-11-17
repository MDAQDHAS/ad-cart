import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function HomeScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            setProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#febd69" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Latest Products</Text>
            <FlatList
                data={products}
                renderItem={({ item }) => (
                    <ProductCard 
                        product={item} 
                        onPress={() => navigation.navigate('ProductDetail', { id: item._id })}
                    />
                )}
                keyExtractor={(item) => item._id}
                numColumns={2}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 15,
        color: '#232f3e',
    },
    list: {
        padding: 8,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
