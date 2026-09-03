import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppNavigation, RootStackParamList } from '../types';
import { colors } from '../theme/colors';

import HomeScreen from '../screens/reporter/HomeScreen';
import ReportFormScreen from '../screens/reporter/ReportFormScreen';
import PasscodeScreen from '../screens/reporter/PasscodeScreen';
import TrackScreen from '../screens/reporter/TrackScreen';
import ReportStatusScreen from '../screens/reporter/ReportStatusScreen';
import ChatScreen from '../screens/reporter/ChatScreen';
import LoginScreen from '../screens/authority/LoginScreen';
import DashboardScreen from '../screens/authority/DashboardScreen';
import ReportDetailScreen from '../screens/authority/ReportDetailScreen';
import AuthChatScreen from '../screens/authority/AuthChatScreen';

type RouteName = keyof RootStackParamList;
type StackEntry = { name: RouteName; params?: object };

const SCREENS: Record<RouteName, React.ComponentType<any>> = {
  Home: HomeScreen,
  ReportForm: ReportFormScreen,
  Passcode: PasscodeScreen,
  Track: TrackScreen,
  ReportStatus: ReportStatusScreen,
  Chat: ChatScreen,
  AuthLogin: LoginScreen,
  Dashboard: DashboardScreen,
  ReportDetail: ReportDetailScreen,
  AuthChat: AuthChatScreen,
};

export default function RootNavigator() {
  const [stack, setStack] = useState<StackEntry[]>([{ name: 'Home' }]);
  const current = stack[stack.length - 1];
  const Screen = SCREENS[current.name];

  const navigation = useMemo<AppNavigation>(
    () => ({
      navigate: (name, params?) => {
        setStack((prev) => [...prev, { name, params }]);
      },
      goBack: () => {
        setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
      },
      reset: ({ routes }) => {
        setStack(
          routes.map((route) => ({
            name: route.name,
            params: route.params,
          }))
        );
      },
    }),
    []
  );

  return (
    <View style={styles.root}>
      <Screen
        navigation={navigation}
        route={{ params: (current.params ?? {}) as never }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
