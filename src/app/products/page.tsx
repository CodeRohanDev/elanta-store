"use client";

import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  features: string[];
  specifications: Record<string, string>;
  isFeatured: boolean;
  isActive: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, "products"));
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        
        // Filter only active products
        const activeProducts = productsData.filter(product => product.isActive);
        setProducts(activeProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-black py-32">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-black mb-16 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            OUR PRODUCTS
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-[500px] rounded-3xl bg-gray-900/50 animate-pulse"
              />
            ))
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="group bg-gray-900/80 rounded-3xl overflow-hidden border-2 border-white/10 hover:border-purple-500/50 transition-all duration-300 hover-glow"
              >
                <div className="relative h-80">
                  {product.images && product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Discount Badge */}
                  {product.discountPrice && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                      SAVE {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                    </div>
                  )}
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-black mb-4 group-hover:text-purple-400 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-4 mb-4">
                    {product.discountPrice ? (
                      <>
                        <p className="text-2xl text-purple-400">${product.discountPrice.toFixed(2)}</p>
                        <p className="text-xl text-white/50 line-through">${product.price.toFixed(2)}</p>
                      </>
                    ) : (
                      <p className="text-2xl text-purple-400">${product.price.toFixed(2)}</p>
                    )}
                  </div>
                  
                  <p className="text-white/70 mb-6 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    href={`/product/${product.id}`}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-xl text-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    View Details
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 