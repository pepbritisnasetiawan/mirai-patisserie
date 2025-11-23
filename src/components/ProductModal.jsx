import React from 'react';
import { motion } from 'framer-motion';
import { X, Leaf, ArrowRight } from 'lucide-react';

const ProductModal = ({ product, onClose, onAddToCart, formatPrice }) => {
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
        className="fixed inset-0 md:inset-12 md:top-20 md:bottom-20 z-50 flex items-center justify-center pointer-events-none p-4"
      >
        <div className="bg-[#FDFBF7] w-full max-w-5xl h-full md:h-auto md:max-h-full overflow-y-auto rounded-none md:rounded-[2rem] shadow-2xl flex flex-col md:flex-row pointer-events-auto relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/50 rounded-full hover:bg-white transition-colors"
          >
            <X className="w-6 h-6 text-stone-800" />
          </button>

          {/* Image Side */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-stone-100">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Side */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-2 flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${product.accent}`}>
                {product.category}
              </span>
              {product.badges.map(badge => (
                <span key={badge} className="px-2 py-1 border border-stone-200 text-stone-500 rounded text-[10px] uppercase tracking-wider">
                  {badge}
                </span>
              ))}
            </div>
            
            <h3 className="font-serif text-4xl text-stone-900 mb-4">{product.name}</h3>
            <p className="text-stone-600 text-lg leading-relaxed mb-8 font-light">
              {product.description}
            </p>

            <div className="border-t border-stone-200 py-6 mb-6">
              <h4 className="text-xs uppercase tracking-widest text-stone-400 mb-3 flex items-center gap-2">
                <Leaf className="w-4 h-4" /> Ingredients
              </h4>
              <p className="text-sm text-stone-700 font-medium">
                {product.ingredients}
              </p>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex flex-col">
                <span className="text-xs text-stone-400 uppercase tracking-widest">Price</span>
                <span className="text-3xl font-serif text-stone-900">{formatPrice(product.price)}</span>
              </div>
              <button 
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="bg-stone-900 text-[#FDFBF7] px-8 py-4 rounded-xl text-sm uppercase tracking-widest hover:bg-rose-500 transition-colors flex items-center gap-3"
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
