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

  const getTotalQuantity = () => {
    return cartItems.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    );
  };

  const renderCartItem = ({ item }) => {
    const isUpdating = updatingItemId === item.id;
    const isRemoving = removingItemId === item.id;

    return (
      <View style={styles.card}>
        <View style={styles.productHeader}>
          <View style={styles.productIcon}>
            <Text style={styles.productIconText}>P</Text>
          </View>

          <View style={styles.productInfo}>
            <Text style={styles.productName}>
              {item.Product?.name || 'Product'}
            </Text>

            <Text style={styles.price}>
              ₹{Number(item.Product?.price || 0).toFixed(2)} / unit
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.itemBottomRow}>
          <View>
            <Text style={styles.quantityLabel}>Quantity</Text>

            <View style={styles.quantityContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.quantityButton,
                  pressed && styles.pressedButton,
                  (isUpdating || isRemoving) && styles.disabledButton,
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
                style={({ pressed }) => [
                  styles.quantityButton,
                  pressed && styles.pressedButton,
                  (isUpdating || isRemoving) && styles.disabledButton,
                ]}
                onPress={() => updateQuantity(item, item.quantity + 1)}
                disabled={isUpdating || isRemoving}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.itemTotalContainer}>
            <Text style={styles.itemTotalLabel}>Item Total</Text>

            <Text style={styles.itemTotal}>
              ₹{getItemTotal(item).toFixed(2)}
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.removeButton,
            pressed && styles.removePressed,
          ]}
          onPress={() => removeItem(item)}
          disabled={isUpdating || isRemoving}
        >
          <Text style={styles.removeButtonText}>
            {isRemoving ? 'Removing...' : 'Remove item'}
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

        <Pressable style={styles.retryButton} onPress={fetchCart}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.center}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>P</Text>
        </View>

        <Text style={styles.emptyTitle}>Your cart is empty</Text>

        <Text style={styles.emptyText}>
          Add some products to your cart to continue.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Cart</Text>

          <Text style={styles.subtitle}>
            {getTotalQuantity()} {getTotalQuantity() === 1 ? 'item' : 'items'}
          </Text>
        </View>

        <View style={styles.itemBadge}>
          <Text style={styles.itemBadgeText}>{cartItems.length}</Text>
        </View>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={item => String(item.id)}
        renderItem={renderCartItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />

      <View style={styles.summary}>
        <View style={styles.summaryTop}>
          <Text style={styles.summaryLabel}>Order Total</Text>

          <Text style={styles.totalAmount}>₹{getCartTotal().toFixed(2)}</Text>
        </View>

        <Text style={styles.summaryNote}>
          {role === 'DEALER'
            ? 'Dealer payment options available at checkout'
            : 'Direct payment available at checkout'}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.checkoutButton,
            pressed && styles.checkoutPressed,
          ]}
          onPress={() =>
            navigation.navigate(
              role === 'DEALER' ? 'DealerCheckout' : 'Checkout',
            )
          }
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>

          <Text style={styles.checkoutArrow}>→</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 16,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f7f7f7',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: '#666',
  },

  error: {
    fontSize: 16,
    textAlign: 'center',
    color: '#b91c1c',
    marginBottom: 16,
  },

  retryButton: {
    backgroundColor: '#222',
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 8,
  },

  retryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  emptyIconText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#222',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },

  header: {
    paddingTop: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#171717',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#777',
  },

  itemBadge: {
    minWidth: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  itemBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  list: {
    paddingBottom: 15,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ededed',
  },

  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  productIconText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
    marginBottom: 5,
  },

  price: {
    fontSize: 14,
    color: '#666',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },

  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  quantityLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 6,
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  quantityButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  pressedButton: {
    backgroundColor: '#f0f0f0',
  },

  quantityButtonText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#222',
  },

  quantityText: {
    minWidth: 38,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },

  itemTotalContainer: {
    alignItems: 'flex-end',
  },

  itemTotalLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },

  itemTotal: {
    fontSize: 17,
    fontWeight: '800',
    color: '#222',
  },

  removeButton: {
    marginTop: 15,
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },

  removePressed: {
    opacity: 0.6,
  },

  removeButtonText: {
    color: '#d32f2f',
    fontSize: 14,
    fontWeight: '600',
  },

  disabledButton: {
    opacity: 0.5,
  },

  summary: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    marginHorizontal: -16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },

  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  summaryLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#444',
  },

  totalAmount: {
    fontSize: 23,
    fontWeight: '800',
    color: '#111',
  },

  summaryNote: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
    marginBottom: 13,
  },

  checkoutButton: {
    backgroundColor: '#222',
    minHeight: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  checkoutPressed: {
    opacity: 0.85,
  },

  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  checkoutArrow: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 10,
  },
});

export default CartScreen;
