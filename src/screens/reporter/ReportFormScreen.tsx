import React, { useState, useEffect, useRef } from 'react';
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
  Image,
} from 'react-native';
import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { AppScreenProps, IncidentCategory } from '../../types';
import { colors, spacing, fontSize } from '../../theme/colors';
import { createReport } from '../../api/reports';
import { uploadFile } from '../../api/fileUpload';
import { useReportDraft } from '../../contexts/ReportDraftContext';

type Props = AppScreenProps<'ReportForm'>;

type SelectedImage = {
  uri: string;
  fileName: string;
  mimeType: string;
};

const CATEGORIES: { value: IncidentCategory; label: string }[] = [
  { value: 'RAGGING', label: 'Ragging' },
  { value: 'HARASSMENT', label: 'Harassment' },
  { value: 'STALKING', label: 'Stalking' },
  { value: 'THREATS', label: 'Threats' },
  { value: 'CYBERBULLYING', label: 'Cyberbullying' },
  { value: 'OTHER', label: 'Other' },
];

export default function ReportFormScreen({ navigation }: Props) {
  const { draft, updateDraft, clearDraft, setIsPickingMedia } = useReportDraft();
  const [error, setError] = useState('');
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const isPickingImageRef = useRef(false);

  // Security: App background-e gele draft muche jabe (unless user is in system image picker)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      // Do not wipe draft if app transitioned to background to open image picker
      if (isPickingImageRef.current) {
        return;
      }
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        clearDraft();
        setImages([]);
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
      setImages([]);
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

  const pickImages = async () => {
    try {
      isPickingImageRef.current = true;
      setIsPickingMedia(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 5,
      });

      if (!result.canceled && result.assets) {
        const newImages: SelectedImage[] = result.assets.map((asset) => ({
          uri: asset.uri,
          fileName: asset.fileName || `image_${Date.now()}.jpg`,
          mimeType: asset.mimeType || 'image/jpeg',
        }));
        setImages((prev) => [...prev, ...newImages].slice(0, 5));
      }
    } catch (err: any) {
      console.warn('Image picker error:', err);
    } finally {
      // Allow time for app to return to 'active' before clearing picking state
      setTimeout(() => {
        isPickingImageRef.current = false;
        setIsPickingMedia(false);
      }, 1500);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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

    try {
      setIsUploading(true);

      // Upload images first
      const mediaKeys: string[] = [];
      for (const img of images) {
        const result = await uploadFile(img.uri, img.fileName, img.mimeType);
        mediaKeys.push(result.storageKey);
      }

      setIsUploading(false);

      // Submit report with media keys
      mutation.mutate({
        category: draft.category,
        description: draft.description.trim(),
        incidentLocation: draft.incidentLocation?.trim() || undefined,
        occurredAt: draft.occurredAt || undefined,
        mediaKeys: mediaKeys.length > 0 ? mediaKeys : undefined,
      });
    } catch (err: any) {
      setIsUploading(false);
      setError(err.response?.data?.message || 'Failed to upload images');
    }
  };

  const isSubmitting = isUploading || mutation.isPending;

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

        <Text style={styles.label}>Evidence (optional, max 5 images)</Text>
        <Pressable
          style={({ pressed }) => [styles.imagePickerButton, pressed && styles.buttonPressed]}
          onPress={pickImages}
          disabled={images.length >= 5}
        >
          <Text style={styles.imagePickerText}>
            {images.length >= 5 ? 'Max images reached' : '+ Add Images'}
          </Text>
        </Pressable>

        {images.length > 0 && (
          <View style={styles.imageRow}>
            {images.map((img, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: img.uri }} style={styles.imageThumbnail} />
                <Pressable
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Text style={styles.removeImageText}>×</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

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
              <Text style={styles.submitButtonText}>
                {isUploading ? 'Uploading...' : 'Submitting...'}
              </Text>
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
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textMuted,
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
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
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
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  imageContainer: {
    position: 'relative',
  },
  imageThumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
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