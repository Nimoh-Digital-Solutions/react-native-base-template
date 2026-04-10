import React, { forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  type TextInputProps,
} from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { typography, spacing, radius } from '@/constants/theme';

type AuthInputProps = TextInputProps & {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  rightAction?: {
    label: string;
    onPress: () => void;
  };
};

export const AuthInput = forwardRef<TextInput, AuthInputProps>(
  ({ label, icon: Icon, error, rightAction, style, ...rest }, ref) => {
    const c = useColors();

    return (
      <View style={s.field}>
        {label && <Text style={[s.label, { color: c.text.primary }]}>{label}</Text>}
        <View
          style={[
            s.inputRow,
            {
              backgroundColor: c.surface.input,
              borderColor: error ? c.border.error : c.border.default,
            },
          ]}
        >
          {Icon && (
            <View style={s.iconWrap}>
              <Icon size={18} color={c.text.placeholder} />
            </View>
          )}
          <TextInput
            ref={ref}
            style={[
              s.input,
              { color: c.text.input },
              Icon && s.inputWithIcon,
              rightAction && s.inputWithRight,
              style,
            ]}
            placeholderTextColor={c.text.placeholder}
            {...rest}
          />
          {rightAction && (
            <Pressable
              onPress={rightAction.onPress}
              style={s.rightAction}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={rightAction.label}
            >
              <Text style={[s.rightActionText, { color: c.text.secondary }]}>
                {rightAction.label}
              </Text>
            </Pressable>
          )}
        </View>
        {error && <Text style={[s.error, { color: c.status.error }]}>{error}</Text>}
      </View>
    );
  },
);

AuthInput.displayName = 'AuthInput';

const s = StyleSheet.create({
  field: { marginBottom: spacing.md },
  label: {
    ...typography.label,
    marginBottom: spacing.xs + 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.lg,
    minHeight: 52,
    overflow: 'hidden',
  },
  iconWrap: {
    paddingLeft: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    ...typography.input,
  },
  inputWithIcon: {
    paddingLeft: spacing.sm,
  },
  inputWithRight: {
    paddingRight: 60,
  },
  rightAction: {
    position: 'absolute',
    right: spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  rightActionText: {
    ...typography.small,
    fontWeight: '600',
  },
  error: {
    ...typography.small,
    marginTop: spacing.xs,
  },
});
