import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from './src/components/Header';
import HomeScreen from './src/screens/HomeScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [cartItems, setCartItems] = useState([]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            header: (props) => (
              <SafeAreaView edges={['top']} style={{ backgroundColor: '#232f3e' }}>
                <Header 
                  cartCount={cartItems.length} 
                  onCartPress={() => props.navigation.navigate('Cart')}
                />
              </SafeAreaView>
            ),
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ProductDetail">
            {(props) => (
              <ProductDetailScreen 
                {...props} 
                cartItems={cartItems} 
                setCartItems={setCartItems} 
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Cart">
            {(props) => (
              <CartScreen 
                {...props} 
                cartItems={cartItems} 
                setCartItems={setCartItems} 
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
