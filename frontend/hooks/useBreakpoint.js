import { useWindowDimensions } from 'react-native';

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export default function useBreakpoint() {
  const { width, height } = useWindowDimensions();

  return {
    width,
    height,
    isMobile: width < BREAKPOINTS.md,
    isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg,
    isWide: width >= BREAKPOINTS.xl,
  };
}
