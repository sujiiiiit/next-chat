import React, { createContext, useState, useContext } from 'react';

interface EmojiContextProps {
  frequentEmojis: Record<string, number>;
  setFrequentEmojis: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const EmojiContext = createContext<EmojiContextProps | undefined>(undefined);

interface EmojiProviderProps {
  children: React.ReactNode;
}

export const EmojiProvider: React.FC<EmojiProviderProps> = ({ children }) => {
  const [frequentEmojis, setFrequentEmojis] = useState<Record<string, number>>({});

  return (
    <EmojiContext.Provider value={{ frequentEmojis, setFrequentEmojis }}>
      {children}
    </EmojiContext.Provider>
  );
};

export const useEmojiContext = () => {
  const context = useContext(EmojiContext);
  if (!context) {
    throw new Error('useEmojiContext must be used within an EmojiProvider');
  }
  return context;
};