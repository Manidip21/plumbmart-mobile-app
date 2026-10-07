import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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

  const getStatusStyle = status => {
    switch (status) {
      case 'CONFIRMED':
        return {
          backgroundColor: '#f0fdf4',
          color: '#15803d',
        };

      case 'PROCESSING':
        return {
          backgroundColor: '#eff6ff',
          color: '#2563eb',
        };

      case 'DELIVERED':
        return {
          backgroundColor: '#f0fdf4',
          color: '#15803d',
        };

      case 'CANCELLED':
        return {
          backgroundColor: '#fef2f2',
          color: '#dc2626',
        };

      default:
        return {
          backgroundColor: '#f3f4f6',
          color: '#374151',
        };
    }
  };

  const getStepState = step => {
    const status = order?.status;

    if (status === 'CANCELLED') {
      return 'inactive';
    }

    const statusOrder = {
      CONFIRMED: 1,
      PROCESSING: 2,
      OUT_FOR_DELIVERY: 3,
      DELIVERED: 4,
    };

    const currentStep = statusOrder[status] || 1;

    if (step <= currentStep) {
      return 'completed';
    }

    return 'inactive';
  };

  const renderTrackingStep = (title, description, step, isLast = false) => {
    const state = getStepState(step);
    const completed = state === 'completed';

    return (
      <>
        <View style={styles.trackingStep}>
          <View
            style={[styles.trackingCircle, completed && styles.completedCircle]}
          >
            {completed && <Text style={styles.trackingCheck}>✓</Text>}
          </View>

          <View style={styles.trackingContent}>
            <Text
              style={[styles.trackingTitle, completed && styles.completedTitle]}
            >
              {title}
            </Text>

            <Text style={styles.trackingDescription}>{description}</Text>
          </View>
        </View>

        {!isLast && (
          <View
            style={[styles.trackingLine, completed && styles.completedLine]}
          />
        )}
      </>
    );
  };

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

        <Pressable style={styles.retryButton} onPress={fetchOrder}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Order not found.</Text>

        <Pressable style={styles.retryButton} onPress={fetchOrder}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const statusStyle = getStatusStyle(order.status);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Order #{order.id}</Text>

      <View
        style={[
          styles.statusCard,
          { backgroundColor: statusStyle.backgroundColor },
        ]}
      >
        <Text style={styles.label}>Order Status</Text>

        <Text style={[styles.status, { color: statusStyle.color }]}>
          {order.status}
        </Text>
      </View>

      <Text style={styles.date}>
        Ordered on {new Date(order.createdAt).toLocaleDateString()}
      </Text>

      <Text style={styles.sectionTitle}>Order Tracking</Text>

      <View style={styles.trackingCard}>
        {renderTrackingStep(
          'Order Confirmed',
          'Your order has been confirmed successfully.',
          1,
        )}

        {renderTrackingStep(
          'Processing',
          'Your order will be prepared for delivery.',
          2,
        )}

        {renderTrackingStep(
          'Out for Delivery',
          'Your order will be delivered to you.',
          3,
        )}

        {renderTrackingStep(
          'Delivered',
          'Your order has been delivered.',
          4,
          true,
        )}
      </View>

      <Text style={styles.sectionTitle}>Items</Text>

      {order.OrderItems?.map(item => (
        <View key={item.id} style={styles.itemCard}>
          <View style={styles.itemIcon}>
            <Text style={styles.itemIconText}>P</Text>
          </View>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 35,
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
    color: '#555',
  },

  error: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 15,
  },

  retryButton: {
    backgroundColor: '#111827',
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 8,
  },

  retryText: {
    color: '#fff',
    fontWeight: '700',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 18,
  },

  statusCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },

  status: {
    fontSize: 18,
    fontWeight: '700',
  },

  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },

  trackingCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 25,
    elevation: 1,
  },

  trackingStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  trackingCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  completedCircle: {
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
    fontWeight: '600',
    color: '#6b7280',
  },

  completedTitle: {
    color: '#111827',
    fontWeight: '700',
  },

  trackingDescription: {
    fontSize: 13,
    color: '#777',
    marginTop: 3,
    lineHeight: 18,
  },

  trackingLine: {
    width: 2,
    height: 28,
    backgroundColor: '#e5e7eb',
    marginLeft: 12,
    marginVertical: 2,
  },

  completedLine: {
    backgroundColor: '#15803d',
  },

  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },

  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
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
    color: '#111827',
  },

  summary: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginTop: 10,
    padding: 18,
    elevation: 1,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  summaryLabel: {
    fontSize: 15,
    color: '#555',
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    maxWidth: '55%',
    textAlign: 'right',
    color: '#111827',
  },

  totalAmount: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111827',
  },

  paymentStatus: {
    fontSize: 15,
    fontWeight: '700',
    color: '#15803d',
  },
});

export default OrderDetailsScreen;
