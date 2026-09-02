import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppScreenProps, ReportStatus } from '../../types';
import { colors, spacing, fontSize } from '../../theme/colors';
import { getReportById, updateReportStatus } from '../../api/reports';

type Props = AppScreenProps<'ReportDetail'>;

const STATUSES: ReportStatus[] = ['SUBMITTED', 'UNDER_REVIEW', 'ACTION_TAKEN', 'RESOLVED', 'DISMISSED'];

export default function ReportDetailScreen({ route, navigation }: Props) {
  const { reportId } = route.params;
  const queryClient = useQueryClient();
  const [note, setNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | null>(null);

  const { data: report, isLoading } = useQuery({
    queryKey: ['report', reportId],
    queryFn: () => getReportById(reportId),
  });

  const mutation = useMutation({
    mutationFn: () => updateReportStatus(reportId, {
      status: selectedStatus || undefined,
      authorityNote: note.trim() || undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['report', reportId] });
      navigation.goBack();
    },
  });

  if (isLoading || !report) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>{report.category}</Text>
      <Text style={styles.date}>
        Submitted: {new Date(report.createdAt).toLocaleString()}
      </Text>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.body}>{report.description}</Text>
      </View>

      {report.incidentLocation && (
        <View style={styles.section}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.body}>{report.incidentLocation}</Text>
        </View>
      )}

      {/* Media/Evidence */}
      {report.media && report.media.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>Evidence ({report.media.length} images)</Text>
          <View style={styles.mediaRow}>
            {report.media.map((m: any) => (
              <Image
                key={m.id}
                source={{ uri: m.url }}
                style={styles.mediaImage}
                resizeMode="cover"
              />
            ))}
          </View>
        </View>
      )}

      {/* Current Status */}
      <View style={styles.section}>
        <Text style={styles.label}>Current Status</Text>
        <Text style={styles.status}>{report.status.replace('_', ' ')}</Text>
      </View>

      {/* Update Status */}
      <View style={styles.section}>
        <Text style={styles.label}>Update Status</Text>
        <View style={styles.statusRow}>
          {STATUSES.map((s) => (
            <Pressable
              key={s}
              style={[
                styles.statusChip,
                selectedStatus === s && styles.statusChipSelected,
              ]}
              onPress={() => setSelectedStatus(s)}
            >
              <Text style={[
                styles.statusChipText,
                selectedStatus === s && styles.statusChipTextSelected,
              ]}>
                {s.replace('_', ' ')}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Authority Note */}
      <View style={styles.section}>
        <Text style={styles.label}>Authority Note (optional)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Add a note..."
          placeholderTextColor={colors.textMuted}
          multiline
          value={note}
          onChangeText={setNote}
        />
      </View>

      {/* Chat Button */}
      <Pressable
        style={({ pressed }) => [styles.chatButton, pressed && styles.buttonPressed]}
        onPress={() => navigation.navigate('AuthChat', { reportId })}
      >
        <Text style={styles.chatButtonText}>Chat with Reporter</Text>
      </Pressable>

      {/* Save Button */}
      <Pressable
        style={({ pressed }) => [
          styles.saveButton,
          pressed && styles.buttonPressed,
          mutation.isPending && styles.buttonDisabled,
        ]}
        onPress={() => mutation.mutate()}
        disabled={mutation.isPending || (!selectedStatus && !note.trim())}
      >
        {mutation.isPending ? (
          <ActivityIndicator color={colors.primaryText} />
        ) : (
          <Text style={styles.saveButtonText}>Save Changes</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.xxl,
    paddingTop: 60,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: spacing.xs,
  },
  date: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  body: {
    color: colors.text,
    fontSize: fontSize.md,
    lineHeight: 24,
  },
  mediaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  mediaImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  status: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statusChip: {
    backgroundColor: colors.inputBg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusChipText: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },
  statusChipTextSelected: {
    color: colors.primaryText,
    fontWeight: '600',
  },
  textArea: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.lg,
    color: colors.text,
    fontSize: fontSize.md,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  chatButton: {
    backgroundColor: colors.info,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  chatButtonText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  saveButtonText: {
    color: colors.primaryText,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
