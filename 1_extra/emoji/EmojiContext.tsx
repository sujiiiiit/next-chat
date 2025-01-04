import React, { createContext, useContext, useState, useCallback } from 'react';

interface EmojiContextProps {
  activeCategory: string | null;
  setActiveCategory: (category: string) => void;
  searchVisible: boolean;
  setSearchVisible: (visible: boolean) => void;
}

const EmojiContext = createContext<EmojiContextProps | undefined>(undefined);

interface EmojiProviderProps {
  children: React.ReactNode;
}

export const EmojiProvider: React.FC<EmojiProviderProps> = ({ children }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchVisible, setSearchVisible] = useState(true);

  const handleCategoryChange = useCallback((newCategory: string) => {
    setActiveCategory(newCategory);
  }, []);

  const handleSearchVisibility = useCallback((visible: boolean) => {
    setSearchVisible(visible);
  }, []);

  return (
    <EmojiContext.Provider
      value={{
        activeCategory,
        setActiveCategory: handleCategoryChange,
        searchVisible,
        setSearchVisible: handleSearchVisibility,
      }}
    >
      {children}
    </EmojiContext.Provider>
  );
};

export const useEmojiContext = (): EmojiContextProps => {
  const context = useContext(EmojiContext);
  if (!context) {
    throw new Error('useEmojiContext must be used within an EmojiProvider');
  }
  return context;
};