import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ShoppingCart, Search } from 'lucide-react-native';

export default function Header({ cartCount, onCartPress }) {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image 
                    source={{ uri: 'https://raw.githubusercontent.com/adcart/assets/main/logo.png' }} // Placeholder logo as original might not be easily accessible via local path without more setup
                    style={styles.logo}
                    defaultSource={require('../../assets/icon.png')}
                />
                <Text style={styles.logoText}>AD<Text style={styles.cartText}>CART</Text></Text>
            </View>
            
            <TouchableOpacity onPress={onCartPress} style={styles.cartButton}>
                <ShoppingCart color="#fff" size={24} />
                {cartCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{cartCount}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        backgroundColor: '#232f3e',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 30,
        height: 30,
        marginRight: 10,
        borderRadius: 5,
    },
    logoText: {
        fontSize: 20,
        color: '#febd68',
        fontWeight: 'bold',
    },
    cartText: {
        color: '#fff',
    },
    cartButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        right: -8,
        top: -8,
        backgroundColor: '#febd69',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#232f3e',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
