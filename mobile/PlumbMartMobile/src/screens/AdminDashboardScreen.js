import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

function AdminDashboardScreen() {
  const adminFeatures = [
    {
      title: 'User Management',
      description:
        'Manage customers, dealers and plumbers, including account status and verification.',
    },
    {
      title: 'Dealer Verification',
      description:
        'Verify dealer accounts and manage their access to the platform.',
    },
    {
      title: 'Product Management',
      description: 'Manage products, prices, categories and stock information.',
    },
    {
      title: 'Order Management',
      description:
        'View and manage customer and dealer orders and their status.',
    },
    {
      title: 'Payment Management',
      description:
        'Track direct payments, upfront payments and approved credit orders.',
    },
    {
      title: 'Dealer Credit',
      description:
        'Approve or restrict 30-day and 90-day credit eligibility for dealers.',
    },
    {
      title: 'Plumber Management',
      description: 'Verify plumbers and manage assigned activities and orders.',
    },
    {
      title: 'Reports',
      description:
        'View sales, orders, payments and other business-level reports.',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <Text style={styles.subtitle}>
        Manage users, products, orders, payments and dealer access.
      </Text>

      {adminFeatures.map(feature => (
        <View key={feature.title} style={styles.card}>
          <Text style={styles.cardTitle}>{feature.title}</Text>

          <Text style={styles.cardDescription}>{feature.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },

  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },

  cardDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

export default AdminDashboardScreen;
