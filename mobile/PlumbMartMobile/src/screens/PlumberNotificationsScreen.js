import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function PlumberNotificationsScreen() {
  const notifications = [
    {
      id: 1,
      title: 'New Activity Assigned',
      message: 'A new plumbing activity has been assigned to you.',
      time: 'Today',
    },
    {
      id: 2,
      title: 'Order Update',
      message: 'An order related to your assigned activity has been updated.',
      time: 'Today',
    },
    {
      id: 3,
      title: 'Welcome to PlumbMart',
      message: 'Your plumber account has been successfully verified.',
      time: 'Recently',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      {notifications.map(notification => (
        <View key={notification.id} style={styles.notificationCard}>
          <View style={styles.row}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>

            <Text style={styles.time}>{notification.time}</Text>
          </View>

          <Text style={styles.message}>{notification.message}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },

  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  notificationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  time: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 10,
  },

  message: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    lineHeight: 20,
  },
});

export default PlumberNotificationsScreen;
