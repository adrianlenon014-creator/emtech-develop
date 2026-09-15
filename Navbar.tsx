import React, { useState } from 'react';
import { ShoppingBag, Search, Code2, User as UserIcon, LogOut, X } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  cartItemsCount: number;
  onOpenCart: () => void;
}

export function Navbar({ searchQuery, setSearchQuery, cartItemsCount, onOpenCart }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <nav className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/images.jpg" alt="Emtech Developers Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight hidden sm:block">Emtech Developers.</span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
              <Search size={20} />
            </button>
            
            <button
              onClick={onOpenCart}
              className="relative p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ShoppingBag size={24} strokeWidth={1.5} />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-white text-black text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#0a0a0a]">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-4 border-l border-white/10 pl-4 sm:pl-6">
                <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors p-2 sm:p-0 rounded-full hover:bg-white/5 sm:hover:bg-transparent">
                  <UserIcon size={20} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden sm:block">Dashboard</span>
                </Link>
                <button onClick={handleLogout} className="text-zinc-500 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-white/5">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 border-l border-white/10 pl-4 sm:pl-6">
                <Link to="/login" className="text-sm font-medium text-white hover:text-zinc-300 transition-colors">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search Overlay/Bar */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden sticky top-20 z-20 bg-[#111111] border-b border-white/5 overflow-hidden"
          >
            <div className="px-4 py-4 relative">
              <Search size={18} className="absolute left-7 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search courses..."
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-7 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
