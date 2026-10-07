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

function CategoriesScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/api/products/categories');

      console.log('CATEGORIES RESPONSE:', response.data);

      setCategories(response.data.data || []);
    } catch (err) {
      console.log('CATEGORIES ERROR:', err.response?.data || err.message);

      setError(err.response?.data?.message || 'Unable to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryPress = category => {
    navigation.getParent()?.navigate('ProductList', {
      categoryId: category.id,
      categoryName: category.name,
    });
  };

  const renderCategory = ({ item }) => {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => handleCategoryPress(item)}
        android_ripple={{ color: '#dbeafe' }}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>P</Text>
        </View>

        <View style={styles.categoryInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.subText}>Browse products</Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop by Category</Text>

      <Text style={styles.subtitle}>Find the plumbing products you need</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>

          <Pressable style={styles.retryButton} onPress={fetchCategories}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : categories.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>No categories available.</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={item => String(item.id)}
          renderItem={renderCategory}
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
    fontSize: 25,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 5,
    marginBottom: 20,
  },

  list: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardPressed: {
    opacity: 0.75,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  iconText: {
    fontSize: 21,
    fontWeight: '800',
    color: '#2563eb',
  },

  categoryInfo: {
    flex: 1,
  },

  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  subText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
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
    paddingHorizontal: 20,
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

export default CategoriesScreen;
