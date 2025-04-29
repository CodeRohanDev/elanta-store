"use client";

import Image from "next/image";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, "products", productId));
        if (productDoc.exists()) {
          setProduct({
            id: productDoc.id,
            ...productDoc.data()
          } as Product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-32">
        <div className="container mx-auto px-4">
          <div className="h-[600px] rounded-3xl bg-gray-900/50 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black py-32">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Product Not Found</h2>
          <p className="text-white/70">The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative h-[500px] rounded-3xl overflow-hidden">
              {product.images && product.images[selectedImage] && (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              )}
              {product.discountPrice && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-lg font-bold">
                  SAVE {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                </div>
              )}
            </div>
            
            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-purple-500 scale-105"
                        : "border-white/10 hover:border-purple-500/30"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-black text-white mb-4">{product.name}</h1>
              <div className="flex items-center gap-4">
                {product.discountPrice ? (
                  <>
                    <p className="text-3xl text-purple-400">${product.discountPrice.toFixed(2)}</p>
                    <p className="text-2xl text-white/50 line-through">${product.price.toFixed(2)}</p>
                  </>
                ) : (
                  <p className="text-3xl text-purple-400">${product.price.toFixed(2)}</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Description</h2>
              <p className="text-white/70 leading-relaxed">{product.description}</p>
            </div>

            {product.features.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-400"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(product.specifications).length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Specifications</h2>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="bg-gray-900/50 p-4 rounded-xl">
                      <p className="text-white/50 text-sm">{key}</p>
                      <p className="text-white font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-8">
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-6 rounded-xl text-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 