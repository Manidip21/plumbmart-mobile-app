import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function DealerDashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dealer Dashboard</Text>

      <Text style={styles.subtitle}>
        Manage products, stock, cart and orders.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('DealerProducts')}
      >
        <Text style={styles.buttonText}>View Products</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('DealerCart')}
      >
        <Text style={styles.buttonText}>View Cart</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },

  button: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 12,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DealerDashboardScreen;
