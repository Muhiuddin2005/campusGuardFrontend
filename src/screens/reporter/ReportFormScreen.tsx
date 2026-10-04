import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  AppState,
  Alert,
} from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { AppScreenProps, IncidentCategory } from '../../types';
import { colors, spacing, fontSize } from '../../theme/colors';
import { createReport } from '../../api/reports';
import { useReportDraft } from '../../contexts/ReportDraftContext';

type Props = AppScreenProps<'ReportForm'>;

const CATEGORIES: { value: IncidentCategory; label: string }[] = [
  { value: 'RAGGING', label: 'Ragging' },
  { value: 'HARASSMENT', label: 'Harassment' },
  { value: 'STALKING', label: 'Stalking' },
  { value: 'THREATS', label: 'Threats' },
  { value: 'CYBERBULLYING', label: 'Cyberbullying' },
  { value: 'OTHER', label: 'Other' },
];

export default function ReportFormScreen({ navigation }: Props) {
  const { draft, updateDraft, clearDraft } = useReportDraft();
  const [error, setError] = useState('');

  // Security: App background-e gele draft muche jabe
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        clearDraft();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [clearDraft]);

  const mutation = useMutation({
    mutationFn: createReport,
    onSuccess: (data) => {
      clearDraft();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Passcode', params: { passcode: data.passcode } }],
      });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Failed to submit report';
      setError(message);
    },
  });

  const pickImages = () => {
    Alert.alert(
      'Native Module Required',
      'Image picker native module is not compiled into the current development build APK. You can submit the incident report via text right now, or test image attachments after a new APK rebuild.'
    );
  };

  const handleSubmit = async () => {
    setError('');

    if (!draft.category) {
      setError('Please select a category');
      return;
    }

    if (!draft.description || draft.description.trim().length < 20) {
      setError('Please describe the incident in more detail (minimum 20 characters)');
      return;
    }

    mutation.mutate({
      category: draft.category,
      description: draft.description.trim(),
      incidentLocation: draft.incidentLocation?.trim() || undefined,
      occurredAt: draft.occurredAt || undefined,
    });
  };

  const isSubmitting = mutation.isPending;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Report an Incident</Text>
        <Text style={styles.subtitle}>All fields are anonymous. No personal data is stored.</Text>

        <Text style={styles.label}>Category *</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.value}
              style={[
                styles.chip,
                draft.category === cat.value && styles.chipSelected,
              ]}
              onPress={() => updateDraft({ category: cat.value })}
            >
              <Text
                style={[
                  styles.chipText,
                  draft.category === cat.value && styles.chipTextSelected,
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Description * (min 20 characters)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe what happened..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          value={draft.description}
          onChangeText={(text) => updateDraft({ description: text })}
        />
        <Text style={styles.charCount}>{draft.description.length} characters</Text>

        <Text style={styles.label}>Location (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Hall 5, Library, Cafeteria..."
          placeholderTextColor={colors.textMuted}
          value={draft.incidentLocation || ''}
          onChangeText={(text) => updateDraft({ incidentLocation: text })}
        />

        <Text style={styles.label}>Evidence (optional)</Text>
        <Pressable
          style={({ pressed }) => [styles.imagePickerButton, pressed && styles.buttonPressed]}
          onPress={pickImages}
        >
          <Text style={styles.imagePickerText}>+ Add Images</Text>
        </Pressable>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.buttonPressed,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <View style={styles.submitLoading}>
              <ActivityIndicator color={colors.primaryText} />
              <Text style={styles.submitButtonText}>Submitting...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Submit Report</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xxl,
    paddingTop: 60,
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
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: spacing.xxl,
  },
  label: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.inputBg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  chipTextSelected: {
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
    minHeight: 120,
  },
  charCount: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.lg,
    color: colors.text,
    fontSize: fontSize.md,
  },
  imagePickerButton: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    borderStyle: 'dashed',
    padding: spacing.lg,
    alignItems: 'center',
  },
  imagePickerText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  error: {
    color: colors.error,
    fontSize: fontSize.sm,
    marginTop: spacing.lg,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  submitLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  submitButtonText: {
    color: colors.primaryText,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.7,
  },
});