import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Returns `true` when the device has "Reduce Motion" (iOS) or
 * "Remove animations" (Android) enabled.
 *
 * Animated durations should be set to 0 when this returns `true`.
 */
export function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => sub.remove();
  }, []);

  return reduce;
}

/**
 * Returns an animation duration: 0 when reduce-motion is on, otherwise
 * the supplied default.
 */
export function useMotionDuration(defaultMs: number): number {
  const reduce = useReduceMotion();
  return reduce ? 0 : defaultMs;
}
