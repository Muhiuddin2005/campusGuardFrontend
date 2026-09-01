import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { AppScreenProps } from '../../types';
import { colors, spacing, fontSize } from '../../theme/colors';

type Props = AppScreenProps<'Passcode'>;

export default function PasscodeScreen({ route, navigation }: Props) {
  const { passcode } = route.params;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDone = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Text style={styles.successEmoji}>✓</Text>
        </View>

        <Text style={styles.title}>Report Submitted</Text>
        <Text style={styles.subtitle}>
          Your report has been submitted anonymously.{'\n'}
          Save this passcode to track your report's status.
        </Text>

        <View style={styles.passcodeCard}>
          <Text style={styles.passcodeLabel}>YOUR PASSCODE</Text>
          <Text style={styles.passcode}>{passcode}</Text>
          <Pressable
            style={({ pressed }) => [styles.copyButton, pressed && styles.buttonPressed]}
            onPress={handleCopy}
          >
            <Text style={styles.copyButtonText}>
              {copied ? '✓ Copied!' : 'Copy to Clipboard'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>⚠️ Important</Text>
          <Text style={styles.warningText}>
            This passcode will NOT be shown again. If you lose it, you cannot track your report.
          </Text>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [styles.doneButton, pressed && styles.buttonPressed]}
        onPress={handleDone}
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.xxl,
    paddingTop: 80,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryDim,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  successEmoji: {
    color: colors.primary,
    fontSize: 36,
    fontWeight: '700',
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  passcodeCard: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: spacing.xl,
  },
  passcodeLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  passcode: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: spacing.lg,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  copyButton: {
    backgroundColor: colors.primaryDim,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
  },
  copyButtonText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  warningBox: {
    width: '100%',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: 12,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  warningTitle: {
    color: colors.warning,
    fontSize: fontSize.sm,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  warningText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  doneButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: colors.primaryText,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
