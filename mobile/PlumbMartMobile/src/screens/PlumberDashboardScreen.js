import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

function PlumberDashboardScreen({ navigation }) {
  const handleComingSoon = feature => {
    Alert.alert(feature, `${feature} will be available here.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plumber Dashboard</Text>

      <Text style={styles.subtitle}>
        Manage your assigned activities, orders and account.
      </Text>

      <View style={styles.cardContainer}>
        <Pressable
          style={styles.card}
          onPress={() => navigation.navigate('PlumberActivities')}
        >
          <Text style={styles.icon}>📋</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Assigned Activities</Text>
            <Text style={styles.cardSubtitle}>View your assigned work</Text>
          </View>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => navigation.navigate('PlumberOrders')}
        >
          <Text style={styles.icon}>📦</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Orders</Text>
            <Text style={styles.cardSubtitle}>View related orders</Text>
          </View>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => navigation.navigate('PlumberNotifications')}
        >
          <Text style={styles.icon}>🔔</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Notifications</Text>
            <Text style={styles.cardSubtitle}>View your notifications</Text>
          </View>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => navigation.navigate('PlumberProfile')}
        >
          <Text style={styles.icon}>👤</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Profile</Text>
            <Text style={styles.cardSubtitle}>Manage your account</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
  },

  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 8,
    marginBottom: 24,
  },

  cardContainer: {
    gap: 12,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  icon: {
    fontSize: 28,
    marginRight: 16,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },

  cardSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
});

export default PlumberDashboardScreen;
