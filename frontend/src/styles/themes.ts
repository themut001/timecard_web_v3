// Theme configuration using CSS-in-JS approach
export interface ThemeColors {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  glass: {
    light: string;
    medium: string;
    dark: string;
    border: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  background: {
    primary: string;
    secondary: string;
    card: string;
    input: string;
  };
  border: {
    light: string;
    medium: string;
    focus: string;
  };
  shadow: {
    light: string;
    medium: string;
    heavy: string;
    glass: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export const lightTheme: ThemeColors = {
  primary: {
    50: '#f8f9ff',
    100: '#f0f4ff',
    200: '#e8f2ff',
    300: '#dbeafe',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  secondary: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
  glass: {
    light: 'rgba(255, 255, 255, 0.7)',
    medium: 'rgba(255, 255, 255, 0.5)',
    dark: 'rgba(255, 255, 255, 0.3)',
    border: 'rgba(203, 213, 225, 0.6)',
  },
  text: {
    primary: '#2d3748',
    secondary: '#64748b',
    muted: '#94a3b8',
  },
  background: {
    primary: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 50%, #e8f2ff 100%)',
    secondary: '#ffffff',
    card: 'rgba(255, 255, 255, 0.7)',
    input: 'rgba(248, 250, 252, 0.8)',
  },
  border: {
    light: 'rgba(203, 213, 225, 0.6)',
    medium: 'rgba(203, 213, 225, 0.8)',
    focus: 'rgba(139, 92, 246, 0.5)',
  },
  shadow: {
    light: '0 4px 8px -2px rgba(139, 92, 246, 0.1)',
    medium: '0 8px 16px -4px rgba(139, 92, 246, 0.15)',
    heavy: '0 25px 50px -12px rgba(99, 102, 241, 0.15)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
};

// Future dark theme support
export const darkTheme: ThemeColors = {
  primary: {
    50: '#1e1b4b',
    100: '#312e81',
    200: '#3730a3',
    300: '#4338ca',
    400: '#5b21b6',
    500: '#7c3aed',
    600: '#8b5cf6',
    700: '#a78bfa',
    800: '#c4b5fd',
    900: '#ddd6fe',
  },
  secondary: {
    50: '#831843',
    100: '#9d174d',
    200: '#be185d',
    300: '#db2777',
    400: '#ec4899',
    500: '#f472b6',
    600: '#f9a8d4',
    700: '#fbcfe8',
    800: '#fce7f3',
    900: '#fdf2f8',
  },
  glass: {
    light: 'rgba(15, 23, 42, 0.7)',
    medium: 'rgba(15, 23, 42, 0.5)',
    dark: 'rgba(15, 23, 42, 0.3)',
    border: 'rgba(71, 85, 105, 0.6)',
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#cbd5e1',
    muted: '#94a3b8',
  },
  background: {
    primary: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    secondary: '#1e293b',
    card: 'rgba(15, 23, 42, 0.7)',
    input: 'rgba(30, 41, 59, 0.8)',
  },
  border: {
    light: 'rgba(71, 85, 105, 0.6)',
    medium: 'rgba(71, 85, 105, 0.8)',
    focus: 'rgba(139, 92, 246, 0.5)',
  },
  shadow: {
    light: '0 4px 8px -2px rgba(0, 0, 0, 0.3)',
    medium: '0 8px 16px -4px rgba(0, 0, 0, 0.4)',
    heavy: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
};

export type ThemeMode = 'light' | 'dark';

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;