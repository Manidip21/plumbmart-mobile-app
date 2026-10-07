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
        product => product.categoryId === categoryId,
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
        style={styles.card}
        onPress={() =>
          navigation.navigate('ProductDetails', {
            productId: item.id,
          })
        }
      >
        <Text style={styles.productName}>{item.name}</Text>

        <Text style={styles.description}>{item.description}</Text>

        <Text style={styles.price}>₹{item.price}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{categoryName}</Text>

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

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
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
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
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
    textAlign: 'center',
  },
});

export default ProductListScreen;
