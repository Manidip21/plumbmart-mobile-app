import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

function PlumberProfileScreen() {
  const user = useSelector(state => state.auth.user);

  const name = user?.name || 'Test Plumber';
  const mobile = user?.mobile || 'Not available';
  const role = user?.role || 'PLUMBER';
  const initial = name.charAt(0).toUpperCase();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>
            View your account and verification details
          </Text>
        </View>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>

        <Text style={styles.name}>{name}</Text>

        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>PLUMBER</Text>
        </View>

        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedIcon}>✓</Text>
          <Text style={styles.verifiedText}>Verified Account</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Account Information</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>☎</Text>
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.label}>Mobile Number</Text>
            <Text style={styles.value}>{mobile}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>P</Text>
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.label}>Account Type</Text>
            <Text style={styles.value}>Plumber</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>✓</Text>
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.label}>Verification Status</Text>
            <Text style={styles.verifiedValue}>Verified</Text>
          </View>
        </View>
      </View>

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>Profile Information</Text>
        <Text style={styles.noteText}>
          Your profile details are linked to your verified PlumbMart account.
          Profile editing can be connected to backend APIs in a production
          implementation.
        </Text>
      </View>
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
    paddingBottom: 32,
  },

  header: {
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
  },

  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  avatarText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#334155',
  },

  name: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111827',
  },

  roleBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 8,
  },

  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.5,
  },

  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  verifiedIcon: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16a34a',
    marginRight: 5,
  },

  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },

  sectionHeader: {
    marginTop: 24,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },

  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  infoIconText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },

  infoContent: {
    flex: 1,
  },

  label: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 3,
  },

  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  verifiedValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#16a34a',
  },

  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },

  noteCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  noteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },

  noteText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#64748b',
  },
});

export default PlumberProfileScreen;
