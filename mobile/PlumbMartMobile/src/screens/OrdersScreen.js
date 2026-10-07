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

  const renderOrder = ({ item }) => {
    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          navigation.navigate('OrderDetails', {
            orderId: item.id,
          })
        }
      >
        <View style={styles.headerRow}>
          <Text style={styles.orderNumber}>Order #{item.id}</Text>

          <Text style={styles.status}>{item.status}</Text>
        </View>

        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>

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

        <Text style={styles.payment}>Payment: {item.paymentMethod}</Text>

        <Text style={styles.paymentStatus}>
          Payment Status: {item.paymentStatus}
        </Text>
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
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No Orders Yet</Text>

        <Text style={styles.emptyText}>
          Your placed orders will appear here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>

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
    color: '#111827',
  },

  list: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  orderNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  status: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803d',
  },

  date: {
    fontSize: 13,
    color: '#666',
    marginTop: 6,
  },

  divider: {
    height: 1,
    backgroundColor: '#ddd',
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
  },

  quantity: {
    fontSize: 13,
    color: '#666',
    marginTop: 3,
  },

  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 12,
    marginTop: 5,
  },

  totalLabel: {
    fontSize: 17,
    fontWeight: '600',
  },

  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
  },

  payment: {
    fontSize: 13,
    color: '#555',
    marginTop: 10,
  },

  paymentStatus: {
    fontSize: 13,
    color: '#15803d',
    marginTop: 4,
  },
});

export default OrdersScreen;
