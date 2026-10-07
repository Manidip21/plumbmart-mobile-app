import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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

  const getStatusStyle = status => {
    if (status === 'In Progress') {
      return {
        backgroundColor: '#fef3c7',
        color: '#92400e',
      };
    }

    if (status === 'Completed') {
      return {
        backgroundColor: '#dcfce7',
        color: '#166534',
      };
    }

    return {
      backgroundColor: '#dbeafe',
      color: '#1d4ed8',
    };
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Assigned Activities</Text>

        <Text style={styles.subtitle}>
          View your assigned service activities and their current status.
        </Text>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>{activities.length} Activities</Text>
        </View>
      </View>

      {activities.map(activity => {
        const statusStyle = getStatusStyle(activity.status);

        return (
          <View key={activity.id} style={styles.activityCard}>
            <View style={styles.topRow}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityIconText}>A</Text>
              </View>

              <View style={styles.titleContainer}>
                <Text style={styles.activityTitle}>{activity.title}</Text>

                <Text style={styles.activityId}>Activity #{activity.id}</Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusStyle.backgroundColor },
                ]}
              >
                <Text style={[styles.statusText, { color: statusStyle.color }]}>
                  {activity.status}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Customer</Text>
              <Text style={styles.detailValue}>{activity.customer}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{activity.location}</Text>
            </View>
          </View>
        );
      })}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Activity Updates</Text>

        <Text style={styles.infoText}>
          Activity assignment and status updates are represented as MVP sample
          data in this version.
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
    marginTop: 7,
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

  activityCard: {
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

  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 11,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  activityIconText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#374151',
  },

  titleContainer: {
    flex: 1,
    marginRight: 8,
  },

  activityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 21,
  },

  activityId: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 3,
  },

  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 14,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 7,
  },

  detailLabel: {
    fontSize: 13,
    color: '#64748b',
  },

  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
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

export default PlumberActivitiesScreen;
