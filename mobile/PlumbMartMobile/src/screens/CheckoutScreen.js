import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import api from '../config/api';

function CheckoutScreen({ navigation }) {
  const user = useSelector(state => state.auth.user);
  const role = user?.role;

  const credit30Eligible = user?.credit30Eligible;
  const credit90Eligible = user?.credit90Eligible;

  const [paymentMethod, setPaymentMethod] = useState(
    role === 'DEALER' ? 'UPFRONT' : 'DIRECT_PAYMENT',
  );

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/api/cart');

      console.log('CHECKOUT CART RESPONSE:', response.data);

      setCartItems(response.data.cart?.CartItems || []);
    } catch (err) {
      console.log('CHECKOUT CART ERROR:', err.response?.data || err.message);

      setError(
        err.response?.data?.message || 'Unable to load checkout details.',
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, []),
  );

  const getItemTotal = item => {
    return Number(item.Product?.price || 0) * item.quantity;
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + getItemTotal(item), 0);
  };

  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);

      const response = await api.post('/api/orders/checkout', {
        paymentMethod,
      });

      console.log('CHECKOUT RESPONSE:', response.data);

      if (response.data.success) {
        Alert.alert(
          'Order Placed',
          `Order #${response.data.order.id} placed successfully.`,
          [
            {
              text: 'View Orders',
              onPress: () => {
                if (role === 'CUSTOMER') {
                  navigation.navigate('CustomerApp', {
                    screen: 'Orders',
                  });
                } else {
                  navigation.navigate('DealerDashboard');
                }
              },
            },
          ],
        );
      }
    } catch (err) {
      console.log('CHECKOUT ERROR:', err.response?.data || err.message);

      Alert.alert(
        'Checkout Failed',
        err.response?.data?.message || 'Unable to place your order.',
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading checkout...</Text>
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
          Add products before proceeding to checkout.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      <Text style={styles.sectionTitle}>Order Summary</Text>

      {cartItems.map(item => (
        <View key={item.id} style={styles.itemRow}>
          <View style={styles.itemInfo}>
            <Text style={styles.productName}>
              {item.Product?.name || 'Product'}
            </Text>

            <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
          </View>

          <Text style={styles.itemTotal}>₹{getItemTotal(item).toFixed(2)}</Text>
        </View>
      ))}

      <View style={styles.divider} />

      <View style={styles.paymentSection}>
        <Text style={styles.sectionTitle}>Payment Method</Text>

        {role === 'CUSTOMER' && (
          <Pressable style={styles.paymentOption}>
            <View style={styles.radioOuter}>
              <View style={styles.radioInner} />
            </View>

            <View>
              <Text style={styles.paymentTitle}>Direct Payment</Text>

              <Text style={styles.paymentDescription}>
                Pay directly for this order
              </Text>
            </View>
          </Pressable>
        )}

        {role === 'DEALER' && (
          <>
            <Pressable
              style={[
                styles.paymentOption,
                paymentMethod === 'UPFRONT' && styles.selectedPaymentOption,
              ]}
              onPress={() => setPaymentMethod('UPFRONT')}
            >
              <View style={styles.radioOuter}>
                {paymentMethod === 'UPFRONT' && (
                  <View style={styles.radioInner} />
                )}
              </View>

              <View>
                <Text style={styles.paymentTitle}>Upfront Payment</Text>

                <Text style={styles.paymentDescription}>
                  Pay the full amount upfront
                </Text>
              </View>
            </Pressable>

            {credit30Eligible && (
              <Pressable
                style={[
                  styles.paymentOption,
                  styles.paymentOptionSpacing,
                  paymentMethod === 'CREDIT_30' && styles.selectedPaymentOption,
                ]}
                onPress={() => setPaymentMethod('CREDIT_30')}
              >
                <View style={styles.radioOuter}>
                  {paymentMethod === 'CREDIT_30' && (
                    <View style={styles.radioInner} />
                  )}
                </View>

                <View>
                  <Text style={styles.paymentTitle}>30 Days Credit</Text>

                  <Text style={styles.paymentDescription}>
                    Pay within 30 days
                  </Text>
                </View>
              </Pressable>
            )}

            {credit90Eligible && (
              <Pressable
                style={[
                  styles.paymentOption,
                  styles.paymentOptionSpacing,
                  paymentMethod === 'CREDIT_90' && styles.selectedPaymentOption,
                ]}
                onPress={() => setPaymentMethod('CREDIT_90')}
              >
                <View style={styles.radioOuter}>
                  {paymentMethod === 'CREDIT_90' && (
                    <View style={styles.radioInner} />
                  )}
                </View>

                <View>
                  <Text style={styles.paymentTitle}>90 Days Credit</Text>

                  <Text style={styles.paymentDescription}>
                    Pay within 90 days
                  </Text>
                </View>
              </Pressable>
            )}
          </>
        )}
      </View>

      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>Total Amount</Text>

        <Text style={styles.totalAmount}>₹{getCartTotal().toFixed(2)}</Text>
      </View>

      <Pressable
        style={[styles.placeOrderButton, placingOrder && styles.disabledButton]}
        onPress={handlePlaceOrder}
        disabled={placingOrder}
      >
        <Text style={styles.placeOrderText}>
          {placingOrder ? 'Placing Order...' : 'Place Order'}
        </Text>
      </Pressable>
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
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },

  itemInfo: {
    flex: 1,
    paddingRight: 15,
  },

  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },

  quantity: {
    fontSize: 14,
    color: '#666',
  },

  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },

  paymentSection: {
    marginBottom: 25,
  },

  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 10,
    padding: 15,
  },

  paymentOptionSpacing: {
    marginTop: 10,
  },

  selectedPaymentOption: {
    borderWidth: 2,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#222',
  },

  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  paymentDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 3,
  },

  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 18,
    marginBottom: 20,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },

  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
  },

  placeOrderButton: {
    backgroundColor: '#222',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  placeOrderText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },

  disabledButton: {
    opacity: 0.6,
  },
});

export default CheckoutScreen;
