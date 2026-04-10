# React Native Base Template

Production-ready Expo (React Native) app template with authentication, navigation, and shared cross-platform code.

## Features

- **Expo SDK 54** with New Architecture enabled
- **Authentication** — Email/password, Google Sign-In (optional), forgot password, email verification
- **Navigation** — React Navigation 7 (native stack + bottom tabs)
- **State Management** — Zustand (auth + theme stores), TanStack Query v5 with MMKV persistence
- **Networking** — Axios with Bearer token injection, 401 refresh queue, circuit breaker, WebSocket client
- **Security** — SecureStore tokens, biometric gate, SSL pinning (optional), Sentry error tracking
- **Theming** — Dark mode support with system preference sync
- **i18n** — i18next with English, French, and Dutch
- **Shared Code** — `packages/shared/` with TypeScript types and Zod schemas consumed by both web and mobile via `@shared/*` alias
- **Testing** — Jest + React Native Testing Library

## Structure

```
├── assets/                  # App icons and splash screen
├── packages/shared/         # Cross-platform types, schemas, i18n
│   └── src/
│       ├── types/           # TypeScript interfaces
│       ├── schemas/         # Zod validation schemas
│       ├── i18n/            # Translation JSON files
│       ├── constants/       # Shared constants
│       └── utils/           # Shared utilities
├── src/
│   ├── App.tsx              # Root component with providers
│   ├── components/          # Shared UI components
│   ├── constants/           # Theme tokens (colors, typography, spacing)
│   ├── features/auth/       # Authentication feature
│   │   ├── api/             # API calls
│   │   ├── components/      # Auth UI components
│   │   ├── hooks/           # Auth mutations/queries
│   │   ├── screens/         # Auth screens
│   │   └── stores/          # Zustand auth store
│   ├── hooks/               # App-wide hooks
│   ├── lib/                 # Utility modules
│   ├── navigation/          # React Navigation config
│   ├── services/            # HTTP, WebSocket, gate components
│   └── stores/              # App-wide Zustand stores
├── app.json                 # Expo config
├── eas.json                 # EAS Build profiles
└── package.json
```

## Quick Start

```bash
yarn install
yarn start
```

## Google Sign-In Setup (Optional)

Google Sign-In is lazy-loaded and only activates when configured:

1. Create OAuth credentials in Google Cloud Console
2. Set environment variables:
   ```
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id
   EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id
   ```
3. Add `GoogleService-Info.plist` (iOS) and `google-services.json` (Android) to native projects
4. Add the Google Sign-In plugin to `app.json`:
   ```json
   ["@react-native-google-signin/google-signin", {
     "iosUrlScheme": "com.googleusercontent.apps.YOUR_IOS_CLIENT_ID"
   }]
   ```

When env vars are not set, the Google button is hidden automatically.

## Commands

| Command | Description |
|---------|-------------|
| `yarn start` | Start Expo dev server |
| `yarn ios` | Run on iOS simulator |
| `yarn android` | Run on Android emulator |
| `yarn type-check` | TypeScript check |
| `yarn lint` | ESLint |
| `yarn test` | Run Jest tests |
| `yarn prebuild` | Generate native projects |
| `yarn build:ios` | EAS Build for iOS |
| `yarn build:android` | EAS Build for Android |

## Tokenization

When scaffolded by `create-tast-mobile-app`, these tokens are replaced:

| Token | Description |
|-------|-------------|
| `{{PROJECT_NAME}}` | Package name (kebab-case) |
| `{{PROJECT_SLUG}}` | App slug (no hyphens) |
| `{{BUNDLE_ID}}` | iOS bundle ID / Android package |
| `{{API_URL}}` | Backend API base URL |
| `{{EAS_PROJECT_ID}}` | EAS project UUID |
| `{{PORT_OFFSET}}` | Port offset for dev URLs |

## License

MIT
