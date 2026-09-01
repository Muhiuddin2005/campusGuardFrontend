import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { AppScreenProps } from '../../types';
import { colors, spacing, fontSize } from '../../theme/colors';

type Props = AppScreenProps<'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CAMPUSGUARD</Text>
        {/* Hidden login: Long press title to access authority login */}
        <Pressable onLongPress={() => navigation.navigate('AuthLogin')} delayLongPress={1500}>
          <Text style={styles.title}>Anonymous Incident Reporting</Text>
        </Pressable>
        <Text style={styles.subtitle}>
          Report campus incidents safely and anonymously. Your identity is never stored.
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
          onPress={() => navigation.navigate('ReportForm')}
        >
          <Text style={styles.primaryButtonText}>Report an Incident</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={() => navigation.navigate('Track')}
        >
          <Text style={styles.secondaryButtonText}>Track Existing Report</Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>
        Your report is encrypted and anonymous.{'\n'}
        Save your passcode to track status.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.xxl,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 48,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    lineHeight: 24,
  },
  buttonGroup: {
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.primaryText,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  footer: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: 48,
    lineHeight: 22,
  },
});
