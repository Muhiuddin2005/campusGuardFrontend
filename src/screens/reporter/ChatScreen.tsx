import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppScreenProps, Message } from '../../types';
import { colors, spacing, fontSize } from '../../theme/colors';
import { getReporterThread, sendReporterMessage } from '../../api/messages';

type Props = AppScreenProps<'Chat'>;

export default function ChatScreen({ route, navigation }: Props) {
  const { passcode } = route.params;
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['chat', passcode],
    queryFn: () => getReporterThread(passcode),
    refetchInterval: 10000, // Poll every 10s
  });

  const mutation = useMutation({
    mutationFn: (body: string) => sendReporterMessage(passcode, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', passcode] });
      setMessage('');
    },
  });

  const handleSend = () => {
    const text = message.trim();
    if (!text) return;
    mutation.mutate(text);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Anonymous Chat</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListEmptyComponent={
          <Text style={styles.empty}>No messages yet. Start the conversation.</Text>
        }
        renderItem={({ item }: { item: Message }) => (
          <View
            style={[
              styles.bubble,
              item.sender === 'REPORTER' ? styles.bubbleRight : styles.bubbleLeft,
            ]}
          >
            <Text style={styles.bubbleText}>{item.body}</Text>
            <Text style={styles.bubbleTime}>
              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}
      />

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
        />
        <Pressable
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={mutation.isPending || !message.trim()}
        >
          {mutation.isPending ? (
            <ActivityIndicator color={colors.primaryText} size="small" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
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
  centered: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 50,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  backText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  messageList: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  empty: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: 40,
  },
  bubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  bubbleLeft: {
    backgroundColor: colors.card,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  bubbleRight: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    color: colors.text,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  bubbleTime: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.inputBg,
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    color: colors.text,
    fontSize: fontSize.sm,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  sendButtonText: {
    color: colors.primaryText,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});
