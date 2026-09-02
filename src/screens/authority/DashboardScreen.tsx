import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { AppScreenProps, ReportStatus, Report } from '../../types';
import { colors, spacing, fontSize } from '../../theme/colors';
import { getAllReports } from '../../api/reports';
import { useAuth } from '../../contexts/AuthContext';

type ReportListItem = Pick<Report, 'id' | 'category' | 'description' | 'status' | 'createdAt'>;

type Props = AppScreenProps<'Dashboard'>;

const STATUS_COLORS: Record<ReportStatus, string> = {
  SUBMITTED: colors.info,
  UNDER_REVIEW: colors.warning,
  ACTION_TAKEN: colors.primary,
  RESOLVED: colors.success,
  DISMISSED: colors.textMuted,
};

export default function DashboardScreen({ navigation }: Props) {
  const { user, logout } = useAuth();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['reports'],
    queryFn: () => getAllReports(),
  });

  const reports = data?.data || [];

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome, {user?.name}</Text>
          <Text style={styles.role}>{user?.role}</Text>
        </View>
        <Pressable onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Reports ({reports.length})</Text>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }: { item: ReportListItem }) => (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => navigation.navigate('ReportDetail', { reportId: item.id })}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.category}>{item.category}</Text>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] + '20' }]}>
                <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>
                  {item.status.replace('_', ' ')}
                </Text>
              </View>
            </View>
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No reports yet</Text>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xxl,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  welcome: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  role: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  logout: {
    color: colors.error,
    fontSize: fontSize.sm,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    padding: spacing.xxl,
    paddingBottom: spacing.md,
  },
  list: {
    padding: spacing.xxl,
    paddingTop: 0,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cardPressed: {
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  category: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: 10,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  date: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  empty: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    textAlign: 'center',
    marginTop: 40,
  },
});
