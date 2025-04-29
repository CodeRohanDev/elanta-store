"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User, Package, Heart, Settings, CreditCard, MapPin, Bell, ChevronRight } from "lucide-react";

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      
      // Fetch recent orders
      try {
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("date", "desc"),
          limit(3)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersData = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome back, {user.displayName?.split(' ')[0] || 'User'}</h1>
              <p className="text-white/60 mt-2">Manage your account and track your orders</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile & Quick Actions */}
            <div className="space-y-8">
              {/* Profile Card */}
              <div className="bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{user.displayName || "User"}</h2>
                    <p className="text-white/60">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <Link
                    href="/account/edit"
                    className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    Edit Profile
                  </Link>
                  <Link
                    href="/account/addresses"
                    className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                  >
                    <MapPin className="w-5 h-5" />
                    Manage Addresses
                  </Link>
                  <Link
                    href="/account/payment-methods"
                    className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                  >
                    <CreditCard className="w-5 h-5" />
                    Payment Methods
                  </Link>
                  <Link
                    href="/account/notifications"
                    className="group flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Notification Settings</h3>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white ml-auto transition-colors" />
                  </Link>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-white/60 text-sm">Total Orders</p>
                    <p className="text-2xl font-bold text-white">{orders.length}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-white/60 text-sm">Wishlist Items</p>
                    <p className="text-2xl font-bold text-white">0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Recent Orders & Activity */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Orders */}
              <div className="bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
                  <Link
                    href="/orders"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    View All
                  </Link>
                </div>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white/5 border border-white/10 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-white font-medium">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-white/60 text-sm">{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-medium">${order.total.toFixed(2)}</p>
                            <p className="text-white/60 text-sm">{order.items} items</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            order.status === 'completed' ? 'bg-green-500' :
                            order.status === 'processing' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`} />
                          <span className="text-white/80 text-sm capitalize">{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">No orders yet</p>
                    <Link
                      href="/shop"
                      className="text-purple-400 hover:text-purple-300 transition-colors mt-2 inline-block"
                    >
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>

              {/* Account Security */}
              <div className="bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Account Security</h3>
                <div className="space-y-4">
                  <Link
                    href="/change-password"
                    className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                  >
                    <span>Change Password</span>
                    <Settings className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/two-factor"
                    className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                  >
                    <span>Two-Factor Authentication</span>
                    <Settings className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 