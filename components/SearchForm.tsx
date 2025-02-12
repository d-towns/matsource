"use client";

import { SearchAgentResult } from '@/agents/searchAgent';
import React, { useState } from 'react';
import { Button } from './ui/button';

interface SearchResult {
  identifiedParts: string[];
  storeResults: {
    store: {
      id: string;
      name: string;
      location: string;
    };
    availableParts: {
      [part: string]: {
        price: number;
        deliveryTime: string;
        inStock: boolean;
      }
    }
  }[];
}

export default function SearchForm() {
  const [carName, setCarName] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [issues, setIssues] = useState("");
  const [location, setLocation] = useState("");
  const [preferredBrands, setPreferredBrands] = useState("");
  const [retailParts, setRetailParts] = useState<boolean>(false);
  const [recycledParts, setRecycledParts] = useState<boolean>(false);
  const [results, setResults] = useState<SearchAgentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

    const loadTestDataForm = () => {
        setCarName("Jeep Patriot");
        setYear(2008);
        setIssues("needs new alternator");
        setLocation("Flint, MI 48505");
        setPreferredBrands("");
        setRetailParts(false);
        setRecycledParts(true);
    }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          carName,
          year: Number(year),
          issues,
          location,
          preferredBrands: preferredBrands.split(',').map(brand => brand.trim()),
          retailParts,
          recycledParts
        })
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "An error occurred");
      } else {
        const data = await res.json();
        console.log(data)
        setResults(data);
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError("Error occurred while performing search.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-background">
        <Button onClick={loadTestDataForm}>Load Test Data</Button>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Car Name"
          value={carName}
          onChange={(e) => setCarName(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="p-2 border rounded"
          required
        />
        <textarea
          placeholder="Describe the issues with your car"
          value={issues}
          onChange={(e) => setIssues(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Preferred Brands (comma-separated)"
          value={preferredBrands}
          onChange={(e) => setPreferredBrands(e.target.value)}
          className="p-2 border rounded"
        />
        <div>
          <input
            type="checkbox"
            id="retailParts"
            name="retailParts"
            checked={retailParts}
            onChange={(e) => setRetailParts(e.target.checked)}
          />
          <label htmlFor="retailParts">Search for retail parts</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="recycledParts"
            name="recycledParts"
            checked={recycledParts}
            onChange={(e) => setRecycledParts(e.target.checked)}
          />
          <label htmlFor="recycledParts">Search for recycled parts</label>
        </div>
        <button type="submit" className="bg-primary text-white p-2 rounded">
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      
      {error && <div className="mt-3 text-red-500">{error}</div>}

      {/* {results && (
        <div className="mt-4">
          <h2 className="font-bold">Results:</h2>
          <pre> {results} </pre>
        </div>
      )} */}
      
      {/* {results && (
        <div className="mt-4">
          <h2 className="font-bold">Identified Parts:</h2>
          <ul>
            {results.identifiedParts.map((part, index) => (
              <li key={index}>{part}</li>
            ))}
          </ul>
          <h2 className="font-bold mt-4">Store Results:</h2>
          <ul>
            {results.storeResults.map((storeResult, index) => (
              <li key={storeResult.store.id || index} className="mb-3">
                <div className="font-semibold">
                  {storeResult.store.name} ({storeResult.store.location})
                </div>
                <ul>
                  {Object.entries(storeResult.availableParts).map(([part, details]) => (
                    <li key={part}>
                      {part}: ${details.price} - Delivery in {details.deliveryTime} -{" "}
                      {details.inStock ? "In Stock" : "Out of Stock"}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
} 