import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
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

  const renderCategory = ({ item }) => {
    return (
      <View
        style={styles.card}
       onTouchEnd={() =>
  navigation.getParent()?.navigate('ProductList', {
    categoryId: item.id,
    categoryName: item.name,
  })
}
      >
        <Text style={styles.name}>{item.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop by Category</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
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
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
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

export default CategoriesScreen;
