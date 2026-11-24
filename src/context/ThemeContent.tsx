import { createContext, useContext, useState } from 'react';

type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


type ThemeProviderProps = {
  children: React.ReactNode;
};


export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<string>("light");


  const toggleTheme = () => {
    setTheme((t) => t=="light"?"dark":"light");
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );

}

export function useTheme() {
  const context = useContext(ThemeContext);

  return context;
}

