import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import api from '../config/api';

function OrderDetailsScreen({ route }) {
  const { orderId } = route.params;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(`/api/orders/${orderId}`);

      console.log('ORDER DETAILS RESPONSE:', response.data);

      setOrder(response.data.order);
    } catch (err) {
      console.log('ORDER DETAILS ERROR:', err.response?.data || err.message);

      setError(err.response?.data?.message || 'Unable to load order details.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrder();
    }, [orderId]),
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading order...</Text>
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

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Order not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order #{order.id}</Text>

      <View style={styles.statusCard}>
        <Text style={styles.label}>Order Status</Text>

        <Text style={styles.status}>{order.status}</Text>
      </View>

      <Text style={styles.date}>
        Ordered on {new Date(order.createdAt).toLocaleDateString()}
      </Text>

      <Text style={styles.sectionTitle}>Order Tracking</Text>

      <View style={styles.trackingCard}>
        <View style={styles.trackingStep}>
          <View style={styles.trackingCircle}>
            <Text style={styles.trackingCheck}>✓</Text>
          </View>

          <View style={styles.trackingContent}>
            <Text style={styles.trackingTitle}>Order Confirmed</Text>

            <Text style={styles.trackingDescription}>
              Your order has been confirmed successfully.
            </Text>
          </View>
        </View>

        <View style={styles.trackingLine} />

        <View style={styles.trackingStep}>
          <View
            style={[
              styles.trackingCircle,
              order.status === 'PROCESSING' && styles.activeCircle,
            ]}
          >
            {order.status === 'PROCESSING' && (
              <Text style={styles.trackingCheck}>✓</Text>
            )}
          </View>

          <View style={styles.trackingContent}>
            <Text style={styles.trackingTitle}>Processing</Text>

            <Text style={styles.trackingDescription}>
              Your order will be prepared for delivery.
            </Text>
          </View>
        </View>

        <View style={styles.trackingLine} />

        <View style={styles.trackingStep}>
          <View style={styles.trackingCircle} />

          <View style={styles.trackingContent}>
            <Text style={styles.trackingTitle}>Out for Delivery</Text>

            <Text style={styles.trackingDescription}>
              Your order will be delivered to you.
            </Text>
          </View>
        </View>

        <View style={styles.trackingLine} />

        <View style={styles.trackingStep}>
          <View style={styles.trackingCircle} />

          <View style={styles.trackingContent}>
            <Text style={styles.trackingTitle}>Delivered</Text>

            <Text style={styles.trackingDescription}>
              Your order has been delivered.
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Items</Text>

      {order.OrderItems?.map(item => (
        <View key={item.id} style={styles.itemCard}>
          <View style={styles.itemInfo}>
            <Text style={styles.productName}>
              {item.Product?.name || 'Product'}
            </Text>

            <Text style={styles.quantity}>Quantity: {item.quantity}</Text>

            <Text style={styles.unitPrice}>
              Price: ₹{Number(item.price || 0).toFixed(2)}
            </Text>
          </View>

          <Text style={styles.itemTotal}>
            ₹{(Number(item.price || 0) * item.quantity).toFixed(2)}
          </Text>
        </View>
      ))}

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Amount</Text>

          <Text style={styles.totalAmount}>
            ₹{Number(order.totalAmount || 0).toFixed(2)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Payment Method</Text>

          <Text style={styles.summaryValue}>{order.paymentMethod}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Payment Status</Text>

          <Text style={styles.paymentStatus}>{order.paymentStatus}</Text>
        </View>
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

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },

  statusCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },

  status: {
    fontSize: 17,
    fontWeight: '700',
    color: '#15803d',
  },

  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 12,
  },
  trackingCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
  },

  trackingStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  trackingCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  activeCircle: {
    borderColor: '#15803d',
    backgroundColor: '#15803d',
  },

  trackingCheck: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  trackingContent: {
    flex: 1,
    marginLeft: 12,
  },

  trackingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },

  trackingDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 3,
  },

  trackingLine: {
    width: 2,
    height: 25,
    backgroundColor: '#ddd',
    marginLeft: 11,
    marginVertical: 2,
  },

  itemCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginBottom: 3,
  },

  unitPrice: {
    fontSize: 14,
    color: '#666',
  },

  itemTotal: {
    fontSize: 16,
    fontWeight: '700',
  },

  summary: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 15,
    paddingTop: 18,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  summaryLabel: {
    fontSize: 15,
    color: '#555',
  },

  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    maxWidth: '55%',
    textAlign: 'right',
  },

  totalAmount: {
    fontSize: 21,
    fontWeight: '700',
  },

  paymentStatus: {
    fontSize: 15,
    fontWeight: '700',
    color: '#15803d',
  },
});

export default OrderDetailsScreen;
