import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, RotateCcw } from 'lucide-react-native';
import { colors, spacing, radius } from '@/constants/theme';
import { useColors } from '@/hooks/useColors';
import { captureException } from '@/lib/sentry';

interface Props {
  children: ReactNode;
  /** Passed to Sentry as the component boundary tag. */
  label?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

function ErrorFallbackUI({
  errorMessage,
  onRetry,
}: {
  errorMessage: string | null;
  onRetry: () => void;
}) {
  const c = useColors();
  const { t } = useTranslation();
  return (
    <View style={[s.container, { backgroundColor: c.neutral[50] }]}>
      <View style={[s.iconWrap, { backgroundColor: c.status.error + '14' }]}>
        <AlertTriangle size={40} color={c.status.error} />
      </View>
      <Text style={[s.title, { color: c.text.primary }]}>{t('errors.somethingWentWrong')}</Text>
      <Text style={[s.message, { color: c.text.secondary }]}>
        {t('errors.unexpectedError')}
      </Text>
      {errorMessage && (
        <Text style={[s.devError, { color: c.status.error, backgroundColor: c.status.error + '0a' }]} numberOfLines={6} selectable>
          {errorMessage}
        </Text>
      )}
      <Pressable
        onPress={onRetry}
        style={({ pressed }) => [s.btn, { backgroundColor: c.brand.deep }, pressed && s.btnPressed]}
        accessibilityRole="button"
        accessibilityLabel={t('common.reload')}
      >
        <RotateCcw size={18} color={c.text.inverse} />
        <Text style={s.btnText}>{t('common.reload')}</Text>
      </Pressable>
    </View>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    captureException(error, {
      componentStack: info.componentStack,
      boundary: this.props.label,
    });
    if (__DEV__) {
      console.error(`[ErrorBoundary${this.props.label ? `:${this.props.label}` : ''}]`, error, info.componentStack);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallbackUI
          errorMessage={__DEV__ && this.state.error ? this.state.error.message : null}
          onRetry={this.handleRetry}
        />
      );
    }
    return this.props.children;
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.auth.bgLight,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.status.error + '14',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
    maxWidth: 280,
  },
  devError: {
    fontSize: 11,
    fontFamily: 'Courier',
    color: colors.status.error,
    backgroundColor: colors.status.error + '0a',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.lg,
    maxWidth: '100%',
    overflow: 'hidden',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.brand.deep,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  btnPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
