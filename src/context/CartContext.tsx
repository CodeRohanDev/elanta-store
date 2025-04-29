"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface SavedItem extends CartItem {
  savedAt: number;
}

interface CartContextType {
  items: CartItem[];
  savedItems: SavedItem[];
  wishlist: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  saveForLater: (itemId: string) => Promise<void>;
  moveToCart: (itemId: string) => Promise<void>;
  addToWishlist: (item: Omit<CartItem, "quantity">) => Promise<void>;
  removeFromWishlist: (itemId: string) => Promise<void>;
  moveToWishlist: (itemId: string) => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [wishlist, setWishlist] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchCartData(user.uid);
      } else {
        setItems([]);
        setSavedItems([]);
        setWishlist([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCartData = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setItems(data.cart || []);
        setSavedItems(data.savedItems || []);
        setWishlist(data.wishlist || []);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const updateFirestore = async (data: any) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), data, { merge: true });
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  };

  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    const existingItem = items.find((i) => i.id === item.id);
    if (existingItem) {
      await updateQuantity(item.id, existingItem.quantity + 1);
    } else {
      const newItem = { ...item, quantity: 1 };
      const newItems = [...items, newItem];
      setItems(newItems);
      await updateFirestore({ cart: newItems });
    }
  };

  const removeFromCart = async (itemId: string) => {
    const newItems = items.filter((item) => item.id !== itemId);
    setItems(newItems);
    await updateFirestore({ cart: newItems });
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }
    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    setItems(newItems);
    await updateFirestore({ cart: newItems });
  };

  const clearCart = async () => {
    setItems([]);
    await updateFirestore({ cart: [] });
  };

  const saveForLater = async (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const newItems = items.filter((i) => i.id !== itemId);
    const newSavedItem = { ...item, savedAt: Date.now() };
    const newSavedItems = [...savedItems, newSavedItem];

    setItems(newItems);
    setSavedItems(newSavedItems);
    await updateFirestore({
      cart: newItems,
      savedItems: newSavedItems,
    });
  };

  const moveToCart = async (itemId: string) => {
    const item = savedItems.find((i) => i.id === itemId);
    if (!item) return;

    const { savedAt, ...cartItem } = item;
    const newSavedItems = savedItems.filter((i) => i.id !== itemId);
    const existingItem = items.find((i) => i.id === itemId);

    if (existingItem) {
      await updateQuantity(itemId, existingItem.quantity + 1);
    } else {
      const newItems = [...items, { ...cartItem, quantity: 1 }];
      setItems(newItems);
      await updateFirestore({ cart: newItems });
    }

    setSavedItems(newSavedItems);
    await updateFirestore({ savedItems: newSavedItems });
  };

  const addToWishlist = async (item: Omit<CartItem, "quantity">) => {
    const existingItem = wishlist.find((i) => i.id === item.id);
    if (!existingItem) {
      const newWishlist = [...wishlist, { ...item, quantity: 1 }];
      setWishlist(newWishlist);
      await updateFirestore({ wishlist: newWishlist });
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    const newWishlist = wishlist.filter((item) => item.id !== itemId);
    setWishlist(newWishlist);
    await updateFirestore({ wishlist: newWishlist });
  };

  const moveToWishlist = async (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const { quantity, ...wishlistItem } = item;
    await removeFromCart(itemId);
    await addToWishlist(wishlistItem);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        savedItems,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        saveForLater,
        moveToCart,
        addToWishlist,
        removeFromWishlist,
        moveToWishlist,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
} 