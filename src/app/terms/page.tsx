"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Terms and Conditions
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
              Welcome to Elanta. By accessing and using our website, you agree to be bound by these Terms and Conditions. Please read them carefully before making a purchase.
            </p>
          </section>

          {/* Ordering and Payment */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Ordering and Payment</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Order Acceptance</h3>
                <p className="text-white/80">
                  • All orders are subject to availability<br />
                  • We reserve the right to refuse any order<br />
                  • Prices are subject to change without notice
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Payment Terms</h3>
                <p className="text-white/80">
                  • Payment must be made in full at the time of order<br />
                  • We accept major credit cards and PayPal<br />
                  • All prices are in USD
                </p>
              </div>
            </div>
          </section>

          {/* Product Information */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Product Information</h2>
            <p className="text-white/80">
              • Product descriptions and images are for illustrative purposes only<br />
              • Colors may vary slightly from what is shown on screen<br />
              • We make every effort to ensure accuracy but cannot guarantee it
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Intellectual Property</h2>
            <p className="text-white/80">
              All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of Elanta and is protected by copyright laws.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Limitation of Liability</h2>
            <p className="text-white/80">
              Elanta shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the website or products.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Changes to Terms</h2>
            <p className="text-white/80">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website constitutes acceptance of the modified terms.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
            <p className="text-white/80 mb-6">
              If you have any questions about these Terms and Conditions, please contact us at:
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