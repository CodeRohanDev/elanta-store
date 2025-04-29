"use client";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Privacy Policy
          </span>
        </h1>
        <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="max-w-3xl mx-auto space-y-12">
          {/* Introduction */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Introduction</h2>
            <p className="text-white/80">
              At Elanta, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
            </p>
          </section>

          {/* Information Collection */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Personal Information</h3>
                <p className="text-white/80">
                  • Name and contact information<br />
                  • Shipping and billing addresses<br />
                  • Payment information<br />
                  • Account credentials
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Usage Information</h3>
                <p className="text-white/80">
                  • Browser and device information<br />
                  • IP address<br />
                  • Pages visited and time spent<br />
                  • Purchase history
                </p>
              </div>
            </div>
          </section>

          {/* Use of Information */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">How We Use Your Information</h2>
            <p className="text-white/80">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-white/80 mt-4 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and account</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Information Sharing</h2>
            <p className="text-white/80">
              We may share your information with:
            </p>
            <ul className="list-disc list-inside text-white/80 mt-4 space-y-2">
              <li>Service providers who assist in our operations</li>
              <li>Payment processors for transaction processing</li>
              <li>Shipping carriers for order delivery</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Your Rights</h2>
            <p className="text-white/80">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-white/80 mt-4 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent for data processing</li>
            </ul>
          </section>

          {/* Contact Information */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
            <p className="text-white/80 mb-6">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
            >
              Contact Us
            </a>
          </section>
        </div>
      </div>
    </div>
  );
} 