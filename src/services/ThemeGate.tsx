import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { useThemeStore } from '@/stores/themeStore';

export function ThemeGate() {
  const setSystemScheme = useThemeStore((s) => s.setSystemScheme);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, [setSystemScheme]);

  return null;
}
