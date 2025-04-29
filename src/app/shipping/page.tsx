"use client";

import { motion } from "framer-motion";
import { Truck, RefreshCw, Package, Clock, Shield, HelpCircle } from "lucide-react";

const shippingOptions = [
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Standard Shipping",
    description: "3-5 business days",
    price: "Free on orders over $50",
    features: ["Tracking number provided", "Standard processing"]
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Express Shipping",
    description: "1-2 business days",
    price: "Additional fee applies",
    features: ["Priority processing", "Expedited delivery"]
  },
  {
    icon: <Package className="w-8 h-8" />,
    title: "International Shipping",
    description: "7-14 business days",
    price: "Varies by destination",
    features: ["Worldwide delivery", "Customs handling"]
  }
];

const returnSteps = [
  {
    icon: <HelpCircle className="w-8 h-8" />,
    title: "Contact Support",
    description: "Reach out to our customer service team to initiate your return"
  },
  {
    icon: <Package className="w-8 h-8" />,
    title: "Pack Your Item",
    description: "Securely pack the item in its original packaging with all tags"
  },
  {
    icon: <RefreshCw className="w-8 h-8" />,
    title: "Ship It Back",
    description: "Use the provided return label to ship the package back to us"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Get Your Refund",
    description: "Receive your refund within 5-7 business days after processing"
  }
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-black mb-4 text-center"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Shipping & Returns
          </span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/60 text-center mb-12 max-w-2xl mx-auto"
        >
          Fast, reliable shipping and hassle-free returns for your peace of mind
        </motion.p>

        {/* Shipping Options */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Shipping Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shippingOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:border-purple-500/50 transition-colors"
              >
                <div className="text-purple-400 mb-4">{option.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{option.title}</h3>
                <p className="text-white/80 mb-4">{option.description}</p>
                <p className="text-purple-400 font-bold mb-4">{option.price}</p>
                <ul className="space-y-2">
                  {option.features.map((feature, i) => (
                    <li key={i} className="text-white/60 flex items-center">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Return Process */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Easy Returns Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {returnSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:border-purple-500/50 transition-colors"
              >
                <div className="text-purple-400 mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/80">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="mt-20 text-center"
        >
          <p className="text-white/60 mb-4">
            Need help with shipping or returns? Our team is here to assist you.
          </p>
          <motion.a
            href="/contact"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Customer Service
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
} 