import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { clearAuthData } from '../store/authSlice';
import { clearAuthData as clearStoredAuthData } from '../utils/authStorage';
import api from '../config/api';

function HomeScreen() {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/api/products');

      console.log('PRODUCTS RESPONSE:', response.data);

      setProducts(response.data.data || []);
    } catch (err) {
      console.log('PRODUCTS ERROR:', err.response?.data || err.message);

      setError(err.response?.data?.message || 'Unable to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await clearStoredAuthData();
          dispatch(clearAuthData());
        },
      },
    ]);
  };

  const renderProduct = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.productName}>{item.name}</Text>

        <Text style={styles.category}>
          {item.category?.name || item.category || 'Product'}
        </Text>

        <Text style={styles.price}>₹{item.price}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello!</Text>

          <Text style={styles.mobile}>{user?.mobile}</Text>
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Featured Products</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>No products available.</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => String(item.id)}
          renderItem={renderProduct}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
  },

  header: {
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },

  mobile: {
    marginTop: 4,
    fontSize: 14,
    color: '#6b7280',
  },

  logoutButton: {
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  logoutButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },

  list: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  productName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },

  category: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 10,
  },

  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#6b7280',
  },

  error: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
  },

  empty: {
    fontSize: 16,
    color: '#6b7280',
  },
});

export default HomeScreen;
