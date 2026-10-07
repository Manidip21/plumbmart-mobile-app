import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { clearAuthData } from '../store/authSlice';
import { clearAuthData as clearStoredAuthData } from '../utils/authStorage';

function PlumberDashboardScreen({ navigation }) {
  const dispatch = useDispatch();

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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>P</Text>
        </View>

        <Text style={styles.title}>Plumber Dashboard</Text>

        <Text style={styles.subtitle}>
          Manage your assigned activities, orders and account.
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
          android_ripple={{ color: '#e5e7eb' }}
          onPress={() => navigation.navigate('PlumberActivities')}
        >
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>A</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Assigned Activities</Text>
            <Text style={styles.cardSubtitle}>View your assigned work</Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
          android_ripple={{ color: '#e5e7eb' }}
          onPress={() => navigation.navigate('PlumberOrders')}
        >
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>O</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Orders</Text>
            <Text style={styles.cardSubtitle}>View related orders</Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
          android_ripple={{ color: '#e5e7eb' }}
          onPress={() => navigation.navigate('PlumberNotifications')}
        >
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>N</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Notifications</Text>
            <Text style={styles.cardSubtitle}>View your notifications</Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
          android_ripple={{ color: '#e5e7eb' }}
          onPress={() => navigation.navigate('PlumberProfile')}
        >
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>P</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Profile</Text>
            <Text style={styles.cardSubtitle}>Manage your account</Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.logoutButtonPressed,
        ]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },

  header: {
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 28,
  },

  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  iconText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
  },

  title: {
    fontSize: 27,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 10,
  },

  cardContainer: {
    gap: 12,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
  },

  pressedCard: {
    opacity: 0.75,
  },

  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  cardIconText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#374151',
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  cardSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 18,
  },

  arrow: {
    fontSize: 28,
    color: '#9ca3af',
    marginLeft: 10,
  },

  logoutButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },

  logoutButtonPressed: {
    opacity: 0.7,
  },

  logoutText: {
    color: '#dc2626',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default PlumberDashboardScreen;
