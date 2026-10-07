import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import api from '../config/api';

function PlumberOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/api/orders');

      console.log('PLUMBER ORDERS RESPONSE:', response.data);

      setOrders(response.data.orders || []);
    } catch (err) {
      console.log('PLUMBER ORDERS ERROR:', err.response?.data || err.message);

      setError(err.response?.data?.message || 'Unable to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, []),
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>

        <Pressable style={styles.retryButton} onPress={fetchOrders}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>No Orders</Text>
        <Text style={styles.emptyText}>There are no orders available yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>

      {orders.map(order => (
        <Pressable
          key={order.id}
          style={styles.orderCard}
          onPress={() =>
            navigation.navigate('PlumberOrderDetails', {
              orderId: order.id,
            })
          }
        >
          <View style={styles.row}>
            <Text style={styles.orderId}>Order #{order.id}</Text>

            <Text style={styles.status}>{order.status}</Text>
          </View>

          <Text style={styles.orderDate}>
            {new Date(order.createdAt).toLocaleDateString()}
          </Text>

          <Text style={styles.total}>
            Total: ₹{Number(order.totalAmount).toFixed(2)}
          </Text>
        </Pressable>
      ))}
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
    marginBottom: 16,
  },

  retryButton: {
    backgroundColor: '#111827',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  retryText: {
    color: '#fff',
    fontWeight: '600',
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },

  emptyText: {
    marginTop: 8,
    color: '#64748b',
  },

  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  orderId: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  status: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },

  orderDate: {
    marginTop: 8,
    fontSize: 13,
    color: '#64748b',
  },

  total: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
});

export default PlumberOrdersScreen;
