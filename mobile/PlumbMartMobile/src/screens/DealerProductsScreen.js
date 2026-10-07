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

function DealerProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/api/products');

      console.log('DEALER PRODUCTS RESPONSE:', response.data);

      setProducts(response.data.data || []);
    } catch (err) {
      console.log('DEALER PRODUCTS ERROR:', err.response?.data || err.message);

      setError(err.response?.data?.message || 'Unable to load products.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, []),
  );

  const renderProduct = ({ item }) => {
    const stock = Number(item.stock || 0);

    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
        android_ripple={{ color: '#e5e7eb' }}
        onPress={() =>
          navigation.navigate('DealerProductDetails', {
            productId: item.id,
          })
        }
      >
        <View style={styles.productHeader}>
          <View style={styles.productIcon}>
            <Text style={styles.productIconText}>P</Text>
          </View>

          <View style={styles.productHeaderInfo}>
            <Text style={styles.productName}>{item.name}</Text>

            <Text style={styles.productId}>Product #{item.id}</Text>
          </View>
        </View>

        <Text style={styles.description}>
          {item.description || 'No description available.'}
        </Text>

        <View style={styles.infoRow}>
          <View>
            <Text style={styles.infoLabel}>Dealer Price</Text>

            <Text style={styles.price}>
              ₹{Number(item.price || 0).toFixed(2)}
            </Text>
          </View>

          <View style={styles.stockContainer}>
            <Text style={styles.infoLabel}>Available Stock</Text>

            <Text style={[styles.stock, stock === 0 && styles.outOfStock]}>
              {stock} units
            </Text>
          </View>
        </View>

        <View style={styles.viewRow}>
          <Text style={styles.viewText}>View Product Details</Text>

          <Text style={styles.arrow}>›</Text>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>

        <Pressable style={styles.retryButton} onPress={fetchProducts}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Dealer Products</Text>

          <Text style={styles.subtitle}>
            View dealer pricing and available stock.
          </Text>
        </View>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>{products.length}</Text>
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={item => String(item.id)}
        renderItem={renderProduct}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>P</Text>

            <Text style={styles.emptyTitle}>No products found</Text>

            <Text style={styles.emptyText}>
              There are currently no products available.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },

  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 5,
  },

  countBadge: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  countText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },

  pressedCard: {
    opacity: 0.75,
  },

  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  productIconText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#374151',
  },

  productHeaderInfo: {
    flex: 1,
  },

  productName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  productId: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 3,
  },

  description: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 12,
    lineHeight: 20,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  infoLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },

  price: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  stockContainer: {
    alignItems: 'flex-end',
  },

  stock: {
    fontSize: 16,
    fontWeight: '700',
    color: '#15803d',
  },

  outOfStock: {
    color: '#dc2626',
  },

  viewRow: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  viewText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },

  arrow: {
    fontSize: 25,
    color: '#9ca3af',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  loadingText: {
    marginTop: 10,
    color: '#666',
  },

  error: {
    color: '#dc2626',
    fontSize: 15,
    textAlign: 'center',
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

  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },

  emptyIcon: {
    width: 55,
    height: 55,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 28,
    backgroundColor: '#e5e7eb',
    fontSize: 22,
    fontWeight: '800',
    color: '#6b7280',
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default DealerProductsScreen;
