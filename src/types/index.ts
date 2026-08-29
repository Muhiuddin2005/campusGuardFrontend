// Enums matching backend Prisma schema
export type IncidentCategory =
  | 'RAGGING'
  | 'HARASSMENT'
  | 'STALKING'
  | 'THREATS'
  | 'CYBERBULLYING'
  | 'OTHER';

export type ReportStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ACTION_TAKEN'
  | 'RESOLVED'
  | 'DISMISSED';

export type MessageSender = 'REPORTER' | 'AUTHORITY';

// API Payloads
export type CreateReportPayload = {
  category: IncidentCategory;
  description: string;
  incidentLocation?: string;
  occurredAt?: string;
  mediaKeys?: string[];
};

export type CreateReportResponse = {
  passcode: string;
  reportId: string;
};

export type TrackReportPayload = {
  passcode: string;
};

export type ReportMedia = {
  id: string;
  storageKey: string;
  fileType?: string;
  fileSize?: number;
  url?: string;
  createdAt: string;
};

export type Report = {
  id: string;
  category: IncidentCategory;
  description: string;
  incidentLocation?: string;
  occurredAt?: string;
  status: ReportStatus;
  authorityNote?: string;
  createdAt: string;
  updatedAt: string;
  media: ReportMedia[];
};

export type Message = {
  id: string;
  reportId: string;
  sender: MessageSender;
  body: string;
  createdAt: string;
};

// Auth types
export type AuthorityLoginPayload = {
  email: string;
  password: string;
};

export type AuthorityLoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'AUTHORITY' | 'ADMIN';
  };
};

export type AuthorityProfile = {
  id: string;
  email: string;
  name: string;
  role: 'AUTHORITY' | 'ADMIN';
  createdAt: string;
};

// Navigation types (JS stack — no native-stack, works on the existing dev APK)
export type RootStackParamList = {
  Home: undefined;
  ReportForm: undefined;
  Passcode: { passcode: string };
  Track: undefined;
  ReportStatus: { passcode: string };
  Chat: { passcode: string };
  AuthLogin: undefined;
  Dashboard: undefined;
  ReportDetail: { reportId: string };
  AuthChat: { reportId: string };
};

export type AppRoute<Name extends keyof RootStackParamList> = {
  params: RootStackParamList[Name];
};

export type AppNavigation = {
  navigate: <Name extends keyof RootStackParamList>(
    name: Name,
    ...args: RootStackParamList[Name] extends undefined
      ? [] | [undefined]
      : [RootStackParamList[Name]]
  ) => void;
  goBack: () => void;
  reset: (state: {
    index: number;
    routes: Array<{ name: keyof RootStackParamList; params?: object }>;
  }) => void;
};

export type AppScreenProps<Name extends keyof RootStackParamList> = {
  navigation: AppNavigation;
  route: AppRoute<Name>;
};
