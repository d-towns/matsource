"use client";

import { useState } from 'react';
import { Button } from './ui/button';

export function DemoSearch() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse('');

    // Simulate a response
    setTimeout(() => {
      setResponse(
        `Here are the parts you need for your ${query}:\n` +
        '1. OEM Alternator (Part #A2TC1391)\n' +
        '2. Serpentine Belt (Part #SB61242)\n' +
        '3. Battery Terminal Cleaner'
      );
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about parts, repairs, or maintenance..."
            className="w-full bg-gray-800/50 text-white placeholder-gray-400 rounded-lg px-4 py-3 pr-12"
          />
          <Button 
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md"
          >
            {isLoading ? "..." : "Ask"}
          </Button>
        </div>
      </form>

      {response && (
        <div className="bg-gray-800/30 rounded-lg p-4 font-mono text-sm text-gray-300">
          <pre className="whitespace-pre-wrap">{response}</pre>
        </div>
      )}
    </div>
  );
} 