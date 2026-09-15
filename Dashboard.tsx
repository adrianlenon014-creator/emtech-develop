import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Navigate } from 'react-router-dom';
import { collection, query, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { motion } from 'motion/react';
import { BookOpen, Download, User as UserIcon, Code2 } from 'lucide-react';

interface Purchase {
  id: string;
  productId: string;
  title: string;
  price: number;
  purchasedAt: any;
}

export function Dashboard() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if returning from a successful payment
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
       window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchPurchases = async () => {
      try {
        const q = query(collection(db, `users/${user.uid}/purchases`));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Purchase[];
        setPurchases(data.sort((a, b) => b.purchasedAt?.toMillis() - a.purchasedAt?.toMillis()));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/purchases`);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
      <div className="flex flex-col md:flex-row gap-8 sm:gap-12">
        {/* User Sidebar */}
        <div className="w-full md:w-80 shrink-0">
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 md:sticky top-28">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-2xl object-cover" />
              ) : (
                <UserIcon size={24} className="text-zinc-400" />
              )}
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{user.displayName || 'Developer'}</h2>
            <p className="text-sm text-zinc-500 mb-6">{user.email}</p>
            <div className="h-px w-full bg-white/10 mb-6" />
            <div className="text-sm font-medium text-zinc-400">
              <div className="flex justify-between items-center mb-3">
                <span>Total Courses</span>
                <span className="text-white bg-white/10 px-2 py-0.5 rounded-md">{purchases.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-8">My Learning Library</h1>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-zinc-800 border-t-white rounded-full animate-spin" />
            </div>
          ) : purchases.length === 0 ? (
            <div className="bg-[#111111] border border-white/5 rounded-3xl p-12 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Code2 size={24} className="text-zinc-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No courses yet</h3>
              <p className="text-zinc-400 max-w-sm mx-auto">
                Explore our catalog of premium digital courses and start building the future today.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {purchases.map((purchase, i) => (
                <motion.div
                  key={purchase.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#111111] border border-white/5 hover:border-white/10 transition-colors rounded-2xl p-6 flex flex-col h-full group"
                >
                  <div className="flex-1 mb-8">
                    <h3 className="text-lg font-semibold text-white leading-tight mb-2">
                      {purchase.title}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Purchased on {purchase.purchasedAt ? new Date(purchase.purchasedAt.toMillis()).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 py-2.5 bg-white text-black font-medium text-sm rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                      <BookOpen size={16} /> Read
                    </button>
                    <button className="flex-1 py-2.5 bg-white/5 text-white font-medium text-sm rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 border border-white/5">
                      <Download size={16} /> Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
