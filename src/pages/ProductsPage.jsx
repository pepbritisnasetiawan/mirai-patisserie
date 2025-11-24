import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductsPage = ({ products, onAddToCart, formatPrice, categories, setActiveProduct }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hideSoldOut, setHideSoldOut] = useState(false);

  const filteredProducts = useMemo(() => {
    return [...products]
      .filter((p) => (selectedCategory === 'All' ? true : p.category === selectedCategory))
      .filter((p) => (hideSoldOut ? (p.stock ?? 0) > 0 : true))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, selectedCategory, hideSoldOut]);

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      <div className="bg-gradient-to-br from-rose-50 via-white to-stone-100 border-b border-stone-200/60">
        <div className="container mx-auto px-6 py-16 flex flex-col gap-6">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-500">Our Catalogue</p>
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-stone-900">All Products</h1>
            <p className="text-stone-600 mt-3 max-w-2xl">
              Browse every pastry we craft, including seasonal specials and gift sets. Tap any card to learn more or add to your order.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex flex-wrap gap-2">
              {['All', ...(categories || [])].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] border transition-colors ${
                    selectedCategory === cat
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-600 bg-white px-3 py-2 rounded-full border border-stone-200">
              <input
                type="checkbox"
                checked={hideSoldOut}
                onChange={(e) => setHideSoldOut(e.target.checked)}
                className="w-4 h-4"
              />
              Hide sold out
            </label>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-stone-500">No products match this category.</p>
        ) : (
          <motion.div layout className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <AnimatePresence>
              {filteredProducts.map((product) => {
                const soldOut = (product.stock ?? 0) <= 0;
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => setActiveProduct?.(product)}
                    className="group bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col cursor-pointer"
                  >
                    <div className="relative aspect-[4/5] sm:aspect-[4/4] lg:aspect-[4/3] overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <span className={`px-3 py-1 text-xs rounded-full bg-white/80 backdrop-blur ${product.accent}`}>{product.category}</span>
                        <span className={`px-3 py-1 text-[11px] rounded-full ${soldOut ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {soldOut ? 'Sold out' : `${product.stock ?? 0} left`}
                        </span>
                        <span className="px-3 py-1 text-[11px] rounded-full bg-white/60 text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity">
                          View details
                        </span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5 flex-1 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3 max-[425px]:flex-col max-[425px]:items-start">
                        <div className="space-y-1">
                          <h3 className="font-serif text-lg sm:text-xl text-stone-900 leading-tight">{product.name}</h3>
                          <p className="text-sm text-stone-500 line-clamp-2">{product.description}</p>
                        </div>
                        <span className="text-sm font-semibold text-stone-800 whitespace-nowrap max-[425px]:text-base">{formatPrice(product.price)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span className="px-2 py-1 rounded-full bg-stone-100 text-stone-700">{product.category}</span>
                        <span className="px-2 py-1 rounded-full bg-stone-50 border border-stone-200">
                          Stock: {product.stock ?? 0}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!soldOut) onAddToCart(product);
                          }}
                          disabled={soldOut}
                          className={`flex-1 py-2 rounded-lg text-sm uppercase tracking-[0.1em] transition-colors ${
                            soldOut
                              ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                              : 'bg-stone-900 text-white hover:bg-rose-500'
                          }`}
                        >
                          {soldOut ? 'Sold Out' : 'Add to Cart'}
                        </button>
                        {!soldOut && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart(product);
                            }}
                            className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300"
                            aria-label="Quick add"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
