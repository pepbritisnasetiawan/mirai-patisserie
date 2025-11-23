import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose, items, onRemove, onUpdateQty, formatPrice, onCheckout }) => {
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FDFBF7] z-[70] shadow-2xl border-l border-stone-100 flex flex-col"
          >
            <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-white">
              <h2 className="font-serif text-2xl text-stone-900">Your Selection</h2>
              <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full">
                <X className="w-6 h-6 text-stone-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-400">
                  <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm tracking-wider uppercase">Your bag is empty</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.cartId} className="flex gap-4">
                    <div className="w-20 h-20 bg-stone-100 rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-serif text-lg text-stone-900 leading-tight">{item.name}</h4>
                        <button onClick={() => onRemove(item.cartId)} className="text-stone-400 hover:text-rose-500">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                  <p className="text-xs text-stone-500 mb-3">{formatPrice(item.price)}</p>
                      
                      <div className="flex items-center gap-3 bg-white inline-flex rounded-full border border-stone-200 px-2 py-1">
                        <button 
                          onClick={() => onUpdateQty(item.cartId, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-500 hover:text-stone-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQty(item.cartId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-500 hover:text-stone-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-stone-200 bg-white">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm uppercase tracking-widest text-stone-500">Total</span>
                  <span className="font-serif text-2xl text-stone-900">{formatPrice(total)}</span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full bg-stone-900 text-[#FDFBF7] py-4 rounded-xl text-sm uppercase tracking-widest hover:bg-rose-500 transition-colors"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
