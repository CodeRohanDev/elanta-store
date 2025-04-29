"use client";

import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Heart, ArrowLeft, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  parentId?: string;
  image?: string;
}

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

// Fixed positions and animations for particles
const particles = [
  { left: "10%", top: "20%", duration: "4s", delay: "0.5s" },
  { left: "30%", top: "40%", duration: "5s", delay: "1s" },
  { left: "50%", top: "60%", duration: "6s", delay: "1.5s" },
  { left: "70%", top: "80%", duration: "4.5s", delay: "0.8s" },
  { left: "90%", top: "30%", duration: "5.5s", delay: "1.2s" },
  { left: "20%", top: "70%", duration: "4.2s", delay: "0.7s" },
  { left: "40%", top: "10%", duration: "5.8s", delay: "1.3s" },
  { left: "60%", top: "50%", duration: "4.8s", delay: "0.9s" },
  { left: "80%", top: "90%", duration: "5.2s", delay: "1.1s" },
  { left: "15%", top: "40%", duration: "4.7s", delay: "0.6s" },
];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, addToWishlist, items, updateQuantity } = useCart();

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
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, "products"));
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.images[0],
      });
      toast.success("Added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleUpdateQuantity = async (e: React.MouseEvent, productId: string, newQuantity: number) => {
    e.preventDefault();
    try {
      await updateQuantity(productId, newQuantity);
      toast.success("Cart updated");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    try {
      await addToWishlist({
        id: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.images[0],
      });
      toast.success("Added to wishlist");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist");
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Enhanced Abstract 3D Effect */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/80 via-black to-black" />
        
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Dynamic Floating Orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl animate-float hover:scale-110 transition-transform duration-500" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl animate-float-delayed hover:scale-110 transition-transform duration-500" />
          <div className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full bg-gradient-to-r from-purple-500/15 to-pink-500/15 blur-2xl animate-float-reverse hover:scale-110 transition-transform duration-500" />
          
          {/* Animated Grid with Enhanced Effects */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 grid grid-cols-12 gap-4 p-4">
              {Array.from({ length: 144 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-white/5 animate-pulse group hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300"
                  style={{
                    animationDelay: `${(i % 12) * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0">
            {particles.map((particle, index) => (
              <div
                key={index}
                className="absolute w-2 h-2 rounded-full bg-white/20 animate-float"
                style={{
                  left: particle.left,
                  top: particle.top,
                  animationDuration: particle.duration,
                  animationDelay: particle.delay,
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center justify-between">
          {/* Left Content with Enhanced Effects */}
          <div className="max-w-2xl">
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 animate-gradient hover:scale-105 transition-transform duration-300 inline-block">
                ELANTA
              </span>
              <br />
              <span className="text-white/90 hover:text-white transition-colors duration-300">STORE</span>
            </h1>
            <p className="text-2xl md:text-3xl text-white/80 mb-12 leading-relaxed font-medium">
              Where <span className="text-purple-400 font-bold hover:text-purple-300 transition-colors duration-300">BOLD</span> meets <span className="text-pink-400 font-bold hover:text-pink-300 transition-colors duration-300">BEAUTY</span>. 
              Your ultimate destination for premium shopping.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                href="/shop"
                className="group relative px-12 py-6 text-xl font-bold rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 hover-glow flex items-center justify-center"
              >
                <span className="relative z-10">EXPLORE NOW</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                href="/new-arrivals"
                className="group px-12 py-6 text-xl font-bold rounded-2xl border-4 border-white/20 hover:border-purple-500/50 hover:bg-white/5 transition-all hover:scale-105"
              >
                NEW ARRIVALS
              </Link>
            </div>
          </div>

          {/* Right Side - Enhanced Abstract 3D Showcase */}
          <div className="hidden lg:block relative w-[500px] h-[500px]">
            {/* Dynamic 3D Structure */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 group">
              {/* Main Structure */}
              <div className="relative w-full h-full animate-float hover:scale-110 transition-transform duration-500">
                {/* Base Layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-3xl border-2 border-white/20 transform rotate-0 group-hover:rotate-3 transition-transform duration-500" />
                
                {/* Floating Elements */}
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded-2xl border border-white/20 transform rotate-12 animate-float-delayed" />
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-white/20 transform -rotate-12 animate-float-reverse" />
                
                {/* Center Element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-purple-500/50 to-pink-500/50 rounded-2xl border-2 border-white/30 transform group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 rounded-xl transform rotate-45 group-hover:rotate-90 transition-transform duration-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Floating Elements */}
            <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-2xl animate-float-delayed hover:scale-110 transition-transform duration-500" />
            <div className="absolute bottom-1/3 left-1/3 w-40 h-40 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-2xl animate-float-reverse hover:scale-110 transition-transform duration-500" />

            {/* Interactive Decorative Elements */}
            <div className="absolute top-1/4 right-1/4 w-4 h-4 rounded-full bg-purple-500 animate-ping hover:scale-150 transition-transform duration-300" />
            <div className="absolute bottom-1/3 left-1/3 w-3 h-3 rounded-full bg-pink-500 animate-ping hover:scale-150 transition-transform duration-300" style={{ animationDelay: '0.5s' }} />
            
            {/* Floating Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96">
              <div className="absolute inset-0 border-2 border-purple-500/20 rounded-full animate-spin-slow" />
              <div className="absolute inset-8 border-2 border-pink-500/20 rounded-full animate-spin-slow-reverse" />
              <div className="absolute inset-16 border-2 border-purple-500/10 rounded-full animate-spin-slow" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories with 3D Cards */}
      <section className="py-32 container mx-auto px-4">
        <h2 className="text-5xl font-black mb-16 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            SHOP BY CATEGORY
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[400px] rounded-3xl bg-gray-900/50 animate-pulse"
              />
            ))
          ) : (
            categories.slice(0, 4).map((category) => (
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
                    <div className="w-12 h-12 rounded-full backdrop-blur-md bg-white/5 border border-white/10 group-hover:border-purple-500/30 transition-all duration-500 flex items-center justify-center transform group-hover:rotate-180 transition-transform duration-500">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
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
        
        {/* Explore More Button */}
        <div className="mt-16 text-center">
          <Link
            href="/categories"
            className="group inline-flex items-center px-8 py-4 text-xl font-bold rounded-2xl border-4 border-white/20 hover:border-purple-500/50 hover:bg-white/5 transition-all hover:scale-105"
          >
            EXPLORE MORE CATEGORIES
            <svg className="w-6 h-6 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Featured Products with Neon Glow */}
      <section className="py-32 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-black mb-16 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              FEATURED PRODUCTS
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[500px] rounded-3xl bg-gray-900/50 animate-pulse"
                />
              ))
            ) : (
              products
                .filter(product => product.isFeatured)
                .slice(0, 4)
                .map((product) => {
                  const cartItem = items.find(item => item.id === product.id);
                  const quantity = cartItem?.quantity || 0;

                  return (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
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

                        {/* Quick Actions */}
                        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleAddToWishlist(e, product)}
                            className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                            title="Add to wishlist"
                          >
                            <Heart className="w-5 h-5 text-white" />
                          </button>
                        </div>
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
                        <div className="flex flex-wrap gap-2">
                          {product.features.slice(0, 2).map((feature, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        {quantity > 0 ? (
                          <div className="flex items-center justify-between mt-6 bg-white/5 rounded-xl p-2">
                            <button
                              onClick={(e) => handleUpdateQuantity(e, product.id, quantity - 1)}
                              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-white font-medium">{quantity}</span>
                            <button
                              onClick={(e) => handleUpdateQuantity(e, product.id, quantity + 1)}
                              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={(e) => handleAddToCart(e, product)}
                            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-xl text-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="w-5 h-5" />
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </Link>
                  );
                })
            )}
          </div>
          
          {/* Explore More Button */}
          <div className="mt-16 text-center">
            <Link
              href="/shop"
              className="group inline-flex items-center px-8 py-4 text-xl font-bold rounded-2xl border-4 border-white/20 hover:border-purple-500/50 hover:bg-white/5 transition-all hover:scale-105"
            >
              EXPLORE MORE PRODUCTS
              <svg className="w-6 h-6 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter with Neon Border */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-black to-black" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-black mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                STAY UPDATED
              </span>
            </h2>
            <p className="text-2xl text-white/80 mb-12">
              Subscribe to our newsletter for exclusive offers and the latest trends.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-8 py-6 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 focus:border-purple-500 focus:outline-none text-xl text-white placeholder-white/50"
                  suppressHydrationWarning
                />
              </div>
              <button className="px-12 py-6 rounded-2xl text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 hover-glow">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
