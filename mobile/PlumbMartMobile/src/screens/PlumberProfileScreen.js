import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

function PlumberProfileScreen() {
  const user = useSelector(state => state.auth.user);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || 'P'}
          </Text>
        </View>

        <Text style={styles.name}>{user?.name || 'Test Plumber'}</Text>

        <Text style={styles.role}>{user?.role || 'PLUMBER'}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Mobile Number</Text>
        <Text style={styles.value}>{user?.mobile || 'Not available'}</Text>

        <Text style={styles.label}>Account Type</Text>
        <Text style={styles.value}>Plumber</Text>

        <Text style={styles.label}>Verification Status</Text>
        <Text style={styles.verified}>Verified</Text>
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
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },

  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },

  role: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  label: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 10,
  },

  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 3,
  },

  verified: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16a34a',
    marginTop: 3,
  },
});

export default PlumberProfileScreen;
