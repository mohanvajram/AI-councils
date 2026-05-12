import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { saveApiKeys } from '../services/api';

const KeysContext = createContext(null);

export function KeysProvider({ children }) {
  const [userId] = useState(() => {
    const stored = localStorage.getItem('ai_council_uid');
    if (stored) return stored;
    const id = uuidv4();
    localStorage.setItem('ai_council_uid', id);
    return id;
  });

  const [keys, setKeys] = useState({
    openai_key: localStorage.getItem('ai_council_openai') || '',
    gemini_key: localStorage.getItem('ai_council_gemini') || '',
    anthropic_key: localStorage.getItem('ai_council_anthropic') || '',
  });

  const [keySaved, setKeySaved] = useState(false);

  const persistKeys = async (newKeys) => {
    setKeys(newKeys);
    localStorage.setItem('ai_council_openai', newKeys.openai_key || '');
    localStorage.setItem('ai_council_gemini', newKeys.gemini_key || '');
    localStorage.setItem('ai_council_anthropic', newKeys.anthropic_key || '');
    try {
      await saveApiKeys(userId, newKeys);
      setKeySaved(true);
      setTimeout(() => setKeySaved(false), 3000);
    } catch (e) {
      console.error('Failed to save keys to DB', e);
    }
  };

  return (
    <KeysContext.Provider value={{ userId, keys, persistKeys, keySaved }}>
      {children}
    </KeysContext.Provider>
  );
}

export const useKeys = () => useContext(KeysContext);
