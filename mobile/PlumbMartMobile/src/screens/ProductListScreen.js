import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import api from '../config/api';

function ProductListScreen({ route, navigation }) {
  const { categoryId, categoryName } = route.params;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/api/products');

      const allProducts = response.data.data || [];

      const filteredProducts = allProducts.filter(
        product => Number(product.categoryId) === Number(categoryId),
      );

      setProducts(filteredProducts);
    } catch (err) {
      console.log(
        'CATEGORY PRODUCTS ERROR:',
        err.response?.data || err.message,
      );

      setError(err.response?.data?.message || 'Unable to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  const renderProduct = ({ item }) => {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() =>
          navigation.navigate('ProductDetails', {
            productId: item.id,
          })
        }
        android_ripple={{ color: '#dbeafe' }}
      >
        <View style={styles.productIcon}>
          <Text style={styles.productIconText}>P</Text>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          <Text style={styles.description} numberOfLines={2}>
            {item.description || 'Quality plumbing product'}
          </Text>

          <Text style={styles.price}>₹{item.price}</Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{categoryName}</Text>

          <Text style={styles.subtitle}>Browse available products</Text>
        </View>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>{products.length}</Text>
        </View>
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
          <Text style={styles.empty}>No products found in this category.</Text>
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
    paddingTop: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },

  countBadge: {
    minWidth: 36,
    height: 36,
    paddingHorizontal: 8,
    borderRadius: 18,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },

  countText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563eb',
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

  cardPressed: {
    opacity: 0.75,
  },

  productIcon: {
    width: 52,
    height: 52,
    borderRadius: 13,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  productIconText: {
    fontSize: 22,
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
    marginBottom: 5,
  },

  description: {
    fontSize: 13,
    lineHeight: 18,
    color: '#6b7280',
    marginBottom: 7,
  },

  price: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2563eb',
  },

  arrow: {
    fontSize: 30,
    color: '#9ca3af',
    fontWeight: '300',
    marginLeft: 8,
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
    textAlign: 'center',
  },
});

export default ProductListScreen;
