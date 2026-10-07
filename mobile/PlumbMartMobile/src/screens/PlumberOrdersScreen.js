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

  const getStatusStyle = status => {
    switch (status) {
      case 'CONFIRMED':
        return {
          backgroundColor: '#dcfce7',
          color: '#166534',
        };

      case 'PROCESSING':
        return {
          backgroundColor: '#fef3c7',
          color: '#92400e',
        };

      case 'OUT_FOR_DELIVERY':
        return {
          backgroundColor: '#dbeafe',
          color: '#1d4ed8',
        };

      case 'DELIVERED':
        return {
          backgroundColor: '#dcfce7',
          color: '#166534',
        };

      case 'CANCELLED':
        return {
          backgroundColor: '#fee2e2',
          color: '#991b1b',
        };

      default:
        return {
          backgroundColor: '#f3f4f6',
          color: '#374151',
        };
    }
  };

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
        <Text style={styles.errorIcon}>!</Text>

        <Text style={styles.errorTitle}>Unable to load orders</Text>

        <Text style={styles.errorText}>{error}</Text>

        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.pressedButton,
          ]}
          onPress={fetchOrders}
        >
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>O</Text>
        </View>

        <Text style={styles.emptyTitle}>No Orders</Text>

        <Text style={styles.emptyText}>
          There are no related orders available yet.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>

        <Text style={styles.subtitle}>
          View orders related to your assigned work.
        </Text>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
          </Text>
        </View>
      </View>

      {orders.map(order => {
        const statusStyle = getStatusStyle(order.status);

        return (
          <Pressable
            key={order.id}
            style={({ pressed }) => [
              styles.orderCard,
              pressed && styles.pressedCard,
            ]}
            android_ripple={{ color: '#e5e7eb' }}
            onPress={() =>
              navigation.navigate('PlumberOrderDetails', {
                orderId: order.id,
              })
            }
          >
            <View style={styles.topRow}>
              <View style={styles.orderIcon}>
                <Text style={styles.orderIconText}>O</Text>
              </View>

              <View style={styles.orderHeaderContent}>
                <Text style={styles.orderId}>Order #{order.id}</Text>

                <Text style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusStyle.backgroundColor },
                ]}
              >
                <Text style={[styles.statusText, { color: statusStyle.color }]}>
                  {order.status}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.bottomRow}>
              <View>
                <Text style={styles.totalLabel}>Order Total</Text>

                <Text style={styles.total}>
                  ₹{Number(order.totalAmount).toFixed(2)}
                </Text>
              </View>

              <Text style={styles.viewDetails}>View Details ›</Text>
            </View>
          </Pressable>
        );
      })}
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
    paddingBottom: 30,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },

  loadingText: {
    marginTop: 10,
    color: '#64748b',
  },

  errorIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    textAlign: 'center',
    lineHeight: 48,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },

  errorText: {
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 18,
  },

  retryButton: {
    backgroundColor: '#111827',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
  },

  pressedButton: {
    opacity: 0.7,
  },

  retryText: {
    color: '#fff',
    fontWeight: '700',
  },

  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  emptyIconText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#374151',
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },

  emptyText: {
    marginTop: 8,
    color: '#64748b',
    textAlign: 'center',
  },

  header: {
    marginBottom: 18,
  },

  title: {
    fontSize: 27,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginTop: 6,
  },

  countBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
  },

  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
  },

  pressedCard: {
    opacity: 0.75,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  orderIcon: {
    width: 44,
    height: 44,
    borderRadius: 11,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  orderIconText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#374151',
  },

  orderHeaderContent: {
    flex: 1,
  },

  orderId: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  orderDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },

  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 14,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  totalLabel: {
    fontSize: 12,
    color: '#64748b',
  },

  total: {
    marginTop: 3,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  viewDetails: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
});

export default PlumberOrdersScreen;
