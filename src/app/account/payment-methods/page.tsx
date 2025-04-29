"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, CreditCard, Edit2, Trash2, Check, X, Smartphone, Wallet, Banknote } from "lucide-react";

type PaymentType = "card" | "upi" | "netbanking" | "wallet";

interface BasePaymentMethod {
  id: string;
  type: PaymentType;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CardPaymentMethod extends BasePaymentMethod {
  type: "card";
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cardType: "visa" | "mastercard" | "amex" | "discover";
}

interface UPIPaymentMethod extends BasePaymentMethod {
  type: "upi";
  upiId: string;
  provider: string;
}

interface NetBankingPaymentMethod extends BasePaymentMethod {
  type: "netbanking";
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

interface WalletPaymentMethod extends BasePaymentMethod {
  type: "wallet";
  walletName: string;
  walletId: string;
}

type PaymentMethod = CardPaymentMethod | UPIPaymentMethod | NetBankingPaymentMethod | WalletPaymentMethod;

export default function PaymentMethodsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<PaymentType>("card");
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    // Card fields
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    // UPI fields
    upiId: "",
    provider: "",
    // Net Banking fields
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    // Wallet fields
    walletName: "",
    walletId: "",
    // Common fields
    isDefault: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      await fetchPaymentMethods(user.uid);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchPaymentMethods = async (userId: string) => {
    try {
      const paymentMethodsQuery = query(
        collection(db, "paymentMethods"),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(paymentMethodsQuery);
      const paymentMethodsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PaymentMethod[];
      setPaymentMethods(paymentMethodsData);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      setError("Failed to load payment methods");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const paymentMethodData: any = {
        type: selectedType,
        isDefault: formData.isDefault,
        userId: user.uid,
        updatedAt: new Date().toISOString(),
      };

      if (selectedType === "card") {
        const firstDigit = formData.cardNumber.charAt(0);
        let cardType: CardPaymentMethod["cardType"] = "visa";
        if (firstDigit === "5") cardType = "mastercard";
        else if (firstDigit === "3") cardType = "amex";
        else if (firstDigit === "6") cardType = "discover";

        paymentMethodData.cardNumber = formData.cardNumber;
        paymentMethodData.cardHolder = formData.cardHolder;
        paymentMethodData.expiryDate = formData.expiryDate;
        paymentMethodData.cardType = cardType;
      } else if (selectedType === "upi") {
        paymentMethodData.upiId = formData.upiId;
        paymentMethodData.provider = formData.provider;
      } else if (selectedType === "netbanking") {
        paymentMethodData.bankName = formData.bankName;
        paymentMethodData.accountNumber = formData.accountNumber;
        paymentMethodData.accountHolder = formData.accountHolder;
      } else if (selectedType === "wallet") {
        paymentMethodData.walletName = formData.walletName;
        paymentMethodData.walletId = formData.walletId;
      }

      if (isEditing) {
        const paymentMethodDoc = doc(db, "paymentMethods", isEditing);
        await updateDoc(paymentMethodDoc, paymentMethodData);
      } else {
        paymentMethodData.createdAt = new Date().toISOString();
        await addDoc(collection(db, "paymentMethods"), paymentMethodData);
      }

      await fetchPaymentMethods(user.uid);
      setIsAdding(false);
      setIsEditing(null);
      resetFormData();
    } catch (error) {
      console.error("Error saving payment method:", error);
      setError("Failed to save payment method");
    }
  };

  const resetFormData = () => {
    setFormData({
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      upiId: "",
      provider: "",
      bankName: "",
      accountNumber: "",
      accountHolder: "",
      walletName: "",
      walletId: "",
      isDefault: false,
    });
  };

  const handleDelete = async (paymentMethodId: string) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return;

    try {
      await deleteDoc(doc(db, "paymentMethods", paymentMethodId));
      await fetchPaymentMethods(user.uid);
    } catch (error) {
      console.error("Error deleting payment method:", error);
      setError("Failed to delete payment method");
    }
  };

  const handleEdit = (paymentMethod: PaymentMethod) => {
    setIsEditing(paymentMethod.id);
    setSelectedType(paymentMethod.type);
    setFormData(prev => ({
      ...prev,
      isDefault: paymentMethod.isDefault,
      ...(paymentMethod.type === "card" && {
        cardNumber: paymentMethod.cardNumber,
        cardHolder: paymentMethod.cardHolder,
        expiryDate: paymentMethod.expiryDate,
      }),
      ...(paymentMethod.type === "upi" && {
        upiId: paymentMethod.upiId,
        provider: paymentMethod.provider,
      }),
      ...(paymentMethod.type === "netbanking" && {
        bankName: paymentMethod.bankName,
        accountNumber: paymentMethod.accountNumber,
        accountHolder: paymentMethod.accountHolder,
      }),
      ...(paymentMethod.type === "wallet" && {
        walletName: paymentMethod.walletName,
        walletId: paymentMethod.walletId,
      }),
    }));
  };

  const renderPaymentMethodCard = (method: PaymentMethod) => {
    const getIcon = () => {
      switch (method.type) {
        case "card":
          return <CreditCard className="w-6 h-6 text-purple-400" />;
        case "upi":
          return <Smartphone className="w-6 h-6 text-purple-400" />;
        case "netbanking":
          return <Banknote className="w-6 h-6 text-purple-400" />;
        case "wallet":
          return <Wallet className="w-6 h-6 text-purple-400" />;
      }
    };

    const getTitle = () => {
      switch (method.type) {
        case "card":
          return method.cardHolder;
        case "upi":
          return method.upiId;
        case "netbanking":
          return method.accountHolder;
        case "wallet":
          return method.walletName;
      }
    };

    const getDetails = () => {
      switch (method.type) {
        case "card":
          return (
            <>
              <p>•••• •••• •••• {method.cardNumber.slice(-4)}</p>
              <p>Expires {method.expiryDate}</p>
              <p className="capitalize">{method.cardType}</p>
            </>
          );
        case "upi":
          return (
            <>
              <p>{method.upiId}</p>
              <p className="capitalize">{method.provider}</p>
            </>
          );
        case "netbanking":
          return (
            <>
              <p>{method.bankName}</p>
              <p>••••••••{method.accountNumber.slice(-4)}</p>
            </>
          );
        case "wallet":
          return (
            <>
              <p>{method.walletName}</p>
              <p>••••••••{method.walletId.slice(-4)}</p>
            </>
          );
      }
    };

    return (
      <motion.div
        key={method.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-colors"
      >
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleEdit(method)}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(method.id)}
            className="p-2 text-white/60 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-white">{getTitle()}</h3>
              {method.isDefault && (
                <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-sm rounded-full">
                  Default
                </span>
              )}
            </div>
            <div className="space-y-1 text-white/60">
              {getDetails()}
            </div>
          </div>
        </div>
      </motion.div>
    );
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
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Payment Methods</h1>
                <p className="text-white/60">Manage your saved payment methods</p>
              </div>
              <button
                onClick={() => setIsAdding(true)}
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                Add Payment Method
              </button>
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

            {/* Payment Methods List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paymentMethods.map(renderPaymentMethodCard)}

              {paymentMethods.length === 0 && !isAdding && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-2 text-center py-12"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <CreditCard className="w-10 h-10 text-white/40" />
                  </div>
                  <p className="text-white/60 text-lg mb-2">No payment methods saved yet</p>
                  <p className="text-white/40">Add your first payment method to get started</p>
                </motion.div>
              )}
            </div>

            {/* Add/Edit Form */}
            <AnimatePresence>
              {(isAdding || isEditing) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-white">
                      {isEditing ? "Edit Payment Method" : "Add New Payment Method"}
                    </h3>
                    <button
                      onClick={() => {
                        setIsAdding(false);
                        setIsEditing(null);
                        resetFormData();
                      }}
                      className="p-2 text-white/60 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {!isEditing && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <button
                        onClick={() => setSelectedType("card")}
                        className={`p-4 rounded-xl border transition-all ${
                          selectedType === "card"
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-white/10 hover:border-purple-500/30"
                        }`}
                      >
                        <CreditCard className="w-6 h-6 mx-auto mb-2 text-white" />
                        <p className="text-sm text-center text-white">Card</p>
                      </button>
                      <button
                        onClick={() => setSelectedType("upi")}
                        className={`p-4 rounded-xl border transition-all ${
                          selectedType === "upi"
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-white/10 hover:border-purple-500/30"
                        }`}
                      >
                        <Smartphone className="w-6 h-6 mx-auto mb-2 text-white" />
                        <p className="text-sm text-center text-white">UPI</p>
                      </button>
                      <button
                        onClick={() => setSelectedType("netbanking")}
                        className={`p-4 rounded-xl border transition-all ${
                          selectedType === "netbanking"
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-white/10 hover:border-purple-500/30"
                        }`}
                      >
                        <Banknote className="w-6 h-6 mx-auto mb-2 text-white" />
                        <p className="text-sm text-center text-white">Net Banking</p>
                      </button>
                      <button
                        onClick={() => setSelectedType("wallet")}
                        className={`p-4 rounded-xl border transition-all ${
                          selectedType === "wallet"
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-white/10 hover:border-purple-500/30"
                        }`}
                      >
                        <Wallet className="w-6 h-6 mx-auto mb-2 text-white" />
                        <p className="text-sm text-center text-white">Wallet</p>
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {selectedType === "card" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-2">
                            Card Holder Name
                          </label>
                          <input
                            type="text"
                            name="cardHolder"
                            value={formData.cardHolder}
                            onChange={(e) => setFormData(prev => ({ ...prev, cardHolder: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="John Doe"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                      </>
                    )}

                    {selectedType === "upi" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-2">
                            UPI ID
                          </label>
                          <input
                            type="text"
                            name="upiId"
                            value={formData.upiId}
                            onChange={(e) => setFormData(prev => ({ ...prev, upiId: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="username@upi"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-2">
                            Provider
                          </label>
                          <input
                            type="text"
                            name="provider"
                            value={formData.provider}
                            onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Google Pay, PhonePe, etc."
                            required
                          />
                        </div>
                      </>
                    )}

                    {selectedType === "netbanking" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-2">
                            Bank Name
                          </label>
                          <input
                            type="text"
                            name="bankName"
                            value={formData.bankName}
                            onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Bank Name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-2">
                            Account Number
                          </label>
                          <input
                            type="text"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Account Number"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-2">
                            Account Holder Name
                          </label>
                          <input
                            type="text"
                            name="accountHolder"
                            value={formData.accountHolder}
                            onChange={(e) => setFormData(prev => ({ ...prev, accountHolder: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Account Holder Name"
                            required
                          />
                        </div>
                      </>
                    )}

                    {selectedType === "wallet" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-2">
                            Wallet Name
                          </label>
                          <input
                            type="text"
                            name="walletName"
                            value={formData.walletName}
                            onChange={(e) => setFormData(prev => ({ ...prev, walletName: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Paytm, Amazon Pay, etc."
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-2">
                            Wallet ID
                          </label>
                          <input
                            type="text"
                            name="walletId"
                            value={formData.walletId}
                            onChange={(e) => setFormData(prev => ({ ...prev, walletId: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Wallet ID or Phone Number"
                            required
                          />
                        </div>
                      </>
                    )}

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                        className="w-5 h-5 rounded-lg border-white/20 bg-white/5 checked:bg-purple-500 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
                      />
                      <label htmlFor="isDefault" className="text-white/60">
                        Set as default payment method
                      </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                      >
                        {isEditing ? "Update" : "Add"} Payment Method
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAdding(false);
                          setIsEditing(null);
                          resetFormData();
                        }}
                        className="px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 