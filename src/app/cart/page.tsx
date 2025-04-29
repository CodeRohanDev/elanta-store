"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Heart, Clock } from "lucide-react";
import { toast } from "sonner";

export default function CartPage() {
  const {
    items,
    savedItems,
    removeFromCart,
    updateQuantity,
    saveForLater,
    moveToCart,
    moveToWishlist,
    totalItems,
    totalPrice,
  } = useCart();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setLoading(true);
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setLoading(true);
    try {
      await removeFromCart(itemId);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveForLater = async (itemId: string) => {
    setLoading(true);
    try {
      await saveForLater(itemId);
      toast.success("Item saved for later");
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error("Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToCart = async (itemId: string) => {
    setLoading(true);
    try {
      await moveToCart(itemId);
      toast.success("Item moved to cart");
    } catch (error) {
      console.error("Error moving item:", error);
      toast.error("Failed to move item");
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToWishlist = async (itemId: string) => {
    setLoading(true);
    try {
      await moveToWishlist(itemId);
      toast.success("Item moved to wishlist");
    } catch (error) {
      console.error("Error moving item:", error);
      toast.error("Failed to move item");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-white/40" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Your Cart is Empty</h1>
            <p className="text-white/60 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/"
              className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Continue Shopping
            </Link>
          </div>

          <div className="bg-gradient-to-br from-black/50 to-purple-900/10 backdrop-blur-md rounded-3xl border border-white/10 p-8">
            <h1 className="text-4xl font-bold text-white mb-8">Shopping Cart</h1>

            <div className="space-y-6">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex items-center gap-6 p-4 bg-white/5 border border-white/10 rounded-2xl"
                  >
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {item.name}
                      </h3>
                      <p className="text-xl font-bold text-white">${item.price}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={loading || item.quantity <= 1}
                          className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={loading}
                          className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveForLater(item.id)}
                          disabled={loading}
                          className="p-2 text-white/60 hover:text-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Save for later"
                        >
                          <Clock className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleMoveToWishlist(item.id)}
                          disabled={loading}
                          className="p-2 text-white/60 hover:text-pink-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move to wishlist"
                        >
                          <Heart className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={loading}
                          className="p-2 text-white/60 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {savedItems.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-white mb-6">Saved for Later</h2>
                <div className="space-y-6">
                  <AnimatePresence>
                    {savedItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex items-center gap-6 p-4 bg-white/5 border border-white/10 rounded-2xl"
                      >
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {item.name}
                          </h3>
                          <p className="text-xl font-bold text-white">${item.price}</p>
                        </div>

                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleMoveToCart(item.id)}
                            disabled={loading}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Move to Cart
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={loading}
                            className="p-2 text-white/60 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/60">Total Items:</span>
                <span className="text-white font-medium">{totalItems}</span>
              </div>
              <div className="flex justify-between items-center mb-8">
                <span className="text-white/60">Total Price:</span>
                <span className="text-2xl font-bold text-white">${totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/checkout"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 text-center"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 