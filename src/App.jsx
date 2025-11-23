import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus } from 'lucide-react';

// --- IMPORTS (You were missing these) ---

// 1. Import your components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import Footer from './components/Footer';

// 2. Import your data
import { CATEGORIES, PRODUCTS } from './data/products';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeProduct, setActiveProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const formatPrice = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Math.round(value * 1000));

  // Filter Logic
  const filteredProducts = selectedCategory === "All" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === selectedCategory);

  // Cart Logic
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, cartId: Date.now() }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId, newQty) => {
    if (newQty < 1) return removeFromCart(cartId);
    setCart(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity: newQty } : item));
  };

  const openCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const completeOrder = () => {
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden">
      {/* Global Styles for Fonts & Texture */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        
        body { font-family: 'Outfit', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
        
        .bg-grain {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          z-index: 90;
          opacity: 0.4;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
        }
        
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D6D3D1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #A8A29E; }
      `}</style>

      <div className="bg-grain" />

      <Navbar cartCount={cart.reduce((a, b) => a + b.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} />

      <main>
        <Hero />

        <div id="menu" className="container mx-auto px-6 py-24 relative z-10">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <span className="text-rose-500 font-medium tracking-widest text-xs uppercase mb-4 block">Our Collection</span>
              <h3 className="font-serif text-4xl md:text-5xl text-stone-900 leading-tight">
                Crafted with patience, <br/>served with joy.
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm transition-all duration-300 ${
                    selectedCategory === cat 
                      ? 'bg-stone-900 text-white shadow-lg shadow-stone-900/20' 
                      : 'bg-white text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          >
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={product.id}
                  className="group cursor-pointer"
                  onClick={() => setActiveProduct(product)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-stone-200">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                    
                    <button className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg text-stone-900 hover:bg-stone-900 hover:text-white">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-serif text-xl md:text-2xl text-stone-900 group-hover:text-rose-500 transition-colors">
                      {product.name}
                    </h4>
                    <span className="font-medium text-stone-600">{formatPrice(product.price)}</span>
                  </div>
                  <p className="text-stone-500 text-sm line-clamp-2 font-light">{product.description}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        <section id="story" className="py-24 bg-stone-100 relative z-10 overflow-hidden">
           <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
              <div className="w-full md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1612203985729-70726954388c?q=80&w=1000&auto=format&fit=crop" 
                  alt="Baker Hands" 
                  className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700"
                />
              </div>
              <div className="w-full md:w-1/2">
                <Star className="w-8 h-8 text-rose-500 mb-6" />
                <h3 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">
                  Ingredients matter more than recipes.
                </h3>
                <p className="text-stone-600 text-lg font-light leading-relaxed mb-8">
                  We source our Matcha directly from Uji, our butter from Isigny-sur-Mer, and our seasonal fruits from local organic farms. We believe that when you start with perfection, you don't need to add much else.
                </p>
                <a href="#" className="text-stone-900 border-b border-stone-900 pb-1 hover:text-rose-500 hover:border-rose-500 transition-colors uppercase tracking-widest text-xs">Read our story</a>
              </div>
           </div>
        </section>
      </main>

      <Footer />
      
      <AnimatePresence>
        {activeProduct && (
          <ProductModal 
            key="product-modal"
            product={activeProduct} 
            onClose={() => setActiveProduct(null)} 
            onAddToCart={addToCart}
            formatPrice={formatPrice}
          />
        )}
      </AnimatePresence>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateQuantity}
        formatPrice={formatPrice}
        onCheckout={openCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        formatPrice={formatPrice}
        onSubmit={completeOrder}
      />
    </div>
  );
}
