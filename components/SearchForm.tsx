"use client";

// import { SearchAgentResult } from '@/agents/searchAgent';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearch } from '@/contexts/search-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PartyPopper } from 'lucide-react';
import { Input } from './ui/input';
import { MakesCombobox } from './makesCombobox';
import { ModelsCombobox } from './modelsCombobox';
import { Label } from "./ui/label";
import { Textarea } from './ui/textarea';

interface SearchResult {
  identifiedParts: string[];
  storeResults: {
    store: {
      id: string;
      name: string;
      phone?: string;
      location: string;
      url?: string;
    };
    availableParts: {
      part: string;
      year: string;
      model: string;
      grade: string;
      stockNumber: string;
      price: string;
      distance: string;
      deliveryTime: string;
      inStock: boolean;
      url: string;
    }[];
  }[];
}

interface SearchItem {
  id?: string
  make: string
  model: string
  year: number
  issues: string
  location: string
  distance: string
  preferred_brands: string[]
  part_type: string
  created_at: string
  user_id: string
}

export default function SearchForm() {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      make: "",
      model: "",
      year: "",
      issues: "",
      location: "",
      distance: "",
      preferredBrands: "",
      partType: "",
    }
  });
  const [results, setResults] = React.useState<SearchResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const { addSearchHistory } = useSearch();

  const selectedMake = watch("make");

  const loadTestDataForm = () => {
    setValue("make", "Jeep");
    setValue("model", "Patriot");
    setValue("year", "2008");
    setValue("issues", "needs new alternator");
    setValue("location", "48505");
    setValue("preferredBrands", "");
    setValue("partType", "recycled");
  };

  const onSubmit = async (data: any) => {
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
          ...data,
          year: Number(data.year),
          preferredBrands: data.preferredBrands.split(',').map((brand: string) => brand.trim()),
        })
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "An error occurred");
      } else {
        const responseData = await res.json();
        localStorage.setItem('searchResults', JSON.stringify(responseData));
        setResults(responseData);
        addSearchHistory(responseData);
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError("Error occurred while performing search.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="p-4 bg-background">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partType">Part Type</Label>
              <Select onValueChange={(value) => setValue("partType", value)}>
                <SelectTrigger id="partType">
                  <SelectValue placeholder="Recycled/Retail" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recycled">Recycled</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <MakesCombobox onSelect={(value) => setValue("make", value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <ModelsCombobox 
                make={selectedMake} 
                onSelect={(value) => setValue("model", value)} 
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                placeholder="Enter year"
                className="w-full"
                {...register("year", {
                  min: {
                    value: 1900,
                    message: "Year must be after 1900"
                  },
                  max: {
                    value: new Date().getFullYear() + 1,
                    message: "Year cannot be in the future"
                  }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="distance">Distance</Label>
              <Select onValueChange={(value) => setValue("distance", value)}>
                <SelectTrigger id="distance">
                  <SelectValue placeholder="Select distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 miles</SelectItem>
                  <SelectItem value="50">50 miles</SelectItem>
                  <SelectItem value="100">100 miles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">ZIP Code</Label>
              <Input
                id="location"
                type="text"
                placeholder="Enter ZIP"
                className="w-full"
                {...register("location")}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="issues">Issues</Label>
            <Textarea
              id="issues"
              placeholder="Enter issues"
              className="w-full"
              {...register("issues")}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {loading ? "Searching..." : "Show matches"}
          </Button>
        </form>
      </div>

      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
} 