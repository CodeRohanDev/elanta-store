"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, DocumentData, orderBy, limit } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SearchSuggestionsProps {
  searchQuery: string;
  onSelect: () => void;
}

interface SearchResult {
  id: string;
  name: string;
  type: "product" | "category" | "subcategory";
  slug: string;
  image?: string;
}

export default function SearchSuggestions({ searchQuery, onSelect }: SearchSuggestionsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const searchProducts = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      const searchTerm = searchQuery.toLowerCase().trim();
      const newResults: SearchResult[] = [];

      try {
        // Search products
        const productsQuery = query(
          collection(db, "products"),
          orderBy("name"),
          limit(100)
        );
        const productsSnapshot = await getDocs(productsQuery);
        productsSnapshot.forEach((doc) => {
          const data = doc.data() as { name: string; slug: string; images?: string[] };
          if (data.name.toLowerCase().includes(searchTerm)) {
            newResults.push({
              id: doc.id,
              name: data.name,
              type: "product",
              slug: data.slug,
              image: data.images?.[0]
            });
          }
        });

        // Search categories
        const categoriesQuery = query(
          collection(db, "categories"),
          orderBy("name"),
          limit(100)
        );
        const categoriesSnapshot = await getDocs(categoriesQuery);
        categoriesSnapshot.forEach((doc) => {
          const data = doc.data() as { name: string; slug: string; image?: string };
          if (data.name.toLowerCase().includes(searchTerm)) {
            newResults.push({
              id: doc.id,
              name: data.name,
              type: "category",
              slug: data.slug,
              image: data.image
            });
          }
        });

        // Search subcategories
        const subcategoriesQuery = query(
          collection(db, "subcategories"),
          orderBy("name"),
          limit(100)
        );
        const subcategoriesSnapshot = await getDocs(subcategoriesQuery);
        subcategoriesSnapshot.forEach((doc) => {
          const data = doc.data() as { name: string; slug: string; image?: string };
          if (data.name.toLowerCase().includes(searchTerm)) {
            newResults.push({
              id: doc.id,
              name: data.name,
              type: "subcategory",
              slug: data.slug,
              image: data.image
            });
          }
        });

        // Sort results by type (products first, then categories, then subcategories)
        newResults.sort((a, b) => {
          const typeOrder = { product: 0, category: 1, subcategory: 2 };
          return typeOrder[a.type] - typeOrder[b.type];
        });

        setResults(newResults);
      } catch (error) {
        console.error("Error searching:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  if (!searchQuery.trim()) {
    return null;
  }

  // Get first 5 results
  const displayedResults = results.slice(0, 5);

  return (
    <div className="relative w-full">
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute top-2 left-0 right-0 bg-black/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden z-[100]"
      >
        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-white/60">Searching...</div>
          ) : displayedResults.length > 0 ? (
            <>
              <AnimatePresence>
                {displayedResults.map((result) => (
                  <motion.div
                    key={`${result.type}-${result.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="border-b border-white/5 last:border-0"
                  >
                    <Link
                      href={`/${result.type}/${result.slug}`}
                      onClick={onSelect}
                      className="block p-4 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {result.image ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={result.image}
                              alt={result.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                            <span className="text-white/40 text-lg">
                              {result.type.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium truncate">{result.name}</div>
                          <div className="text-sm text-white/60 capitalize">
                            {result.type}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
              {results.length > 5 && (
                <div className="p-4 border-t border-white/5">
                  <button
                    onClick={() => {
                      onSelect();
                      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                    }}
                    className="w-full py-3 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Show {results.length - 5} More Results</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 text-center text-white/60">No results found</div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 