import React, { useState, Fragment } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { placeOrder, getImageUrl } from '../utils/api';

export default function CartScreen({ cartItems, setCartItems }) {
    const [complete, setComplete] = useState(false);

    function increaseQty(item) {
        if (item.product.stock === item.qty) return;
        const updatedItems = cartItems.map((i) => {
            if (i.product._id === item.product._id) {
                i.qty++;
            }
            return i;
        });
        setCartItems([...updatedItems]);
    }

    function decreaseQty(item) {
        if (item.qty > 1) {
            const updatedItems = cartItems.map((i) => {
                if (i.product._id === item.product._id) {
                    i.qty--;
                }
                return i;
            });
            setCartItems([...updatedItems]);
        }
    }

    function removeItem(item) {
        const updatedItems = cartItems.filter((i) => i.product._id !== item.product._id);
        setCartItems(updatedItems);
    }

    async function placeOrderHandler() {
        const res = await placeOrder(cartItems);
        if (res.success) {
            setCartItems([]);
            setComplete(true);
            alert("Order Success!");
        }
    }

    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image 
                source={{ uri: getImageUrl(item.product.images[0].image) }} 
                style={styles.itemImage}
                resizeMode="contain"
            />
            <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
                <Text style={styles.itemPrice}>${item.product.price}</Text>
                
                <View style={styles.qtyRow}>
                    <View style={styles.qtyContainer}>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => decreaseQty(item)}>
                            <Text style={styles.qtyBtnText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.qty}</Text>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => increaseQty(item)}>
                            <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity onPress={() => removeItem(item)}>
                        <Trash2 color="#d9534f" size={24} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    if (complete) {
        return (
            <View style={styles.center}>
                <Text style={styles.completeTitle}>Order Complete!</Text>
                <Text style={styles.completeText}>Your order has been placed successfully.</Text>
                <TouchableOpacity style={styles.homeBtn} onPress={() => setComplete(false)}>
                    <Text style={styles.homeBtnText}>Back to Shopping</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {cartItems.length > 0 ? (
                <Fragment>
                    <FlatList
                        data={cartItems}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.product._id}
                        ListHeaderComponent={<Text style={styles.title}>Your Cart: {cartItems.length} items</Text>}
                    />
                    
                    <View style={styles.summary}>
                        <Text style={styles.summaryTitle}>Order Summary</Text>
                        <View style={styles.summaryRow}>
                            <Text>Subtotal:</Text>
                            <Text>{cartItems.reduce((acc, item) => acc + item.qty, 0)} Units</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Est. total:</Text>
                            <Text style={styles.totalValue}>
                                ${cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0).toFixed(2)}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.checkoutBtn} onPress={placeOrderHandler}>
                            <Text style={styles.checkoutBtnText}>Place Order</Text>
                        </TouchableOpacity>
                    </View>
                </Fragment>
            ) : (
                <View style={styles.center}>
                    <Text style={styles.emptyText}>Your Cart is Empty!</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 20,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginBottom: 10,
        padding: 15,
        borderRadius: 8,
        elevation: 2,
    },
    itemImage: {
        width: 80,
        height: 80,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'space-between',
    },
    itemName: {
        fontSize: 16,
        fontWeight: '500',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#b12704',
    },
    qtyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    qtyBtn: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        backgroundColor: '#eee',
    },
    qtyBtnText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    qtyText: {
        paddingHorizontal: 15,
        fontSize: 16,
    },
    summary: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        elevation: 10,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#b12704',
    },
    checkoutBtn: {
        backgroundColor: '#febd69',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginTop: 10,
    },
    checkoutBtnText: {
        color: '#232f3e',
        fontSize: 18,
        fontWeight: 'bold',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 20,
        color: '#666',
    },
    completeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'green',
        marginBottom: 10,
    },
    completeText: {
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 40,
        marginBottom: 30,
    },
    homeBtn: {
        backgroundColor: '#232f3e',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    homeBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
