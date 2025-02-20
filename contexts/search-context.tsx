"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export interface SearchHistoryItem {
  id: string;
  car_name: string;
  year: number;
  issues: string;
  location: string;
  preferred_brands: string[];
  recycled_parts: boolean;
  retail_parts: boolean;
  created_at: string;
  user_id: string;
  status?: string;
  step?: string;
}

interface SearchContextType {
  searchHistory: SearchHistoryItem[];
  isLoading: boolean;
  setSearchHistory: (history: SearchHistoryItem[]) => void;
  addSearchHistory: (item: SearchHistoryItem) => void;
  updateSearchHistory: (id: string, updates: Partial<SearchHistoryItem>) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true);

  const addSearchHistory = (item: SearchHistoryItem) => {
    setSearchHistory(prev => [item, ...prev])
  }

  const updateSearchHistory = (id: string, updates: Partial<SearchHistoryItem>) => {
    setSearchHistory(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    )
  }

  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/search');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // if there is no step or status, set it to "pending"
        const updatedData = data.map(item => ({
          ...item,
          step: item.step || "pending",
          status: item.status || "pending"
        }));
        setSearchHistory(updatedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Could not fetch search history:", error);
        // Handle error appropriately, maybe set an error state
      }
    };

    fetchSearchHistory();
  }, [setSearchHistory]);

  const value: SearchContextType = {
    searchHistory,
    isLoading,
    setSearchHistory,
    addSearchHistory,
    updateSearchHistory,
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
} 