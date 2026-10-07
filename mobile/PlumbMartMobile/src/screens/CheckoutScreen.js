import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
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

  const credit30Eligible = Boolean(user?.credit30Eligible);
  const credit90Eligible = Boolean(user?.credit90Eligible);

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

  const renderPaymentOption = ({ value, title, description }) => {
    const selected = paymentMethod === value;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.paymentOption,
          selected && styles.selectedPaymentOption,
          pressed && styles.pressedOption,
        ]}
        onPress={() => setPaymentMethod(value)}
      >
        <View
          style={[styles.radioOuter, selected && styles.radioOuterSelected]}
        >
          {selected && <View style={styles.radioInner} />}
        </View>

        <View style={styles.paymentInfo}>
          <Text style={styles.paymentTitle}>{title}</Text>

          <Text style={styles.paymentDescription}>{description}</Text>
        </View>

        {selected && <Text style={styles.selectedText}>Selected</Text>}
      </Pressable>
    );
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

        <Pressable style={styles.retryButton} onPress={fetchCart}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Checkout</Text>

        <Text style={styles.subtitle}>
          Review your order and select a payment method.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>

        <View style={styles.summaryCard}>
          {cartItems.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                index === cartItems.length - 1 && styles.lastItemRow,
              ]}
            >
              <View style={styles.itemIcon}>
                <Text style={styles.itemIconText}>P</Text>
              </View>

              <View style={styles.itemInfo}>
                <Text style={styles.productName}>
                  {item.Product?.name || 'Product'}
                </Text>

                <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
              </View>

              <Text style={styles.itemTotal}>
                ₹{getItemTotal(item).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.paymentHeader}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          {role === 'DEALER' && (
            <View style={styles.dealerBadge}>
              <Text style={styles.dealerBadgeText}>DEALER</Text>
            </View>
          )}
        </View>

        {role === 'CUSTOMER' &&
          renderPaymentOption({
            value: 'DIRECT_PAYMENT',
            title: 'Direct Payment',
            description: 'Pay directly for this order',
          })}

        {role === 'DEALER' && (
          <>
            {renderPaymentOption({
              value: 'UPFRONT',
              title: 'Upfront Payment',
              description: 'Pay the full amount upfront',
            })}

            {credit30Eligible &&
              renderPaymentOption({
                value: 'CREDIT_30',
                title: '30 Days Credit',
                description: 'Pay within 30 days',
              })}

            {credit90Eligible &&
              renderPaymentOption({
                value: 'CREDIT_90',
                title: '90 Days Credit',
                description: 'Pay within 90 days',
              })}

            <View style={styles.creditInfo}>
              <Text style={styles.creditInfoTitle}>
                Dealer Credit Eligibility
              </Text>

              <Text style={styles.creditInfoText}>
                30 Days: {credit30Eligible ? 'Eligible' : 'Not eligible'}
                {'\n'}
                90 Days: {credit90Eligible ? 'Eligible' : 'Not eligible'}
              </Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.totalSection}>
          <View>
            <Text style={styles.totalLabel}>Total Amount</Text>

            <Text style={styles.totalItems}>
              {cartItems.length}{' '}
              {cartItems.length === 1 ? 'product' : 'products'}
            </Text>
          </View>

          <Text style={styles.totalAmount}>₹{getCartTotal().toFixed(2)}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.placeOrderButton,
            pressed && styles.placeOrderPressed,
            placingOrder && styles.disabledButton,
          ]}
          onPress={handlePlaceOrder}
          disabled={placingOrder}
        >
          {placingOrder ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.placeOrderText}>Place Order</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },

  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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

  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    color: '#222',
  },

  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },

  header: {
    marginBottom: 22,
  },

  title: {
    fontSize: 27,
    fontWeight: '800',
    color: '#171717',
  },

  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },

  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
    marginBottom: 11,
  },

  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ededed',
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  lastItemRow: {
    borderBottomWidth: 0,
  },

  itemIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  itemIconText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#374151',
  },

  itemInfo: {
    flex: 1,
    paddingRight: 10,
  },

  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    marginBottom: 5,
  },

  quantity: {
    fontSize: 13,
    color: '#777',
  },

  itemTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },

  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dealerBadge: {
    backgroundColor: '#111827',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 11,
  },

  dealerBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },

  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },

  selectedPaymentOption: {
    borderColor: '#222',
    borderWidth: 2,
  },

  pressedOption: {
    opacity: 0.85,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  radioOuterSelected: {
    borderColor: '#222',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#222',
  },

  paymentInfo: {
    flex: 1,
  },

  paymentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  paymentDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 3,
  },

  selectedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#222',
  },

  creditInfo: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 2,
  },

  creditInfoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 5,
  },

  creditInfoText: {
    fontSize: 12,
    lineHeight: 19,
    color: '#6b7280',
  },

  bottomSection: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ededed',
  },

  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  totalItems: {
    fontSize: 12,
    color: '#777',
    marginTop: 3,
  },

  totalAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },

  placeOrderButton: {
    backgroundColor: '#222',
    minHeight: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeOrderPressed: {
    opacity: 0.85,
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
