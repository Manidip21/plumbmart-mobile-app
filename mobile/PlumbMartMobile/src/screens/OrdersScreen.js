import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import api from '../config/api';

function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/api/orders');

      console.log('ORDERS RESPONSE:', response.data);

      setOrders(response.data.orders || []);
    } catch (err) {
      console.log('ORDERS ERROR:', err.response?.data || err.message);

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
          container: styles.statusConfirmed,
          text: styles.statusConfirmedText,
        };

      case 'CANCELLED':
        return {
          container: styles.statusCancelled,
          text: styles.statusCancelledText,
        };

      case 'DELIVERED':
        return {
          container: styles.statusDelivered,
          text: styles.statusDeliveredText,
        };

      default:
        return {
          container: styles.statusDefault,
          text: styles.statusDefaultText,
        };
    }
  };

  const renderOrder = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() =>
          navigation.navigate('OrderDetails', {
            orderId: item.id,
          })
        }
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.orderNumber}>Order #{item.id}</Text>

            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <View style={statusStyle.container}>
            <Text style={statusStyle.text}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {item.OrderItems?.map(orderItem => (
          <View key={orderItem.id} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.productName}>
                {orderItem.Product?.name || 'Product'}
              </Text>

              <Text style={styles.quantity}>
                Quantity: {orderItem.quantity}
              </Text>
            </View>

            <Text style={styles.itemPrice}>
              ₹{(Number(orderItem.price || 0) * orderItem.quantity).toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>

          <Text style={styles.totalAmount}>
            ₹{Number(item.totalAmount || 0).toFixed(2)}
          </Text>
        </View>

        <View style={styles.paymentSection}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Payment</Text>

            <Text style={styles.paymentValue}>{item.paymentMethod}</Text>
          </View>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Payment Status</Text>

            <Text style={styles.paymentStatus}>{item.paymentStatus}</Text>
          </View>
        </View>

        <View style={styles.viewDetailsRow}>
          <Text style={styles.viewDetails}>View Order Details</Text>

          <Text style={styles.arrow}>→</Text>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>

        <Pressable style={styles.retryButton} onPress={fetchOrders}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.center}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>P</Text>
        </View>

        <Text style={styles.emptyTitle}>No Orders Yet</Text>

        <Text style={styles.emptyText}>
          Your placed orders will appear here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>My Orders</Text>

          <Text style={styles.subtitle}>
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </Text>
        </View>

        <View style={styles.orderCountBadge}>
          <Text style={styles.orderCountText}>{orders.length}</Text>
        </View>
      </View>

      <FlatList
        data={orders}
        keyExtractor={item => String(item.id)}
        renderItem={renderOrder}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
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
    marginBottom: 8,
    color: '#222',
  },

  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },

  titleRow: {
    paddingTop: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#171717',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#777',
  },

  orderCountBadge: {
    minWidth: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  orderCountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  list: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#ededed',
  },

  cardPressed: {
    opacity: 0.9,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  orderNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },

  date: {
    fontSize: 13,
    color: '#777',
    marginTop: 5,
  },

  statusConfirmed: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusConfirmedText: {
    color: '#15803d',
    fontSize: 11,
    fontWeight: '800',
  },

  statusCancelled: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusCancelledText: {
    color: '#b91c1c',
    fontSize: 11,
    fontWeight: '800',
  },

  statusDelivered: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusDeliveredText: {
    color: '#1d4ed8',
    fontSize: 11,
    fontWeight: '800',
  },

  statusDefault: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusDefaultText: {
    color: '#4b5563',
    fontSize: 11,
    fontWeight: '800',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  itemInfo: {
    flex: 1,
    paddingRight: 15,
  },

  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },

  quantity: {
    fontSize: 13,
    color: '#666',
    marginTop: 3,
  },

  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 13,
    marginTop: 4,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },

  totalAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
  },

  paymentSection: {
    marginTop: 13,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  paymentLabel: {
    fontSize: 12,
    color: '#777',
  },

  paymentValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
  },

  paymentStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
  },

  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 13,
  },

  viewDetails: {
    fontSize: 13,
    fontWeight: '700',
    color: '#222',
  },

  arrow: {
    fontSize: 18,
    marginLeft: 6,
    color: '#222',
  },
});

export default OrdersScreen;
