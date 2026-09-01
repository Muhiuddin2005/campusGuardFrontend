import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { AppScreenProps, ReportStatus } from '../../types';
import { colors, spacing, fontSize } from '../../theme/colors';
import { trackReport } from '../../api/reports';

type Props = AppScreenProps<'ReportStatus'>;

const STATUS_CONFIG: Record<ReportStatus, { label: string; color: string; bgColor: string }> = {
  SUBMITTED: { label: 'Submitted', color: colors.info, bgColor: 'rgba(96, 165, 250, 0.15)' },
  UNDER_REVIEW: { label: 'Under Review', color: colors.warning, bgColor: 'rgba(251, 191, 36, 0.15)' },
  ACTION_TAKEN: { label: 'Action Taken', color: colors.primary, bgColor: colors.primaryDim },
  RESOLVED: { label: 'Resolved', color: colors.success, bgColor: 'rgba(74, 222, 128, 0.15)' },
  DISMISSED: { label: 'Dismissed', color: colors.textMuted, bgColor: 'rgba(100, 116, 139, 0.15)' },
};

export default function ReportStatusScreen({ route, navigation }: Props) {
  const { passcode } = route.params;

  const { data: report, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['report', passcode],
    queryFn: () => trackReport({ passcode }),
  });

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading report...</Text>
      </View>
    );
  }

  if (error || !report) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Report Not Found</Text>
        <Text style={styles.errorText}>
          No report found with this passcode. Please check and try again.
        </Text>
        <Pressable
          style={({ pressed }) => [styles.retryButton, pressed && styles.buttonPressed]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  const statusConfig = STATUS_CONFIG[report.status];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={colors.primary}
        />
      }
    >
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Report Status</Text>

      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
        <Text style={[styles.statusText, { color: statusConfig.color }]}>
          {statusConfig.label}
        </Text>
      </View>

      {/* Report Details */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>{report.category.replace('_', ' ')}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Submitted</Text>
          <Text style={styles.value}>
            {new Date(report.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {report.incidentLocation && (
          <>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{report.incidentLocation}</Text>
            </View>
          </>
        )}

        <View style={styles.divider} />

        <Text style={styles.label}>Description</Text>
        <Text style={styles.description}>{report.description}</Text>
      </View>

      {/* Authority Note */}
      {report.authorityNote && (
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Authority Response</Text>
          <Text style={styles.noteText}>{report.authorityNote}</Text>
        </View>
      )}

      {/* Pull to refresh hint */}
      <Text style={styles.hint}>Pull down to refresh status</Text>

      {/* Chat Button */}
      <Pressable
        style={({ pressed }) => [styles.chatButton, pressed && styles.buttonPressed]}
        onPress={() => navigation.navigate('Chat', { passcode })}
      >
        <Text style={styles.chatButtonText}>Chat with Authority</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.homeButton, pressed && styles.buttonPressed]}
        onPress={handleGoHome}
      >
        <Text style={styles.homeButtonText}>Back to Home</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    padding: spacing.xxl,
    paddingTop: 60,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginTop: spacing.lg,
  },
  errorTitle: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: 10,
  },
  retryButtonText: {
    color: colors.primaryText,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  backButton: {
    marginBottom: spacing.lg,
  },
  backText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    marginBottom: spacing.xl,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  value: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    marginVertical: spacing.sm,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  noteCard: {
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    borderRadius: 12,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  noteTitle: {
    color: colors.info,
    fontSize: fontSize.sm,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  noteText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 22,
  },
  hint: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  chatButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  chatButtonText: {
    color: colors.primaryText,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  homeButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  homeButtonText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
