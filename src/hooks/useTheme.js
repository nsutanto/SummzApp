import { useColorScheme } from 'react-native';
import { useTheme as useThemeContext } from '../context/ThemeProvider';
import { createThemedStyles, darkTheme, getTypography, getCommonStyles } from '../styles/globalStyles';

export const useTheme = () => {
  const theme = useThemeContext();
  const scheme = useColorScheme();
  const isDark = theme === darkTheme;
  const styles = createThemedStyles(theme);
  const typography = getTypography(theme);
  const commonStyles = getCommonStyles(theme);
  
  return {
    theme,
    styles,
    typography,
    commonStyles,
    isDark,
    scheme,
  };
};
