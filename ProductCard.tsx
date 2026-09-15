import React from 'react';
import { Product } from '../types';
import { IconMap } from '../utils/icons';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const Icon = IconMap[product.icon] || IconMap['Code'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full p-6 bg-[#111111] border border-white/5 rounded-2xl hover:border-white/10 transition-colors group relative overflow-hidden"
    >
      {/* Subtle hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-500">
          <Icon size={24} strokeWidth={1.5} />
        </div>

        <div className="flex-1">
          <div className="text-xs font-medium tracking-wider uppercase text-zinc-500 mb-2">
            {product.category}
          </div>
          <h3 className="text-lg font-semibold text-white mb-2 leading-tight">
            {product.title}
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed mb-6">
            {product.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-white/5 mt-auto">
          <span className="text-2xl sm:text-xl font-medium text-white">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm font-medium text-black bg-white rounded-xl sm:rounded-lg hover:bg-zinc-200 transition-colors active:scale-95 text-center"
          >
            Add to cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
