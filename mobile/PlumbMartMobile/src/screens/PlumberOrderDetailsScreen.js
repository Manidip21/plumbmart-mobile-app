import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import api from '../config/api';

function PlumberOrderDetailsScreen({ route }) {
  const { orderId } = route.params;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(`/api/orders/${orderId}`);

      console.log('PLUMBER ORDER DETAILS:', response.data);

      setOrder(response.data.order);
    } catch (err) {
      console.log(
        'PLUMBER ORDER DETAILS ERROR:',
        err.response?.data || err.message,
      );

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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centerContainer}>
        <Text>No order details available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order #{order.id}</Text>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{order.status}</Text>

        <Text style={styles.label}>Payment Method</Text>
        <Text style={styles.value}>{order.paymentMethod}</Text>

        <Text style={styles.label}>Payment Status</Text>
        <Text style={styles.value}>{order.paymentStatus}</Text>
      </View>

      <Text style={styles.sectionTitle}>Products</Text>

      {order.OrderItems?.map(item => (
        <View key={item.id} style={styles.itemCard}>
          <Text style={styles.productName}>{item.Product?.name}</Text>

          <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>

          <Text style={styles.itemDetails}>
            Price: ₹{Number(item.price).toFixed(2)}
          </Text>
        </View>
      ))}

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total</Text>

        <Text style={styles.totalValue}>
          ₹{Number(order.totalAmount).toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },

  loadingText: {
    marginTop: 10,
    color: '#64748b',
  },

  errorText: {
    color: '#dc2626',
    textAlign: 'center',
  },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 8,
  },

  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 3,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },

  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  itemDetails: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 5,
  },

  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
});

export default PlumberOrderDetailsScreen;
