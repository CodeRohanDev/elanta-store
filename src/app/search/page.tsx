"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, DocumentData, orderBy, limit } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  inStock: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    // Parse URL parameters into filters
    const filters: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      if (key !== "q") {
        if (filters[key]) {
          if (Array.isArray(filters[key])) {
            filters[key].push(value);
          } else {
            filters[key] = [filters[key], value];
          }
        } else {
          filters[key] = value;
        }
      }
    });
    setActiveFilters(filters);

    const fetchResults = async () => {
      setLoading(true);
      try {
        // Build the base query
        let productsQuery = collection(db, "products");
        let categoriesQuery = collection(db, "categories");

        // Apply search query
        if (searchQuery) {
          productsQuery = query(
            productsQuery,
            where("name", ">=", searchQuery),
            where("name", "<=", searchQuery + "\uf8ff")
          );
          categoriesQuery = query(
            categoriesQuery,
            where("name", ">=", searchQuery),
            where("name", "<=", searchQuery + "\uf8ff")
          );
        }

        // Apply filters
        if (filters.priceRange) {
          const [min, max] = filters.priceRange.split(",").map(Number);
          productsQuery = query(
            productsQuery,
            where("price", ">=", min),
            where("price", "<=", max)
          );
        }

        if (filters.categories) {
          productsQuery = query(
            productsQuery,
            where("category", "in", Array.isArray(filters.categories) ? filters.categories : [filters.categories])
          );
        }

        if (filters.brands) {
          productsQuery = query(
            productsQuery,
            where("brand", "in", Array.isArray(filters.brands) ? filters.brands : [filters.brands])
          );
        }

        if (filters.ratings) {
          productsQuery = query(
            productsQuery,
            where("rating", "in", Array.isArray(filters.ratings) ? filters.ratings.map(Number) : [Number(filters.ratings)])
          );
        }

        if (filters.availability === "true") {
          productsQuery = query(productsQuery, where("inStock", "==", true));
        }

        // Apply sorting
        if (filters.sortBy) {
          switch (filters.sortBy) {
            case "price-low":
              productsQuery = query(productsQuery, orderBy("price", "asc"));
              break;
            case "price-high":
              productsQuery = query(productsQuery, orderBy("price", "desc"));
              break;
            case "rating":
              productsQuery = query(productsQuery, orderBy("rating", "desc"));
              break;
            case "newest":
              productsQuery = query(productsQuery, orderBy("createdAt", "desc"));
              break;
            default:
              // Default to relevance (no specific ordering)
              break;
          }
        }

        // Execute queries
        const [productsSnapshot, categoriesSnapshot] = await Promise.all([
          getDocs(productsQuery),
          getDocs(categoriesQuery)
        ]);

        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];

        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-white/10 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Search Results for "{searchQuery}"
        </h1>

        {/* Active Filters */}
        {Object.keys(activeFilters).length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Active Filters</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeFilters).map(([key, value]) => (
                <div
                  key={key}
                  className="px-3 py-1 bg-white/10 rounded-full text-sm"
                >
                  {key}: {Array.isArray(value) ? value.join(", ") : value}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Products</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group relative bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all"
                >
                  <Link href={`/product/${product.id}`}>
                    <div className="aspect-square relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                      <p className="text-white/60 text-sm mb-4">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">${product.price}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < product.rating ? "text-yellow-400" : "text-white/20"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-white/60">No products found matching your search.</p>
          )}
        </section>

        {/* Categories Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Categories</h2>
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group relative bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all"
                >
                  <Link href={`/category/${category.slug}`}>
                    {category.image && (
                      <div className="aspect-square relative">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-white/60">No categories found matching your search.</p>
          )}
        </section>
      </div>
    </div>
  );
} 