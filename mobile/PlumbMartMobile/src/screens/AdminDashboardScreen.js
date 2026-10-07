import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { clearAuthData } from '../store/authSlice';
import { clearAuthData as clearStoredAuthData } from '../utils/authStorage';

function AdminDashboardScreen() {
  const dispatch = useDispatch();

  const adminFeatures = [
    {
      icon: 'U',
      title: 'User Management',
      description:
        'Manage customers, dealers and plumbers, including account status and verification.',
    },
    {
      icon: 'D',
      title: 'Dealer Verification',
      description:
        'Verify dealer accounts and manage their access to the platform.',
    },
    {
      icon: 'P',
      title: 'Product Management',
      description: 'Manage products, prices, categories and stock information.',
    },
    {
      icon: 'O',
      title: 'Order Management',
      description:
        'View and manage customer and dealer orders and their status.',
    },
    {
      icon: '₹',
      title: 'Payment Management',
      description:
        'Track direct payments, upfront payments and approved credit orders.',
    },
    {
      icon: 'C',
      title: 'Dealer Credit',
      description:
        'Approve or restrict 30-day and 90-day credit eligibility for dealers.',
    },
    {
      icon: 'A',
      title: 'Plumber Management',
      description: 'Verify plumbers and manage assigned activities and orders.',
    },
    {
      icon: 'R',
      title: 'Reports',
      description:
        'View sales, orders, payments and other business-level reports.',
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearStoredAuthData();
              dispatch(clearAuthData());
            } catch (error) {
              console.log('Logout error:', error);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>
            Manage the PlumbMart platform and operations.
          </Text>
        </View>

        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>ADMIN</Text>
        </View>
      </View>

      <View style={styles.overviewCard}>
        <View style={styles.overviewIcon}>
          <Text style={styles.overviewIconText}>A</Text>
        </View>

        <View style={styles.overviewContent}>
          <Text style={styles.overviewTitle}>Administration</Text>
          <Text style={styles.overviewText}>
            Access key areas for users, products, orders, payments and dealer
            management.
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Management Areas</Text>

      {adminFeatures.map(feature => (
        <View key={feature.title} style={styles.card}>
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>{feature.icon}</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{feature.title}</Text>

            <Text style={styles.cardDescription}>{feature.description}</Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </View>
      ))}

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>Admin MVP</Text>

        <Text style={styles.noteText}>
          This dashboard provides the required Admin management overview.
          Individual management modules can be connected to CRUD APIs and
          reporting endpoints in a production implementation.
        </Text>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 35,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 5,
    lineHeight: 20,
    maxWidth: 260,
  },

  adminBadge: {
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 6,
    marginTop: 2,
  },

  adminBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.5,
  },

  overviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },

  overviewIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  overviewIconText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#334155',
  },

  overviewContent: {
    flex: 1,
  },

  overviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  overviewText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginTop: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 15,
    marginBottom: 11,
  },

  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  cardIconText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },

  cardDescription: {
    fontSize: 12.5,
    color: '#64748b',
    lineHeight: 18,
  },

  arrow: {
    fontSize: 25,
    color: '#94a3b8',
    marginLeft: 8,
  },

  noteCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    marginTop: 5,
  },

  noteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },

  noteText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 19,
  },

  logoutButton: {
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 20,
  },

  logoutButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#dc2626',
  },
});

export default AdminDashboardScreen;
