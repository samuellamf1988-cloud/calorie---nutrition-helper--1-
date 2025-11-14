// context/LanguageContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { en } from '../locales/en';
import { zh } from '../locales/zh';

export type Language = 'en' | 'zh';
type Translations = typeof en; // Type all translations based on the English one

interface LanguageContextType {
  language: Language;
  translations: Translations;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize default language to Chinese as requested
  const [language, setLanguage] = useState<Language>('zh'); 
  const translations = language === 'en' ? en : zh;

  return (
    <LanguageContext.Provider value={{ language, translations, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};