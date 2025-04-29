"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";

interface SearchFilters {
  priceRange: [number, number];
  categories: string[];
  brands: string[];
  ratings: number[];
  availability: boolean;
  sortBy: string;
}

interface AdvancedSearchProps {
  onApplyFilters: (filters: SearchFilters) => void;
  onClose: () => void;
}

export default function AdvancedSearch({ onApplyFilters, onClose }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: [0, 1000],
    categories: [],
    brands: [],
    ratings: [],
    availability: false,
    sortBy: "relevance"
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute right-0 top-full mt-2 w-80 bg-black/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden z-[100]"
    >
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Advanced Search</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6 max-h-[60vh] overflow-y-auto">
        {/* Price Range */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/80">Price Range</h4>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => setFilters({ ...filters, priceRange: [Number(e.target.value), filters.priceRange[1]] })}
              className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              placeholder="Min"
            />
            <span className="text-white/60">to</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })}
              className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/80">Categories</h4>
          <div className="space-y-2">
            {["Electronics", "Clothing", "Books", "Home & Kitchen"].map((category) => (
              <label key={category} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({ ...filters, categories: [...filters.categories, category] });
                    } else {
                      setFilters({ ...filters, categories: filters.categories.filter(c => c !== category) });
                    }
                  }}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-purple-500"
                />
                <span className="text-white/80 text-sm">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/80">Brands</h4>
          <div className="space-y-2">
            {["Apple", "Samsung", "Sony", "Nike"].map((brand) => (
              <label key={brand} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({ ...filters, brands: [...filters.brands, brand] });
                    } else {
                      setFilters({ ...filters, brands: filters.brands.filter(b => b !== brand) });
                    }
                  }}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-purple-500"
                />
                <span className="text-white/80 text-sm">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ratings */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/80">Customer Ratings</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.ratings.includes(rating)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({ ...filters, ratings: [...filters.ratings, rating] });
                    } else {
                      setFilters({ ...filters, ratings: filters.ratings.filter(r => r !== rating) });
                    }
                  }}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-purple-500"
                />
                <div className="flex items-center gap-1">
                  {[...Array(rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                  {[...Array(5 - rating)].map((_, i) => (
                    <span key={i} className="text-white/20">★</span>
                  ))}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.availability}
              onChange={(e) => setFilters({ ...filters, availability: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-purple-500"
            />
            <span className="text-white/80 text-sm">In Stock Only</span>
          </label>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/80">Sort By</h4>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
          >
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleApplyFilters}
          className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          Apply Filters
        </button>
      </div>
    </motion.div>
  );
} 