"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bell, Mail, ShoppingCart, CreditCard, Package, Star, MessageSquare } from "lucide-react";

interface NotificationSettings {
  email: {
    orderUpdates: boolean;
    promotions: boolean;
    securityAlerts: boolean;
    newsletter: boolean;
  };
  push: {
    orderUpdates: boolean;
    promotions: boolean;
    securityAlerts: boolean;
    priceAlerts: boolean;
  };
  sms: {
    orderUpdates: boolean;
    promotions: boolean;
    securityAlerts: boolean;
  };
}

export default function NotificationsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      orderUpdates: true,
      promotions: true,
      securityAlerts: true,
      newsletter: true,
    },
    push: {
      orderUpdates: true,
      promotions: true,
      securityAlerts: true,
      priceAlerts: true,
    },
    sms: {
      orderUpdates: true,
      promotions: true,
      securityAlerts: true,
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      await fetchSettings(user.uid);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchSettings = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists() && userDoc.data().notificationSettings) {
        setSettings(userDoc.data().notificationSettings);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setError("Failed to load notification settings");
    }
  };

  const handleToggle = async <T extends keyof NotificationSettings>(
    category: T,
    type: keyof NotificationSettings[T]
  ) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const newSettings = {
        ...settings,
        [category]: {
          ...settings[category],
          [type]: !settings[category][type],
        },
      };

      await updateDoc(doc(db, "users", user.uid), {
        notificationSettings: newSettings,
      });

      setSettings(newSettings);
      setSuccess("Settings updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error updating settings:", error);
      setError("Failed to update settings");
    } finally {
      setSaving(false);
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
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/account"
              className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Account
            </Link>
          </div>

          <div className="bg-gradient-to-br from-black/50 to-purple-900/10 backdrop-blur-md rounded-3xl border border-white/10 p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Notification Settings</h1>
              <p className="text-white/60">Manage your notification preferences</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 backdrop-blur-sm"
              >
                {success}
              </motion.div>
            )}

            <div className="space-y-8">
              {/* Email Notifications */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Email Notifications</h2>
                    <p className="text-white/60">Manage your email notification preferences</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-purple-400" />
                      <div>
                        <h3 className="text-white font-medium">Order Updates</h3>
                        <p className="text-white/60 text-sm">Get notified about your order status</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle("email", "orderUpdates")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.email.orderUpdates ? "bg-purple-600" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.email.orderUpdates ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-purple-400" />
                      <div>
                        <h3 className="text-white font-medium">Promotions</h3>
                        <p className="text-white/60 text-sm">Receive special offers and discounts</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle("email", "promotions")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.email.promotions ? "bg-purple-600" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.email.promotions ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-purple-400" />
                      <div>
                        <h3 className="text-white font-medium">Security Alerts</h3>
                        <p className="text-white/60 text-sm">Get notified about account security</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle("email", "securityAlerts")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.email.securityAlerts ? "bg-purple-600" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.email.securityAlerts ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-purple-400" />
                      <div>
                        <h3 className="text-white font-medium">Newsletter</h3>
                        <p className="text-white/60 text-sm">Receive our monthly newsletter</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle("email", "newsletter")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.email.newsletter ? "bg-purple-600" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.email.newsletter ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Push Notifications */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Push Notifications</h2>
                    <p className="text-white/60">Manage your push notification preferences</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-purple-400" />
                      <div>
                        <h3 className="text-white font-medium">Order Updates</h3>
                        <p className="text-white/60 text-sm">Get notified about your order status</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle("push", "orderUpdates")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.push.orderUpdates ? "bg-purple-600" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.push.orderUpdates ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-purple-400" />
                      <div>
                        <h3 className="text-white font-medium">Promotions</h3>
                        <p className="text-white/60 text-sm">Receive special offers and discounts</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle("push", "promotions")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.push.promotions ? "bg-purple-600" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.push.promotions ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-purple-400" />
                      <div>
                        <h3 className="text-white font-medium">Security Alerts</h3>
                        <p className="text-white/60 text-sm">Get notified about account security</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle("push", "securityAlerts")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.push.securityAlerts ? "bg-purple-600" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.push.securityAlerts ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="w-5 h-5 text-purple-400" />
                      <div>
                        <h3 className="text-white font-medium">Price Alerts</h3>
                        <p className="text-white/60 text-sm">Get notified when prices drop</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle("push", "priceAlerts")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.push.priceAlerts ? "bg-purple-600" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.push.priceAlerts ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* SMS Notifications */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">SMS Notifications</h2>
                    <p className="text-white/60">Manage your SMS notification preferences</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-purple-400" />
                      <div>
                        <h3 className="text-white font-medium">Order Updates</h3>
                        <p className="text-white/60 text-sm">Get notified about your order status</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle("sms", "orderUpdates")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.sms.orderUpdates ? "bg-purple-600" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.sms.orderUpdates ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-purple-400" />
                      <div>
                        <h3 className="text-white font-medium">Promotions</h3>
                        <p className="text-white/60 text-sm">Receive special offers and discounts</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle("sms", "promotions")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.sms.promotions ? "bg-purple-600" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.sms.promotions ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-purple-400" />
                      <div>
                        <h3 className="text-white font-medium">Security Alerts</h3>
                        <p className="text-white/60 text-sm">Get notified about account security</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle("sms", "securityAlerts")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.sms.securityAlerts ? "bg-purple-600" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.sms.securityAlerts ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 