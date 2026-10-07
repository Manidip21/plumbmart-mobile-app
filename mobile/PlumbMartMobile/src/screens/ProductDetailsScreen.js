import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
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

        <Pressable style={styles.retryButton} onPress={fetchProduct}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.imagePlaceholder}>
        <View style={styles.productIcon}>
          <Text style={styles.productIconText}>P</Text>
        </View>

        <Text style={styles.imageText}>Product</Text>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.category}>
          {product.category?.name || 'Product'}
        </Text>

        <Text style={styles.name}>{product.name}</Text>

        <Text style={styles.price}>₹{product.price}</Text>

        {role === 'DEALER' && (
          <View style={styles.stockCard}>
            <View>
              <Text style={styles.stockLabel}>Available Stock</Text>
              <Text style={styles.stockValue}>{product.stock}</Text>
            </View>

            <Text style={styles.stockUnit}>units</Text>
          </View>
        )}

        <View style={styles.divider} />

        <Text style={styles.descriptionTitle}>Description</Text>

        <Text style={styles.description}>
          {product.description || 'No description available for this product.'}
        </Text>

        <Text style={styles.quantityTitle}>Quantity</Text>

        <View style={styles.quantityContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.quantityButton,
              pressed && styles.pressedButton,
            ]}
            onPress={decreaseQuantity}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </Pressable>

          <Text style={styles.quantityText}>{quantity}</Text>

          <Pressable
            style={({ pressed }) => [
              styles.quantityButton,
              pressed && styles.pressedButton,
            ]}
            onPress={increaseQuantity}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
            addingToCart && styles.disabledButton,
          ]}
          onPress={handleAddToCart}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Add to Cart</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },

  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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

  empty: {
    fontSize: 16,
    color: '#555',
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

  imagePlaceholder: {
    height: 230,
    backgroundColor: '#e9e9e9',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  productIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  productIconText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
  },

  imageText: {
    fontSize: 14,
    color: '#777',
    fontWeight: '500',
  },

  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
  },

  category: {
    fontSize: 14,
    color: '#777',
    marginBottom: 7,
    fontWeight: '500',
  },

  name: {
    fontSize: 25,
    fontWeight: '800',
    color: '#171717',
    marginBottom: 8,
  },

  price: {
    fontSize: 23,
    fontWeight: '800',
    color: '#111',
    marginBottom: 16,
  },

  stockCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 12,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  stockLabel: {
    fontSize: 13,
    color: '#166534',
    marginBottom: 3,
    fontWeight: '500',
  },

  stockValue: {
    fontSize: 21,
    color: '#15803d',
    fontWeight: '800',
  },

  stockUnit: {
    fontSize: 13,
    color: '#166534',
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 18,
  },

  descriptionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 23,
    marginBottom: 24,
  },

  quantityTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  quantityButton: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  pressedButton: {
    backgroundColor: '#f0f0f0',
  },

  quantityButtonText: {
    fontSize: 25,
    fontWeight: '600',
    color: '#222',
  },

  quantityText: {
    minWidth: 50,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  addButton: {
    backgroundColor: '#222',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },

  addButtonPressed: {
    opacity: 0.85,
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
