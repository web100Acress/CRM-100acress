import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    try {
      // Get current user ID or email for user-specific theme
      const userId = localStorage.getItem('userId') || 
                    localStorage.getItem('userEmail') || 
                    localStorage.getItem('userName') || 
                    'default';
      const raw = localStorage.getItem(`crmTheme_${userId}`);
      return raw === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      try {
        // Save theme for current user
        const userId = localStorage.getItem('userId') || 
                      localStorage.getItem('userEmail') || 
                      localStorage.getItem('userName') || 
                      'default';
        localStorage.setItem(`crmTheme_${userId}`, next ? 'dark' : 'light');
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
