import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the context and its properties
interface EmojiContextProps {
  frequentEmojis: Record<string, number>;
  setFrequentEmojis: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const EmojiContext = createContext<EmojiContextProps | undefined>(undefined);

// Define the EmojiProvider component
interface EmojiProviderProps {
  children: ReactNode;
}

export const EmojiProvider: React.FC<EmojiProviderProps> = ({ children }) => {
  const [frequentEmojis, setFrequentEmojis] = useState<Record<string, number>>({});

  return (
    <EmojiContext.Provider value={{ frequentEmojis, setFrequentEmojis }}>
      {children}
    </EmojiContext.Provider>
  );
};

export default EmojiProvider;

// Define the useEmojiContext hook
export const useEmojiContext = () => {
  const context = useContext(EmojiContext);
  if (!context) {
    throw new Error('useEmojiContext must be used within an EmojiProvider');
  }
  return context;
};