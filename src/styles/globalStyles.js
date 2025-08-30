import { StyleSheet } from 'react-native';

// Light Theme
export const lightTheme = {
  primary: '#4285F4',
  secondary: '#34A853',
  danger: '#dc3545',
  background: '#f8f9fa',
  white: '#fff',
  surface: '#fff',
  text: {
    primary: '#333',
    secondary: '#666',
    light: '#999',
  },
  border: {
    light: '#e9ecef',
    default: '#e1e1e1',
    subtle: '#f1f3f4',
  },
};

// Dark Theme
export const darkTheme = {
  primary: '#4285F4',
  secondary: '#34A853',
  danger: '#dc3545',
  background: '#121212',
  white: '#1e1e1e',
  surface: '#1e1e1e',
  text: {
    primary: '#ffffff',
    secondary: '#b0b0b0',
    light: '#808080',
  },
  border: {
    light: '#333333',
    default: '#404040',
    subtle: '#2a2a2a',
  },
};

// Default to light theme for backward compatibility
export const colors = lightTheme;

// Common spacing values
export const spacing = {
  xs: 5,
  sm: 10,
  md: 15,
  lg: 20,
  xl: 30,
  xxl: 40,
  xxxl: 60,
};

// Typography
export const typography = {
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  body: {
    fontSize: 16,
    color: colors.text.primary,
  },
  bodySecondary: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  caption: {
    fontSize: 12,
    color: colors.text.light,
  },
};

// Shadow styles
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
};

// Common styles used across screens
export const commonStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xxxl,
  },
  contentWithoutTopPadding: {
    padding: spacing.lg,
  },

  // Card styles
  card: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  cardLarge: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: 12,
    marginBottom: spacing.lg,
    ...shadows.small,
  },

  // Section styles
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 8,
    backgroundColor: colors.background,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  // Menu item styles
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: spacing.md,
    width: 24,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  menuArrow: {
    fontSize: 20,
    color: colors.text.light,
  },

  // Button styles
  buttonPrimary: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Text input styles
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: spacing.md,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },

  // Layout helpers
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
});

// Function to create theme-aware styles
export const createThemedStyles = (theme) => StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xxxl,
  },
  contentWithoutTopPadding: {
    padding: spacing.lg,
  },

  // Card styles
  card: {
    backgroundColor: theme.surface,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  cardLarge: {
    backgroundColor: theme.surface,
    padding: spacing.xl,
    borderRadius: 12,
    marginBottom: spacing.lg,
    ...shadows.small,
  },

  // Section styles
  section: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text.primary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 8,
    backgroundColor: theme.background,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  // Menu item styles
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.border.subtle,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: spacing.md,
    width: 24,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: theme.text.primary,
  },
  menuArrow: {
    fontSize: 20,
    color: theme.text.light,
  },

  // Button styles
  buttonPrimary: {
    backgroundColor: theme.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  buttonSecondary: {
    backgroundColor: theme.secondary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  buttonDanger: {
    backgroundColor: theme.danger,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Text input styles
  input: {
    borderWidth: 1,
    borderColor: theme.border.default,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: spacing.md,
    fontSize: 16,
    backgroundColor: theme.surface,
    color: theme.text.primary,
  },

  // Layout helpers
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
});
