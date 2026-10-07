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
    return (
      <View style={styles.card}>
        <Text style={styles.productName}>{item.name}</Text>

        <Text style={styles.description}>
          {item.description || 'No description available.'}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.price}>
            ₹{Number(item.price || 0).toFixed(2)}
          </Text>

          <Text style={styles.stock}>Stock: {item.stock}</Text>
        </View>

        <Pressable
          style={styles.button}
          onPress={() =>
            navigation.navigate('DealerProductDetails', {
              productId: item.id,
            })
          }
        >
          <Text style={styles.buttonText}>View Product</Text>
        </Pressable>
      </View>
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dealer Products</Text>

      <Text style={styles.subtitle}>
        View product prices and available stock.
      </Text>

      <FlatList
        data={products}
        keyExtractor={item => String(item.id)}
        renderItem={renderProduct}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 20,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 20,
  },

  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 6,
    marginBottom: 15,
    paddingHorizontal: 20,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },

  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  description: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 6,
    lineHeight: 20,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },

  price: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  stock: {
    fontSize: 15,
    fontWeight: '600',
    color: '#15803d',
  },

  button: {
    marginTop: 15,
    backgroundColor: '#111827',
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  loadingText: {
    marginTop: 10,
    color: '#666',
  },

  error: {
    color: '#dc2626',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default DealerProductsScreen;
