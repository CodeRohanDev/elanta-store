"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, Menu, X, Search, SlidersHorizontal, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import SearchSuggestions from "./SearchSuggestions";
import AdvancedSearch from "./AdvancedSearch";

interface SearchFilters {
  priceRange: [number, number];
  categories: string[];
  brands: string[];
  ratings: number[];
  availability: boolean;
  sortBy: string;
}

export default function Navigation() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSearch = (filters?: SearchFilters) => {
    if (searchQuery.trim()) {
      const queryParams = new URLSearchParams();
      queryParams.set('q', searchQuery);
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v.toString()));
          } else if (typeof value === 'boolean') {
            queryParams.set(key, value.toString());
          } else if (Array.isArray(value) && value.length === 2) {
            queryParams.set(key, value.join(','));
          } else {
            queryParams.set(key, value.toString());
          }
        });
      }
      
      router.push(`/search?${queryParams.toString()}`);
      setSearchQuery("");
      setIsSearchFocused(false);
      setIsAdvancedSearchOpen(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSearchIconClick = () => {
    if (isSearchFocused) {
      setIsSearchFocused(false);
      setIsAdvancedSearchOpen(false);
    } else {
      setIsSearchFocused(true);
      setTimeout(() => {
        searchRef.current?.focus();
      }, 100);
    }
  };

  const handleAdvancedSearchClick = () => {
    setIsAdvancedSearchOpen(!isAdvancedSearchOpen);
  };

  const handleSuggestionSelect = () => {
    setSearchQuery("");
    setIsSearchFocused(false);
    setIsAdvancedSearchOpen(false);
  };

  const handleApplyFilters = (filters: SearchFilters) => {
    handleSearch(filters);
  };

  return (
    <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[95%] max-w-7xl ${
      scrolled 
        ? "bg-black/80 backdrop-blur-md shadow-lg" 
        : "bg-black/40 backdrop-blur-sm"
    } rounded-2xl`}>
      {/* Border Gradient Effect */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 ${
        scrolled ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300`} />
      
      {/* Main Content */}
      <div className="relative container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-black">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              ELANTA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white/80 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/categories" className="text-white/80 hover:text-white transition-colors">
              Categories
            </Link>
            <Link href="/shop" className="text-white/80 hover:text-white transition-colors">
              Shop
            </Link>
            <Link href="/about" className="text-white/80 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          {/* Search and Icons */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search Form */}
            <div 
              ref={searchContainerRef} 
              className="relative"
            >
              <form 
                onSubmit={handleSearchSubmit}
                className={`relative transition-all duration-300 ${
                  isSearchFocused ? "w-96" : "w-10"
                }`}
              >
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, categories..."
                  className={`w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 pl-10 text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50 transition-all duration-300 ${
                    isSearchFocused ? "opacity-100" : "opacity-0"
                  }`}
                />
                <button
                  type="button"
                  onClick={handleSearchIconClick}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
                >
                  {isSearchFocused ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                </button>
                {isSearchFocused && (
                  <button
                    type="button"
                    onClick={handleAdvancedSearchClick}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors ${
                      isAdvancedSearchOpen ? "text-purple-400" : ""
                    }`}
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                  </button>
                )}
              </form>
              {isSearchFocused && (
                <div className="search-suggestion absolute left-0 right-0 w-96">
                  <SearchSuggestions 
                    searchQuery={searchQuery}
                    onSelect={handleSuggestionSelect}
                  />
                </div>
              )}
              {isAdvancedSearchOpen && (
                <AdvancedSearch
                  onApplyFilters={handleApplyFilters}
                  onClose={() => setIsAdvancedSearchOpen(false)}
                />
              )}
            </div>

            {/* Desktop Icons */}
            <Link href="/cart" className="text-white/80 hover:text-white transition-colors">
              <ShoppingCart className="w-6 h-6" />
            </Link>
            <Link href="/account" className="text-white/80 hover:text-white transition-colors">
              <User className="w-6 h-6" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white/80 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? "max-h-96" : "max-h-0"
        }`}>
          <div className="py-4 space-y-4 border-t border-white/5">
            {/* Mobile Search */}
            <div 
              ref={searchContainerRef} 
              className="px-4 relative"
            >
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, categories..."
                    className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 pl-10 text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50"
                  />
                  <button
                    type="button"
                    onClick={handleSearchIconClick}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80"
                  >
                    {isSearchFocused ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                  </button>
                  {isSearchFocused && (
                    <button
                      type="button"
                      onClick={handleAdvancedSearchClick}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 text-white/80 ${
                        isAdvancedSearchOpen ? "text-purple-400" : ""
                      }`}
                    >
                      <SlidersHorizontal className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </form>
              {isSearchFocused && (
                <div className="search-suggestion absolute left-4 right-4">
                  <SearchSuggestions 
                    searchQuery={searchQuery}
                    onSelect={handleSuggestionSelect}
                  />
                </div>
              )}
              {isAdvancedSearchOpen && (
                <AdvancedSearch
                  onApplyFilters={handleApplyFilters}
                  onClose={() => setIsAdvancedSearchOpen(false)}
                />
              )}
            </div>

            <Link
              href="/"
              className="block text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/categories"
              className="block text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/shop"
              className="block text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="block text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex items-center space-x-6 pt-4 border-t border-white/5">
              <Link
                href="/cart"
                className="text-white/80 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="w-6 h-6" />
              </Link>
              <Link
                href="/account"
                className="text-white/80 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* User Menu */}
      <AnimatePresence>
        {isUserMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 w-48 bg-black/90 backdrop-blur-md rounded-lg border border-white/10 overflow-hidden"
            ref={userMenuRef}
          >
            {user ? (
              <>
                <div className="p-4 border-b border-white/5">
                  <p className="text-white font-medium">{user.displayName || user.email}</p>
                  <p className="text-white/60 text-sm">{user.email}</p>
                </div>
                <div className="p-2">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="p-2">
                <Link
                  href="/login"
                  className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Create Account
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
} 