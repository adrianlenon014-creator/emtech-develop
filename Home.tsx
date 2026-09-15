import React from 'react';
import { motion } from 'motion/react';
import { products } from '../data';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface HomeProps {
  searchQuery: string;
  onAddToCart: (product: Product) => void;
}

export function Home({ searchQuery, onAddToCart }: HomeProps) {
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Hero Section */}
      <header className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/30 via-[#0a0a0a] to-[#0a0a0a] -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-6 sm:mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Instant Digital Delivery
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6 sm:mb-8">
              Master your craft. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-600">
                Build the future.
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto px-2">
              Premium digital courses and architecture blueprints for elite developers. 
              Buy once, own forever. Learn at your own pace.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Course Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pb-24 sm:pb-32 w-full">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Latest Resources</h2>
          <span className="text-xs sm:text-sm text-zinc-500 font-medium">{filteredProducts.length} available</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">No courses found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
