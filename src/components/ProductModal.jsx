import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Leaf, ArrowRight, Tag } from 'lucide-react';

const ProductModal = ({ product, onClose, onAddToCart, formatPrice }) => {
  // Lock body scroll when modal is open to prevent background scrolling
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop with Blur */}
        <motion.div 
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-900/40 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div 
          key="modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="relative w-full max-w-5xl bg-[#FDFBF7] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:h-auto md:min-h-[500px]"
        >
          {/* Close Button - Floating */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white text-stone-800 transition-all hover:scale-110 shadow-sm border border-white/50"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT SIDE: Image */}
          {/* Mobile: 4/3 aspect ratio. Desktop: Full height cover */}
          <div className="w-full md:w-1/2 relative bg-stone-100 shrink-0 md:h-auto aspect-[4/3] md:aspect-auto">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {/* Mobile Gradient Overlay for text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent md:hidden pointer-events-none" />
          </div>

          {/* RIGHT SIDE: Content */}
          <div className="flex-1 flex flex-col w-full md:w-1/2 bg-[#FDFBF7]">
            
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
              {/* Badges & Category */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${product.accent || 'bg-stone-200 text-stone-600'}`}>
                  {product.category}
                </span>
                {product.badges?.map(badge => (
                  <span key={badge} className="px-3 py-1 border border-stone-200 text-stone-500 rounded-full text-[10px] uppercase tracking-widest bg-white">
                    {badge}
                  </span>
                ))}
              </div>

              {/* Title & Description */}
              <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-stone-900 mb-4 leading-[1.1]">
                {product.name}
              </h3>
              <p className="text-stone-600 text-base md:text-lg leading-relaxed font-light mb-8">
                {product.description}
              </p>

              {/* Ingredients Section */}
              <div className="bg-white/50 rounded-2xl p-5 border border-stone-100">
                <h4 className="text-xs uppercase tracking-widest text-stone-400 mb-3 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" /> Premium Ingredients
                </h4>
                <p className="text-sm text-stone-700 font-medium leading-relaxed">
                  {product.ingredients}
                </p>
              </div>
            </div>

            {/* Footer / Action Area - Sticky on Mobile */}
            <div className="p-6 md:p-10 border-t border-stone-100 bg-white/80 backdrop-blur-sm md:bg-transparent mt-auto">
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Total Price</p>
                  <p className="font-serif text-3xl text-stone-900">{formatPrice(product.price)}</p>
                </div>

                <button 
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="group flex items-center justify-center gap-3 bg-stone-900 text-[#FDFBF7] px-8 py-4 rounded-xl text-sm uppercase tracking-[0.2em] hover:bg-rose-500 transition-all duration-300 shadow-lg hover:shadow-rose-200 w-full md:w-auto"
                >
                  <span>Add to Order</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductModal;