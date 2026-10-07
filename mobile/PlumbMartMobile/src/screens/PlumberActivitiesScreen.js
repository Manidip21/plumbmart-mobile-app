import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function PlumberActivitiesScreen() {
  const activities = [
    {
      id: 1,
      title: 'Kitchen Faucet Installation',
      customer: 'Customer #1001',
      location: 'Hyderabad',
      status: 'Assigned',
    },
    {
      id: 2,
      title: 'Bathroom Tap Replacement',
      customer: 'Customer #1002',
      location: 'Hyderabad',
      status: 'In Progress',
    },
    {
      id: 3,
      title: 'Water Tank Inspection',
      customer: 'Customer #1003',
      location: 'Hyderabad',
      status: 'Assigned',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assigned Activities</Text>

      {activities.map(activity => (
        <View key={activity.id} style={styles.activityCard}>
          <View style={styles.row}>
            <Text style={styles.activityTitle}>{activity.title}</Text>

            <Text style={styles.status}>{activity.status}</Text>
          </View>

          <Text style={styles.detail}>Customer: {activity.customer}</Text>

          <Text style={styles.detail}>Location: {activity.location}</Text>
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

  activityCard: {
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
    alignItems: 'flex-start',
  },

  activityTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginRight: 10,
  },

  status: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },

  detail: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
});

export default PlumberActivitiesScreen;
