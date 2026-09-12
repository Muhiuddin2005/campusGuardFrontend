import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, fontSize, spacing } from '../theme/colors';

interface Props {
  msg?: string | null;
}

export const ErrorLabel: React.FC<Props> = ({ msg }) => {
  if (!msg) return null;

  return <Text style={styles.errorText}>{msg}</Text>;
};

const styles = StyleSheet.create({
  errorText: {
    color: colors.error,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
});