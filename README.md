# CampusGuard - Mobile Application (Frontend)

CampusGuard is a mobile client built with React Native and Expo designed for university campuses. It empowers students, faculty, and campus community members to report incidents anonymously, track investigations securely with private passcodes, and communicate directly with safety officers in real-time.

---

## 📱 Features

### 🛡️ For Students / Reporters (Anonymous Access)
- **Anonymous Incident Reporting**: Submit detailed reports across categories (Harassment, Theft, Vandalism, Safety Hazard, Emergency, etc.) without revealing identity.
- **Media Attachments**: Capture or attach photos, videos, and audio evidence securely.
- **Private Passcode Generation**: Automatic generation of unique secret passcodes for report tracking.
- **Investigation Tracking**: Live status updates with visual progression milestones (Submitted, Reviewing, Investigating, Resolved).
- **Two-Way Anonymous Chat**: Engage in private conversation threads with investigating officers without exposing personal credentials.
- **Emergency Quick-Dial**: Instant access to campus emergency response hotlines.

### 👮 For Campus Safety Authorities
- **Secure Authentication**: Officer login with token-based session persistence.
- **Incident Dashboard**: Filter reports by category, severity, status, and date with key summary metrics.
- **Case Investigation View**: Full report inspection, evidence playback, resolution notes, and status transitions.
- **Officer Messaging Console**: Real-time communication with reporters while respecting anonymity.

### 🎨 Design & Experience
- **Dynamic Theme System**: Sleek Dark & Light themes with modern visual tokens and responsive typography.
- **Offline & Local Cache**: Secure storage for active report passcodes and session states.
- **Native Performance**: Smooth transitions and gestures powered by React Navigation.

---

## 🛠️ Tech Stack

- **Framework**: React Native with Expo (SDK 51+)
- **Language**: TypeScript
- **Navigation**: React Navigation (Native Stack)
- **State & Storage**: React Context API & Expo SecureStore / AsyncStorage
- **Networking**: Axios with interceptors
- **Icons**: Expo Vector Icons (Ionicons, MaterialCommunityIcons)
- **UI & Animation**: Vanilla React Native StyleSheet with custom theme token design system

---

## 📂 Project Structure

```
frontend/
├── assets/                        # App icons, splash screens, and images
├── src/
│   ├── api/                       # API clients & service endpoints
│   │   ├── auth.ts                # Authority authentication API
│   │   ├── client.ts              # Axios instance configuration
│   │   ├── fileUpload.ts          # Multipart file upload service
│   │   ├── messages.ts            # Messaging endpoints
│   │   └── reports.ts             # Report creation & tracking API
│   ├── contexts/                  # Global state providers
│   │   ├── AppThemeContext.tsx    # Dark / Light theme provider
│   │   ├── AuthContext.tsx        # Authority auth session state
│   │   └── ReportDraftContext.tsx # Report form persistence state
│   ├── navigation/                # Root navigation container & typed stacks
│   │   └── RootNavigator.tsx
│   ├── screens/
│   │   ├── authority/             # Authority portal screens
│   │   │   ├── AuthChatScreen.tsx
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   └── ReportDetailScreen.tsx
│   │   └── reporter/              # Student reporter screens
│   │       ├── ChatScreen.tsx
│   │       ├── HomeScreen.tsx
│   │       ├── PasscodeScreen.tsx
│   │       ├── ReportFormScreen.tsx
│   │       ├── ReportStatusScreen.tsx
│   │       └── TrackScreen.tsx
│   ├── storage/                   # Secure storage helpers
│   │   └── secureStorage.ts
│   ├── theme/                     # Color palettes & typography tokens
│   │   └── colors.ts
│   └── types/                     # TypeScript models and navigation types
│       └── index.ts
├── App.tsx                        # Main application entrypoint
├── app.json                       # Expo application configuration
├── eas.json                       # Expo Application Services build profile
└── package.json                   # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on iOS/Android or an emulator

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Muhiuddin2005/campusGuardFrontend.git
   cd campusGuardFrontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Set `EXPO_PUBLIC_API_URL` to your backend server URL (e.g., `http://192.168.1.X:5000/api/v1`).

4. Start the development server:
   ```bash
   npx expo start
   ```

5. Scan the QR code using Expo Go (Android) or Camera (iOS) to launch the app.

---

## 📱 Build & Deployment

To generate production builds using EAS Build:

```bash
# Configure EAS project
npx eas-cli build:configure

# Build Android APK
npx eas-cli build --platform android --profile preview

# Build iOS IPA
npx eas-cli build --platform ios --profile preview
```

---

## 📄 License

This project is licensed under the MIT License.
