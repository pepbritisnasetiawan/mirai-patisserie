import React, { useMemo } from 'react';
import { Plus } from 'lucide-react';

const ProductsPage = ({ products, onAddToCart, formatPrice }) => {
  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products],
  );

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
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProducts.map((product) => (
            <div key={product.id} className="group bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 text-xs rounded-full bg-white/80 backdrop-blur ${product.accent}`}>{product.category}</span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-xl text-stone-900">{product.name}</h3>
                    <p className="text-sm text-stone-500 line-clamp-2">{product.description}</p>
                  </div>
                  <span className="text-sm font-medium text-stone-700">{formatPrice(product.price)}</span>
                </div>
                <p className="text-xs text-stone-400">Stock: {product.stock ?? 0}</p>
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => onAddToCart(product)}
                    className="flex-1 bg-stone-900 text-white py-2 rounded-lg text-sm uppercase tracking-[0.1em] hover:bg-rose-500 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300"
                    aria-label="Quick add"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
