import { createContext, useState, useEffect } from 'react';

const ColorSchemeContext = createContext(`light`);

const ColorSchemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [colorScheme, setColorScheme] = useState(`light`);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleColorSchemeChangeEvent = () => {
      setColorScheme(mediaQuery.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleColorSchemeChangeEvent);
    handleColorSchemeChangeEvent();
    return () => mediaQuery.removeEventListener('change', handleColorSchemeChangeEvent);
  }, []);

  return (
    <ColorSchemeContext.Provider value={colorScheme}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

export { ColorSchemeProvider, ColorSchemeContext };
