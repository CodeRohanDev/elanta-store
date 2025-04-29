"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  parentId?: string;
  image?: string;
  productCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        
        // Filter only parent categories (those without parentId)
        const parentCategories = categoriesData.filter(category => !category.parentId);
        setCategories(parentCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-black py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              All Categories
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Explore our wide range of product categories. Each category offers unique products tailored to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[400px] rounded-3xl bg-gray-900/50 animate-pulse"
              />
            ))
          ) : (
            categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative h-[400px] rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-500 hover-glow"
              >
                {/* Main Background with Glass Effect */}
                <div className="absolute inset-0 backdrop-blur-sm bg-black/40 border-2 border-white/10 group-hover:border-purple-500/50 transition-all duration-500" />
                
                {/* Background Image with Enhanced Effect */}
                {category.image && (
                  <div className="absolute inset-0">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />
                  </div>
                )}
                
                {/* Fallback Gradient Background */}
                {!category.image && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-black to-pink-900/50" />
                )}

                {/* Content Container with Glass Effect */}
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-8">
                  {/* Top Section */}
                  <div className="flex justify-between items-start">
                    <div className="backdrop-blur-md bg-white/5 rounded-2xl px-6 py-3 border border-white/10 group-hover:border-purple-500/30 transition-all duration-500">
                      <span className="text-white/90 text-sm font-medium">CATEGORY</span>
                    </div>
                    {category.productCount && (
                      <div className="backdrop-blur-md bg-white/5 rounded-2xl px-6 py-3 border border-white/10 group-hover:border-purple-500/30 transition-all duration-500">
                        <span className="text-white/90 text-sm font-medium">
                          {category.productCount} Products
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Section */}
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-500">
                      {category.name}
                    </h3>
                    <p className="text-white/70 text-lg max-w-md">
                      {category.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-white/90 text-lg">Explore Collection</span>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center transform group-hover:translate-x-2 transition-transform duration-500">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-500/20 to-transparent rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-500" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 