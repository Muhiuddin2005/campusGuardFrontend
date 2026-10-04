import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AppScreenProps } from '../../types';
import { colors, spacing, fontSize } from '../../theme/colors';

type Props = AppScreenProps<'Track'>;

export default function TrackScreen({ navigation }: Props) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = () => {
    setError('');

    const cleanPasscode = passcode.trim().toUpperCase();

    if (cleanPasscode.length !== 16) {
      setError('Passcode must be exactly 16 characters');
      return;
    }

    // Navigate to status screen with passcode
    navigation.navigate('ReportStatus', { passcode: cleanPasscode });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Track Your Report</Text>
        <Text style={styles.subtitle}>
          Enter the 16-character passcode you received when you submitted your report.
        </Text>

        <Text style={styles.label}>Passcode</Text>
        <TextInput
          style={[styles.input, passcode.length > 0 && styles.inputWithText]}
          placeholder="16-character passcode"
          placeholderTextColor={colors.textMuted}
          value={passcode}
          onChangeText={(text) => setPasscode(text.toUpperCase())}
          autoCapitalize="characters"
          maxLength={16}
          autoCorrect={false}
        />
        <Text style={styles.charCount}>{passcode.length}/16</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={({ pressed }) => [
            styles.trackButton,
            pressed && styles.buttonPressed,
            isLoading && styles.trackButtonDisabled,
          ]}
          onPress={handleTrack}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.primaryText} />
          ) : (
            <Text style={styles.trackButtonText}>Track Report</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
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
    fontSize: fontSize.md,
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  label: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    height: 56,
    paddingHorizontal: spacing.lg,
    color: colors.text,
    fontSize: fontSize.md,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  inputWithText: {
    fontSize: fontSize.lg,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 2,
    fontWeight: '700',
  },
  charCount: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  error: {
    color: colors.error,
    fontSize: fontSize.sm,
    marginTop: spacing.lg,
  },
  trackButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  trackButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  trackButtonText: {
    color: colors.primaryText,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
