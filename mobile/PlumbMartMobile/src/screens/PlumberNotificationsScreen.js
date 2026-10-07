import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

function PlumberNotificationsScreen() {
  const notifications = [
    {
      id: 1,
      title: 'New Activity Assigned',
      message: 'A new plumbing activity has been assigned to you.',
      time: 'Today',
      type: 'activity',
    },
    {
      id: 2,
      title: 'Order Update',
      message: 'An order related to your assigned activity has been updated.',
      time: 'Today',
      type: 'order',
    },
    {
      id: 3,
      title: 'Welcome to PlumbMart',
      message: 'Your plumber account has been successfully verified.',
      time: 'Recently',
      type: 'account',
    },
  ];

  const getIcon = type => {
    switch (type) {
      case 'activity':
        return 'A';
      case 'order':
        return 'O';
      default:
        return 'P';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>

        <Text style={styles.subtitle}>
          Stay updated with activities and account information.
        </Text>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {notifications.length} Notifications
          </Text>
        </View>
      </View>

      {notifications.map(notification => (
        <View key={notification.id} style={styles.notificationCard}>
          <View style={styles.topRow}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>{getIcon(notification.type)}</Text>
            </View>

            <View style={styles.content}>
              <View style={styles.titleRow}>
                <Text style={styles.notificationTitle}>
                  {notification.title}
                </Text>

                <Text style={styles.time}>{notification.time}</Text>
              </View>

              <Text style={styles.message}>{notification.message}</Text>
            </View>
          </View>
        </View>
      ))}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Notification Updates</Text>

        <Text style={styles.infoText}>
          Notifications are represented as MVP sample data in this version. A
          production implementation can connect this section to backend
          notifications and push notifications.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 30,
  },

  header: {
    marginBottom: 18,
  },

  title: {
    fontSize: 27,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginTop: 6,
  },

  countBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
  },

  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 11,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  iconText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#374151',
  },

  content: {
    flex: 1,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  notificationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 21,
  },

  time: {
    fontSize: 11,
    color: '#9ca3af',
    marginLeft: 8,
  },

  message: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 6,
    lineHeight: 19,
  },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },

  infoText: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
});

export default PlumberNotificationsScreen;
