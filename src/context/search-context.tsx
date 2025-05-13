"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export interface SearchItem {
  id: string;
  make: string;
  model: string;  
  year: number;
  issues: string;
  location: string;
  preferred_brands: string[];
  part_search_type: string;
  distance: string;
  created_at: string;
  user_id: string;
  status?: 'active' | 'setup' | 'completed' | 'failed';
  step?: string;
}

interface SearchContextType {
  searchHistory: SearchItem[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  setSearchHistory: (history: SearchItem[]) => void;
  addSearchHistory: (item: SearchItem) => void;
  updateSearchHistory: (id: string, updates: Partial<SearchItem>) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchHistory, setSearchHistory] = useState<SearchItem[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 4;

  const addSearchHistory = (item: SearchItem) => {
    setSearchHistory(prev => [item, ...prev])
  }

  const updateSearchHistory = (id: string, updates: Partial<SearchItem>) => {
    setSearchHistory(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    )
  }

  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/search?page=${currentPage}&pageSize=${pageSize}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Update search history and pagination info
        const updatedData = data.searches.map(item => ({
          ...item,
          step: item.step || "pending",
          status: item.status || "pending"
        }));
        setSearchHistory(updatedData);
        setTotalPages(data.totalPages);
        setIsLoading(false);
      } catch (error) {
        console.error("Could not fetch search history:", error);
        setIsLoading(false);
      }
    };

    fetchSearchHistory();
  }, [currentPage]); // Add currentPage as dependency

  useEffect(() => {
    const eventSource = new EventSource('/api/search/events');

    eventSource.onopen = () => {
      console.log('SSE connection opened');
    };

    // Add handler for the custom event type
    eventSource.addEventListener('search-status-update', (event: MessageEvent) => {
      console.log("Received custom event:", event.data);
      try {
        const data = JSON.parse(event.data);
        console.log("Parsed data:", data);
        // Process the data accordingly here
        if(data.searchId) {
          updateSearchHistory(data.searchId, { step: data.step, status: data.status });
        }
      } catch (error) {
        console.error("Error parsing event data:", error);
      }
    });

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
    };

    // Clean up on unmount if needed:
    return () => {
      eventSource.close();
      console.log('SSE connection closed');
    };

  }, []);

  const value: SearchContextType = {
    searchHistory,
    isLoading,
    currentPage,
    totalPages,
    setCurrentPage,
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