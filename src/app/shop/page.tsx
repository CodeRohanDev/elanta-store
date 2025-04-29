"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Check } from "lucide-react";

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
  rating?: number;
  reviews?: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  productCount?: number;
}

interface PriceRange {
  min: number;
  max: number;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 1000 });
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    features: true,
    ratings: true
  });
  const [showFeatureModal, setShowFeatureModal] = useState(false);

  // Get all unique features from products
  const allFeatures = Array.from(new Set(products.flatMap(product => product.features)));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Start with all products
        let productsQuery = query(collection(db, "products"), where("isActive", "==", true));
        
        // Apply category filter only if a specific category is selected
        if (selectedCategories.length > 0) {
          productsQuery = query(productsQuery, where("category", "in", selectedCategories));
        }
        
        // Apply sorting
        if (sortBy === "price-low") {
          productsQuery = query(productsQuery, orderBy("price", "asc"));
        } else if (sortBy === "price-high") {
          productsQuery = query(productsQuery, orderBy("price", "desc"));
        } else if (sortBy === "rating" && products.length > 0) {
          // Only apply rating sort if we have products with ratings
          productsQuery = query(productsQuery, orderBy("rating", "desc"));
        }
        // Note: Removed the featured filter from the initial query to show all products

        const productsSnapshot = await getDocs(productsQuery);
        let productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];

        // Apply search filter
        if (searchQuery) {
          productsData = productsData.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Apply price range filter
        productsData = productsData.filter(product => 
          product.price >= priceRange.min && 
          product.price <= priceRange.max
        );

        // Apply features filter
        if (selectedFeatures.length > 0) {
          productsData = productsData.filter(product =>
            selectedFeatures.every(feature => product.features.includes(feature))
          );
        }

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategories, sortBy, searchQuery, priceRange, selectedFeatures]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get the first 5 items plus any selected items
  const getVisibleCategories = () => {
    const firstFive = categories.slice(0, 5);
    const selected = categories.filter(cat => selectedCategories.includes(cat.id));
    const combined = [...new Set([...firstFive, ...selected])];
    return combined.slice(0, 5);
  };

  const getVisibleFeatures = () => {
    const firstFive = allFeatures.slice(0, 5);
    const selected = allFeatures.filter(feature => selectedFeatures.includes(feature));
    const combined = [...new Set([...firstFive, ...selected])];
    return combined.slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-black py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>

          {/* Sidebar Filters */}
          <div className={`
            fixed md:static inset-0 z-50 bg-black/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none
            transform transition-transform duration-300 ease-in-out
            ${showMobileFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            w-80 md:w-64
          `}>
            <div className="p-6 md:p-0">
              {/* Mobile Close Button */}
              <button
                onClick={() => setShowMobileFilters(false)}
                className="md:hidden absolute top-4 right-4 text-white/80 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-xl font-bold text-white mb-6">Filters</h2>

              {/* Categories Section */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('categories')}
                  className="flex items-center justify-between w-full text-white/80 hover:text-white mb-4"
                >
                  <span className="font-medium">Categories</span>
                  {expandedSections.categories ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {expandedSections.categories && (
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategories([])}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategories.length === 0
                          ? "bg-purple-500/20 text-purple-400"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      All Categories
                    </button>
                    {getVisibleCategories().map(category => (
                      <button
                        key={category.id}
                        onClick={() => toggleCategory(category.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedCategories.includes(category.id)
                            ? "bg-purple-500/20 text-purple-400"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category.name}</span>
                          {selectedCategories.includes(category.id) && (
                            <Check className="w-5 h-5" />
                          )}
                        </div>
                        {category.productCount && (
                          <span className="text-sm text-white/40">({category.productCount})</span>
                        )}
                      </button>
                    ))}
                    {categories.length > 5 && (
                      <button
                        onClick={() => setShowCategoryModal(true)}
                        className="w-full text-left px-4 py-2 rounded-lg text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
                      >
                        Explore More Categories
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Price Range Section */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('price')}
                  className="flex items-center justify-between w-full text-white/80 hover:text-white mb-4"
                >
                  <span className="font-medium">Price Range</span>
                  {expandedSections.price ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {expandedSections.price && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                        className="w-24 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                        placeholder="Min"
                      />
                      <span className="text-white/60">to</span>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                        className="w-24 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Features Section */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('features')}
                  className="flex items-center justify-between w-full text-white/80 hover:text-white mb-4"
                >
                  <span className="font-medium">Features</span>
                  {expandedSections.features ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {expandedSections.features && (
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedFeatures([])}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedFeatures.length === 0
                          ? "bg-purple-500/20 text-purple-400"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      All Features
                    </button>
                    {getVisibleFeatures().map(feature => (
                      <button
                        key={feature}
                        onClick={() => toggleFeature(feature)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedFeatures.includes(feature)
                            ? "bg-purple-500/20 text-purple-400"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{feature}</span>
                          {selectedFeatures.includes(feature) && (
                            <Check className="w-5 h-5" />
                          )}
                        </div>
                      </button>
                    ))}
                    {allFeatures.length > 5 && (
                      <button
                        onClick={() => setShowFeatureModal(true)}
                        className="w-full text-left px-4 py-2 rounded-lg text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
                      >
                        Explore More Features
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Ratings Section */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('ratings')}
                  className="flex items-center justify-between w-full text-white/80 hover:text-white mb-4"
                >
                  <span className="font-medium">Ratings</span>
                  {expandedSections.ratings ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {expandedSections.ratings && (
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setSortBy("rating")}
                        className="w-full text-left px-4 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 flex items-center gap-2"
                      >
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < rating ? "text-yellow-400" : "text-white/20"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-white/40">and up</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 focus:border-purple-500 focus:outline-none text-white placeholder-white/50"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 focus:border-purple-500 focus:outline-none text-white"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[500px] rounded-3xl bg-gray-900/50 animate-pulse"
                  />
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
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

                      {/* Rating Badge */}
                      {product.rating && (
                        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>{product.rating.toFixed(1)}</span>
                          {product.reviews && (
                            <span className="text-white/60">({product.reviews})</span>
                          )}
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
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          // TODO: Implement add to cart functionality
                          console.log('Add to cart:', product.id);
                        }}
                        className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-xl text-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <h3 className="text-2xl font-bold text-white/80">No products found</h3>
                  <p className="text-white/60 mt-2">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Select Categories</h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    selectedCategories.includes(category.id)
                      ? "bg-purple-500/20 text-purple-400"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{category.name}</span>
                  {selectedCategories.includes(category.id) && (
                    <Check className="w-5 h-5" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-6 py-3 rounded-xl text-white/80 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Features Modal */}
      {showFeatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Select Features</h3>
              <button
                onClick={() => setShowFeatureModal(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allFeatures.map(feature => (
                <button
                  key={feature}
                  onClick={() => toggleFeature(feature)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    selectedFeatures.includes(feature)
                      ? "bg-purple-500/20 text-purple-400"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{feature}</span>
                  {selectedFeatures.includes(feature) && (
                    <Check className="w-5 h-5" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowFeatureModal(false)}
                className="px-6 py-3 rounded-xl text-white/80 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowFeatureModal(false)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 