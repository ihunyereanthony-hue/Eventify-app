import { useWindowDimensions } from 'react-native';
export function useLayout() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  return { width, isTablet, columns: isTablet ? 2 : 1 };
}
