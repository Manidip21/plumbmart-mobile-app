import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import api from '../config/api';

function ProductDetailsScreen({ route }) {
  const { productId } = route.params;

  const role = useSelector(state => state.auth.user?.role);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState('');

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(`/api/products/${productId}`);

      console.log('PRODUCT DETAILS RESPONSE:', response.data);

      setProduct(response.data.data);
    } catch (err) {
      console.log('PRODUCT DETAILS ERROR:', err.response?.data || err.message);

      setError(
        err.response?.data?.message || 'Unable to load product details.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const increaseQuantity = () => {
    setQuantity(previousQuantity => previousQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(previousQuantity => {
      if (previousQuantity === 1) {
        return 1;
      }

      return previousQuantity - 1;
    });
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);

      const response = await api.post('/api/cart/items', {
        productId,
        quantity,
      });

      console.log('ADD TO CART RESPONSE:', response.data);

      Alert.alert(
        'Added to Cart',
        response.data.message || 'Product added to cart successfully.',
      );
    } catch (err) {
      console.log('ADD TO CART ERROR:', err.response?.data || err.message);

      Alert.alert(
        'Unable to Add',
        err.response?.data?.message ||
          'Something went wrong while adding the product to cart.',
      );
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading product...</Text>
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

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Product not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageText}>Product Image</Text>
      </View>

      <Text style={styles.name}>{product.name}</Text>

      <Text style={styles.category}>{product.category?.name || 'Product'}</Text>

      <Text style={styles.price}>₹{product.price}</Text>

      {role === 'DEALER' && (
        <Text style={styles.stock}>Available Stock: {product.stock}</Text>
      )}

      <Text style={styles.descriptionTitle}>Description</Text>

      <Text style={styles.description}>{product.description}</Text>

      <Text style={styles.quantityTitle}>Quantity</Text>

      <View style={styles.quantityContainer}>
        <Pressable style={styles.quantityButton} onPress={decreaseQuantity}>
          <Text style={styles.quantityButtonText}>−</Text>
        </Pressable>

        <Text style={styles.quantityText}>{quantity}</Text>

        <Pressable style={styles.quantityButton} onPress={increaseQuantity}>
          <Text style={styles.quantityButtonText}>+</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.addButton, addingToCart && styles.disabledButton]}
        onPress={handleAddToCart}
        disabled={addingToCart}
      >
        <Text style={styles.addButtonText}>
          {addingToCart ? 'Adding...' : 'Add to Cart'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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

  empty: {
    fontSize: 16,
  },

  imagePlaceholder: {
    height: 220,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  imageText: {
    fontSize: 16,
    color: '#777',
  },

  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },

  category: {
    fontSize: 15,
    color: '#666',
    marginBottom: 12,
  },

  price: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },

  stock: {
    fontSize: 16,
    fontWeight: '600',
    color: '#15803d',
    marginBottom: 20,
  },

  descriptionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },

  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 23,
    marginBottom: 25,
  },

  quantityTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  quantityButton: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },

  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 25,
  },

  addButton: {
    backgroundColor: '#222',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },

  addButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default ProductDetailsScreen;
