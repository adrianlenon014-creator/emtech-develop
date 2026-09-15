import React from 'react';
import { motion } from 'motion/react';

export function Terms() {
  return (
    <div className="flex-1 max-w-4xl mx-auto px-6 py-24 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose prose-invert prose-zinc max-w-none"
      >
        <h1 className="text-4xl font-bold text-white tracking-tight mb-8">Terms of Service</h1>
        <p className="text-zinc-400 leading-relaxed mb-12 border-b border-white/5 pb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-12 text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and purchasing premium digital goods from Emtech Developers, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our platform or services.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Digital License</h2>
            <p>Upon purchase, you are granted a non-exclusive, non-transferable license to access and download the purchased digital courses for your personal, educational use. You may not redistribute, resell, modify, or publicly share the materials under any circumstances.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Refunds</h2>
            <p>Due to the irreversible digital nature of our architectural blueprints and educational materials, all sales are considered final once the digital goods have been securely dispatched and accessed. If you encounter technical issues, our team is dedicated to assisting you.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Intellectual Property</h2>
            <p>All content, including text, graphics, branding, and course architecture, is the exclusive property of Emtech Developers and is protected by international copyright laws. Unauthorized reproduction is strictly prohibited.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Contact</h2>
            <p>For any inquiries or official matters regarding these terms, please contact us at <a href="mailto:support@rstech.com" className="text-white hover:underline transition-colors">support@rstech.com</a>.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
