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
        <View style={styles.productIcon}>
          <Text style={styles.productIconText}>P</Text>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>

          <Text style={styles.category}>
            {item.category?.name || item.category || 'Product'}
          </Text>

          <Text style={styles.price}>₹{item.price}</Text>
        </View>
      </View>
    );
  };

  const displayName = user?.name || 'Customer';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.greeting}>Hello, {displayName} 👋</Text>

          <Text style={styles.mobile}>{user?.mobile}</Text>
        </View>

        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
          android_ripple={{ color: '#fee2e2' }}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.welcomeCard}>
        <View>
          <Text style={styles.welcomeTitle}>Find your plumbing needs</Text>
          <Text style={styles.welcomeSubtitle}>
            Browse quality products at the right price.
          </Text>
        </View>

        <View style={styles.welcomeIcon}>
          <Text style={styles.welcomeIconText}>P</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Products</Text>

        <Text style={styles.productCount}>{products.length} products</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>

          <Pressable style={styles.retryButton} onPress={fetchProducts}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
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
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerInfo: {
    flex: 1,
    paddingRight: 12,
  },

  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },

  mobile: {
    marginTop: 4,
    fontSize: 14,
    color: '#6b7280',
  },

  logoutButton: {
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#ffffff',
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  logoutButtonText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '700',
  },

  welcomeCard: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  welcomeTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 5,
    maxWidth: 230,
  },

  welcomeSubtitle: {
    color: '#dbeafe',
    fontSize: 12,
    lineHeight: 18,
    maxWidth: 230,
  },

  welcomeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  welcomeIconText: {
    fontSize: 25,
    fontWeight: '800',
    color: '#2563eb',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },

  productCount: {
    fontSize: 12,
    color: '#6b7280',
  },

  list: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },

  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  productIconText: {
    fontSize: 21,
    fontWeight: '800',
    color: '#2563eb',
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },

  category: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
  },

  price: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2563eb',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  loadingText: {
    marginTop: 10,
    color: '#6b7280',
  },

  error: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 16,
  },

  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  retryText: {
    color: '#ffffff',
    fontWeight: '700',
  },

  empty: {
    fontSize: 16,
    color: '#6b7280',
  },
});

export default HomeScreen;
