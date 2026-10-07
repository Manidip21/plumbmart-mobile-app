import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import api from '../config/api';

function CartScreen({ navigation }) {
  const role = useSelector(state => state.auth.user?.role);

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);
  const [error, setError] = useState('');

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/api/cart');

      console.log('CART RESPONSE:', response.data);

      setCartItems(response.data.cart?.CartItems || []);
    } catch (err) {
      console.log('CART ERROR:', err.response?.data || err.message);

      setError(err.response?.data?.message || 'Unable to load cart.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, []),
  );

  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }

    try {
      setUpdatingItemId(item.id);

      const response = await api.put(`/api/cart/items/${item.id}`, {
        quantity: newQuantity,
      });

      console.log('UPDATE CART RESPONSE:', response.data);

      await fetchCart();
    } catch (err) {
      console.log('UPDATE CART ERROR:', err.response?.data || err.message);

      Alert.alert(
        'Unable to Update',
        err.response?.data?.message || 'Unable to update cart quantity.',
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  const removeItem = async item => {
    try {
      setRemovingItemId(item.id);

      const response = await api.delete(`/api/cart/items/${item.id}`);

      console.log('REMOVE CART RESPONSE:', response.data);

      await fetchCart();
    } catch (err) {
      console.log('REMOVE CART ERROR:', err.response?.data || err.message);

      Alert.alert(
        'Unable to Remove',
        err.response?.data?.message || 'Unable to remove product from cart.',
      );
    } finally {
      setRemovingItemId(null);
    }
  };

  const getItemTotal = item => {
    return Number(item.Product?.price || 0) * item.quantity;
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + getItemTotal(item), 0);
  };

  const renderCartItem = ({ item }) => {
    const isUpdating = updatingItemId === item.id;
    const isRemoving = removingItemId === item.id;

    return (
      <View style={styles.card}>
        <Text style={styles.productName}>
          {item.Product?.name || 'Product'}
        </Text>

        <Text style={styles.price}>₹{item.Product?.price || '0.00'}</Text>

        <View style={styles.itemBottomRow}>
          <View style={styles.quantityContainer}>
            <Pressable
              style={[
                styles.quantityButton,
                isUpdating && styles.disabledButton,
              ]}
              onPress={() => updateQuantity(item, item.quantity - 1)}
              disabled={isUpdating || isRemoving}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </Pressable>

            <Text style={styles.quantityText}>
              {isUpdating ? '...' : item.quantity}
            </Text>

            <Pressable
              style={[
                styles.quantityButton,
                isUpdating && styles.disabledButton,
              ]}
              onPress={() => updateQuantity(item, item.quantity + 1)}
              disabled={isUpdating || isRemoving}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </Pressable>
          </View>

          <Text style={styles.itemTotal}>₹{getItemTotal(item).toFixed(2)}</Text>
        </View>

        <Pressable
          style={styles.removeButton}
          onPress={() => removeItem(item)}
          disabled={isUpdating || isRemoving}
        >
          <Text style={styles.removeButtonText}>
            {isRemoving ? 'Removing...' : 'Remove'}
          </Text>
        </Pressable>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading cart...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>

        <Text style={styles.emptyText}>
          Add some products to your cart to continue.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cart</Text>

      <FlatList
        data={cartItems}
        keyExtractor={item => String(item.id)}
        renderItem={renderCartItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />

      <View style={styles.summary}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>

          <Text style={styles.totalAmount}>₹{getCartTotal().toFixed(2)}</Text>
        </View>

        <Pressable
          style={styles.checkoutButton}
          onPress={() =>
            navigation.navigate(
              role === 'DEALER' ? 'DealerCheckout' : 'Checkout',
            )
          }
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },

  error: {
    fontSize: 16,
    textAlign: 'center',
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 15,
  },

  list: {
    paddingBottom: 15,
  },

  card: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  productName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },

  price: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },

  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  quantityButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  quantityButtonText: {
    fontSize: 22,
    fontWeight: '600',
  },

  quantityText: {
    fontSize: 17,
    fontWeight: '600',
    marginHorizontal: 15,
  },

  itemTotal: {
    fontSize: 17,
    fontWeight: '700',
  },

  removeButton: {
    marginTop: 15,
    alignSelf: 'flex-start',
  },

  removeButtonText: {
    color: '#d32f2f',
    fontSize: 15,
    fontWeight: '600',
  },

  disabledButton: {
    opacity: 0.5,
  },

  summary: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 15,
    paddingBottom: 5,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },

  totalAmount: {
    fontSize: 22,
    fontWeight: '700',
  },

  checkoutButton: {
    backgroundColor: '#222',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  checkoutButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default CartScreen;
