import React from 'react';
import { motion } from 'motion/react';

export function Privacy() {
  return (
    <div className="flex-1 max-w-4xl mx-auto px-6 py-24 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose prose-invert prose-zinc max-w-none"
      >
        <h1 className="text-4xl font-bold text-white tracking-tight mb-8">Privacy Policy</h1>
        <p className="text-zinc-400 leading-relaxed mb-12 border-b border-white/5 pb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-12 text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p>When you purchase a course from Emtech Developers, we collect the email address you provide for delivery purposes. If you choose to authenticate via Google, we collect basic profile information such as your name and email address as securely provided by the Google identity service.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
            <p>Your information is used exclusively to deliver your purchased digital goods, manage your learning library access on our professional dashboard, and provide customer support. We adhere to strict privacy standards and do not sell, rent, or trade your personal information to any third parties.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Data Security</h2>
            <p>We implement enterprise-grade, industry-standard security measures to protect your personal information. All authentication and database operations are securely managed via robust Cloud infrastructure and security protocols.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Contact Us</h2>
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact our support team directly at <a href="mailto:support@rstech.com" className="text-white hover:underline transition-colors">support@rstech.com</a>.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
