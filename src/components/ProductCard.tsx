"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    rating: number;
    reviews: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async () => {
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : ""
            }`}
          />
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/60">{product.category}</span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-white/60 text-sm">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>

        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-white">${product.price}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`absolute top-4 right-4 flex flex-col gap-2 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <button className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors">
          <Eye className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
} 