import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

type CheckoutState = 'idle' | 'processing' | 'success';

export function CartSidebar({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onClearCart }: CartSidebarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [checkoutState, setCheckoutState] = useState<CheckoutState>('idle');
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    }
  }, [user]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
      onClose();
      navigate('/login');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    setCheckoutState('processing');

    try {
      // Create purchases in Firestore FIRST so they are ready when they return from payment.
      // In a production app, you would use Stripe Webhooks to fulfill the order securely instead.
      const purchasesRef = collection(db, `users/${user.uid}/purchases`);
      
      for (const item of items) {
        const newPurchaseRef = doc(purchasesRef);
        await setDoc(newPurchaseRef, {
          productId: item.id,
          title: item.title,
          price: item.price,
          purchasedAt: serverTimestamp()
        });
      }

      // Initialize Stripe checkout
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, email: user.email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment gateway.');
      }

      if (data.url) {
        // Redirect the user to the Checkout page
        window.location.href = data.url;
        return;
      }
      
      setCheckoutState('success');
      onClearCart();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Payment initialization failed. Ensure you have added the WHOPS_API_KEY in the settings.');
      setCheckoutState('idle'); // revert on error
    }
  };

  const resetAndClose = () => {
    setCheckoutState('idle');
    if (checkoutState === 'success') {
      navigate('/dashboard');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={checkoutState === 'success' ? resetAndClose : onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#111111] border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-semibold text-white">Your Cart</h2>
              <button
                onClick={checkoutState === 'success' ? resetAndClose : onClose}
                className="p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                <X size={20} />
              </button>
            </div>

            {checkoutState === 'success' ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <CheckCircle2 size={64} className="text-emerald-400 mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-3">Payment Successful</h3>
                <p className="text-zinc-400 mb-8 leading-relaxed">
                  Your digital goods have been securely dispatched to your dashboard and emailed to <br />
                  <span className="text-white font-medium">{email}</span>
                </p>
                <button
                  onClick={resetAndClose}
                  className="px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-zinc-200 transition-colors w-full"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                      <p>Your cart is empty.</p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-start">
                        <div className="flex-1">
                          <h4 className="text-white font-medium leading-tight mb-1">{item.title}</h4>
                          <div className="text-zinc-400 text-sm mb-3">${item.price.toFixed(2)}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-500">Qty: 1</span>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="font-medium text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer / Checkout */}
                {items.length > 0 && (
                  <div className="p-4 sm:p-6 pb-safe border-t border-white/5 bg-[#0a0a0a]">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-zinc-400">Total</span>
                      <span className="text-2xl font-semibold text-white">${total.toFixed(2)}</span>
                    </div>

                    <div className="space-y-4">
                      {user ? (
                        <div>
                          <label htmlFor="email" className="block text-sm text-zinc-400 mb-2">
                            Delivery Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setEmailError(false);
                            }}
                            disabled
                            placeholder="hello@example.com"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/50 cursor-not-allowed"
                          />
                        </div>
                      ) : null}
                      
                      <button
                        onClick={handleCheckout}
                        disabled={checkoutState === 'processing'}
                        className="w-full py-4 bg-white text-black font-medium rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {checkoutState === 'processing' ? 'Processing...' : (
                          <>
                            {user ? 'Pay & Receive Digital Goods' : 'Sign in to Checkout'} <ArrowRight size={18} />
                          </>
                        )}
                      </button>
                      <p className="text-center text-xs text-zinc-600 pb-2 sm:pb-0">
                        Secure, 256-bit encrypted checkout.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

