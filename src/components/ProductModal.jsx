import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Leaf, ArrowRight } from 'lucide-react';

const ProductModal = ({ product, onClose, onAddToCart, formatPrice }) => {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <>
      <motion.div 
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50"
      />
      <motion.div 
        key="modal-content"
        initial={{ opacity: 0, scale: 0.95, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 50 }}
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4 md:p-6"
      >
        <div className="bg-[#FDFBF7] w-full max-w-5xl h-auto max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-[2rem] shadow-2xl flex flex-col md:flex-row pointer-events-auto relative scrollbar-hide">
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 md:top-5 md:right-5 z-20 w-11 h-11 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-md transition-all hover:scale-105 active:scale-100"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-stone-800" />
          </button>

          {/* Image Side - Changed h-64 to aspect ratio for better proportions */}
          <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:h-auto relative bg-stone-100 shrink-0">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Side */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
            <div className="mb-3 flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${product.accent}`}>
                {product.category}
              </span>
              {product.badges.map(badge => (
                <span key={badge} className="px-2 py-1 border border-stone-200 text-stone-500 rounded text-[10px] uppercase tracking-wider">
                  {badge}
                </span>
              ))}
            </div>
            
            <h3 className="font-serif text-2xl md:text-4xl text-stone-900 mb-3 md:mb-4 leading-tight">{product.name}</h3>
            <p className="text-stone-600 text-sm md:text-lg leading-relaxed mb-6 font-light">
              {product.description}
            </p>

            <div className="border-t border-stone-200 py-4 mb-4">
              <h4 className="text-xs uppercase tracking-widest text-stone-400 mb-2 flex items-center gap-2">
                <Leaf className="w-4 h-4" /> Ingredients
              </h4>
              <p className="text-sm text-stone-700 font-medium leading-relaxed">
                {product.ingredients}
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-auto pt-2">
              <div className="flex items-end justify-between">
                 <div className="flex flex-col">
                  <span className="text-xs text-stone-400 uppercase tracking-widest mb-1">Price</span>
                  <span className="text-2xl md:text-3xl font-serif text-stone-900">{formatPrice(product.price)}</span>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="bg-stone-900 text-[#FDFBF7] px-6 py-4 rounded-xl text-sm uppercase tracking-[0.2em] hover:bg-rose-500 transition-colors flex items-center justify-center gap-3 w-full shadow-lg"
              >
                Add to Order <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProductModal;
