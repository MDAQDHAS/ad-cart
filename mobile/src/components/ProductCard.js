import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getImageUrl } from '../utils/api';

export default function ProductCard({ product, onPress }) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image 
                source={{ uri: getImageUrl(product.images[0].image) }} 
                style={styles.image}
                resizeMode="contain"
            />
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
                
                <View style={styles.ratingContainer}>
                    <View style={styles.ratingOuter}>
                        <View style={[styles.ratingInner, { width: `${(product.ratings / 5) * 100}%` }]} />
                    </View>
                </View>

                <Text style={styles.price}>${product.price}</Text>
                
                <TouchableOpacity style={styles.button} onPress={onPress}>
                    <Text style={styles.buttonText}>View Details</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        margin: 8,
        padding: 10,
        width: '46%', // For a 2-column grid
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    image: {
        width: '100%',
        height: 150,
        marginBottom: 10,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        height: 40,
        marginBottom: 5,
    },
    ratingContainer: {
        marginBottom: 5,
    },
    ratingOuter: {
        width: 60,
        height: 12,
        backgroundColor: '#eee',
        borderRadius: 2,
    },
    ratingInner: {
        height: '100%',
        backgroundColor: '#febd69',
        borderRadius: 2,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#b12704',
        marginBottom: 8,
    },
    button: {
        backgroundColor: '#febd69',
        paddingVertical: 6,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonText: {
        color: '#232f3e',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
