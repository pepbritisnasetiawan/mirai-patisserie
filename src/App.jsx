import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, CheckCircle2 } from 'lucide-react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import Footer from './components/Footer';
import ProductsPage from './pages/ProductsPage';
import AdminPage from './pages/AdminPage';

import { CATEGORIES, PRODUCTS } from './data/products';
const REVIEW_KEY = 'mirai_reviews';
const PRODUCT_KEY = 'mirai_products';
const defaultReviews = [
  { id: 1, name: 'Ayu', city: 'Jakarta', rating: 5, text: 'Flavors are balanced and not too sweet. Delivery was fast.', date: '2 days ago' },
  { id: 2, name: 'Dewi', city: 'Bandung', rating: 4, text: 'The croissants are incredible—please open in Bandung!', date: '1 week ago' },
  { id: 3, name: 'Michael', city: 'Singapore', rating: 5, text: 'Attention to detail is world-class. Packaging was beautiful.', date: '3 weeks ago' },
];

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -24 }}
    transition={{ duration: 0.45, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

const HomePage = ({
  products,
  formatPrice,
  selectedCategory,
  setSelectedCategory,
  setActiveProduct,
  reviews,
  reviewForm,
  setReviewForm,
  onAddReview,
}) => {
  const [hoverRating, setHoverRating] = useState(null);
  const filteredProducts = selectedCategory === 'All'
    ? products.filter((p) => p.showOnHome !== false)
    : products.filter((p) => p.category === selectedCategory && p.showOnHome !== false);
  const displayedProducts =
    selectedCategory === 'All'
      ? filteredProducts.slice(0, 12)
      : filteredProducts.length > 4
        ? filteredProducts.slice(0, 4)
        : filteredProducts;

  return (
    <>
      <Hero />

      <div id="menu" className="container mx-auto px-6 py-24 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <span className="text-rose-500 font-medium tracking-widest text-xs uppercase mb-4 block">Our Collection</span>
            <h3 className="font-serif text-4xl md:text-5xl text-stone-900 leading-tight">
              Crafted with patience, <br />served with joy.
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10"
        >
          <AnimatePresence>
            {displayedProducts.map((product) => {
              const remaining = product.stock ?? 0;
              const isSoldOut = remaining <= 0;
              return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={product.id}
                className={`group cursor-pointer ${isSoldOut ? 'opacity-70' : ''}`}
                onClick={() => setActiveProduct(product)}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-stone-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-xs rounded-full bg-white/80 text-stone-800">
                      {remaining > 0 ? `${remaining} left` : 'Sold out'}
                    </span>
                  </div>

                  {isSoldOut && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center text-white font-semibold tracking-[0.2em] uppercase">
                      Sold Out
                    </div>
                  )}

                  {!isSoldOut && (
                    <button className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg text-stone-900 hover:bg-stone-900 hover:text-white">
                      <Plus className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-serif text-xl md:text-2xl text-stone-900 group-hover:text-rose-500 transition-colors">
                    {product.name}
                  </h4>
                  <span className="font-medium text-stone-600">{formatPrice(product.price)}</span>
                </div>
                <p className="text-stone-500 text-sm line-clamp-2 font-light">{product.description}</p>
              </motion.div>
            )})}
          </AnimatePresence>
        </motion.div>

        <div className="flex justify-center mt-10">
          <a
            href="/products"
            className="px-8 py-3 rounded-full border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-colors uppercase tracking-[0.2em] text-sm shadow-sm"
          >
            View all products
          </a>
        </div>
      </div>

      <section className="py-16 bg-white relative z-10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-rose-500 mb-3">Need something custom?</p>
            <h3 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">Call us via WhatsApp</h3>
            <p className="text-stone-600 leading-relaxed mb-6">
              Have a rush order, an event, or need allergen info? Message us directly and our pastry concierge will help finalize your order.
            </p>
            <div className="flex items-center gap-3 text-sm text-stone-700">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs uppercase tracking-[0.2em]">Fast</span>
              <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs uppercase tracking-[0.2em]">Human support</span>
            </div>
          </div>
          <div className="flex md:justify-end">
            <a
              href="https://wa.me/6285555555"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-colors text-sm uppercase tracking-[0.2em]"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section id="story" className="py-24 bg-stone-100 relative z-10 overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1582650947299-4655dd1a4683?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Baker at work"
              className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700"
            />
          </div>
          <div className="w-full md:w-1/2">
            <Star className="w-8 h-8 text-rose-500 mb-6" />
            <h3 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">
              Ingredients matter more than recipes.
            </h3>
            <p className="text-stone-600 text-lg font-light leading-relaxed mb-8">
              We hand-source matcha from Uji, butter from Isigny-sur-Mer, and fruit from small growers across Java.
              The craft is simple: honest ingredients, precise technique, and flavors that let nature speak. Mirai is
              where French methods meet Japanese balance.
            </p>
            <a
              href="/#story"
              className="text-stone-900 border-b border-stone-900 pb-1 hover:text-rose-500 hover:border-rose-500 transition-colors uppercase tracking-widest text-xs"
            >
              Read our story
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#FDFBF7]">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-1">
            <p className="text-xs uppercase tracking-[0.3em] text-rose-500 mb-3">Reviews</p>
            <h3 className="font-serif text-3xl text-stone-900 mb-4">What guests say</h3>
            <p className="text-stone-600 leading-relaxed mb-6">Share your experience with Mirai. We listen to every note to make tomorrow’s batches better.</p>
            <form onSubmit={onAddReview} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  placeholder="Name"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
                <input
                  value={reviewForm.city}
                  onChange={(e) => setReviewForm({ ...reviewForm, city: e.target.value })}
                  placeholder="City"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((r) => {
                  const active = hoverRating ? r <= hoverRating : r <= reviewForm.rating;
                  return (
                    <button
                      key={r}
                      type="button"
                      onMouseEnter={() => setHoverRating(r)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setReviewForm({ ...reviewForm, rating: r })}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition transform hover:-translate-y-0.5 ${
                        active ? 'text-amber-500 bg-amber-50 shadow-sm' : 'text-stone-300 bg-white border border-stone-200'
                      }`}
                      aria-label={`${r} star`}
                    >
                      ★
                    </button>
                  );
                })}
                <span className="text-xs uppercase tracking-[0.2em] text-stone-500 ml-2">
                  {hoverRating || reviewForm.rating}/5
                </span>
              </div>
              <textarea
                required
                value={reviewForm.text}
                onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                placeholder="Tell us about your pastry..."
                rows={3}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
              <button
                type="submit"
                className="w-full bg-stone-900 text-white py-3 rounded-xl text-sm uppercase tracking-[0.2em] hover:bg-rose-500 transition-colors"
              >
                Submit review
              </button>
            </form>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.slice(0,6).map((review) => (
              <div key={review.id} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-serif text-lg text-stone-900">{review.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{review.city}</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                </div>
                <p className="text-stone-600 leading-relaxed text-sm">{review.text}</p>
                <p className="text-xs text-stone-400">{review.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem(PRODUCT_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        localStorage.removeItem(PRODUCT_KEY);
      }
    }
    return PRODUCTS.map((p) => ({ ...p, stock: p.stock ?? 0, showOnHome: p.showOnHome ?? true }));
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeProduct, setActiveProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [adminAuthed, setAdminAuthed] = useState(() => Boolean(localStorage.getItem('mirai_admin_token')));
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem(REVIEW_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        localStorage.removeItem(REVIEW_KEY);
      }
    }
    return defaultReviews;
  });
  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'mirai123';
  const [reviewForm, setReviewForm] = useState({ name: '', city: '', text: '', rating: 5 });

  useEffect(() => {
    localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(REVIEW_KEY, JSON.stringify(reviews));
  }, [reviews]);

  const formatPrice = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Math.round(value * 1000));

  const sanitize = (val) => (typeof val === 'string' ? val.replace(/[<>]/g, '').trim() : val);

  const adjustStock = (productId, delta) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, (p.stock ?? 0) + delta) } : p)),
    );
  };

  const pushToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  const addToCart = (product) => {
    const current = products.find((p) => p.id === product.id);
    const available = current ? current.stock ?? 0 : 0;
    if (available <= 0) {
      pushToast(`${product.name} is out of stock`);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { ...product, quantity: 1, cartId: Date.now() }];
    });
    adjustStock(product.id, -1);
    pushToast(`${product.name} added to bag`);
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => {
      const item = prev.find((i) => i.cartId === cartId);
      if (item) adjustStock(item.id, item.quantity);
      return prev.filter((i) => i.cartId !== cartId);
    });
  };

  const updateQuantity = (cartId, newQty) => {
    setCart((prev) => {
      const item = prev.find((i) => i.cartId === cartId);
      if (!item) return prev;
      if (newQty < 1) {
        adjustStock(item.id, item.quantity);
        return prev.filter((i) => i.cartId !== cartId);
      }
      const delta = newQty - item.quantity;
      const product = products.find((p) => p.id === item.id);
      const available = product ? product.stock ?? 0 : 0;
      if (delta > 0 && available < delta) {
        pushToast('Not enough stock');
        return prev;
      }
      if (delta !== 0) adjustStock(item.id, -delta);
      return prev.map((i) => (i.cartId === cartId ? { ...i, quantity: newQty } : i));
    });
  };

  const openCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const completeOrder = () => {
    setCart([]);
    setIsCheckoutOpen(false);
  };

  const addProduct = (newProduct) => {
    const payload = {
      ...newProduct,
      name: sanitize(newProduct.name),
      category: sanitize(newProduct.category),
      description: sanitize(newProduct.description),
      ingredients: sanitize(newProduct.ingredients),
      image: sanitize(newProduct.image),
      showOnHome: Boolean(newProduct.showOnHome),
    };

    setProducts((prev) => [
      ...prev,
      {
        ...payload,
        id: Date.now(),
        showOnHome: payload.showOnHome ?? false,
      },
    ]);
    pushToast('Product added');
  };

  const updateProduct = (id, updates) => {
    const payload = {
      ...updates,
      name: sanitize(updates.name),
      category: sanitize(updates.category),
      description: sanitize(updates.description),
      ingredients: sanitize(updates.ingredients),
      image: sanitize(updates.image),
      showOnHome: Boolean(updates.showOnHome),
    };
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...payload, id } : p)),
    );
    pushToast('Product updated');
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    pushToast('Product removed');
  };

  const addReview = (e) => {
    e.preventDefault();
    const clean = (val) => sanitize(val) || '';
    if (!reviewForm.name || !reviewForm.text) return;
    const newReview = {
      id: Date.now(),
      name: clean(reviewForm.name),
      city: clean(reviewForm.city) || 'Guest',
      rating: Number(reviewForm.rating) || 5,
      text: clean(reviewForm.text),
      date: 'Just now',
    };
    setReviews((prev) => [newReview, ...prev].slice(0, 20));
    setReviewForm({ name: '', city: '', text: '', rating: 5 });
    pushToast('Thanks for your review!');
  };

  const handleLogin = (user, pass) => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      localStorage.setItem('mirai_admin_token', 'ok');
      setAdminAuthed(true);
      pushToast('Admin logged in');
    } else {
      pushToast('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mirai_admin_token');
    setAdminAuthed(false);
    pushToast('Logged out');
  };

  const handleNavigate = (href) => {
    if (href.startsWith('/')) {
      navigate(href);
      return;
    }

    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else {
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    navigate(href);
  };

  const routeElement = (element) => <PageTransition>{element}</PageTransition>;

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden">
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

      <Navbar
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
      />

      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={routeElement(
                <HomePage
                  products={products}
                  formatPrice={formatPrice}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  setActiveProduct={setActiveProduct}
                  reviews={reviews}
                  reviewForm={reviewForm}
                  setReviewForm={setReviewForm}
                  onAddReview={addReview}
                />,
              )}
            />
            <Route
              path="/products"
              element={routeElement(
                <ProductsPage
                  products={products}
                  onAddToCart={addToCart}
                  formatPrice={formatPrice}
                />,
              )}
            />
            <Route
              path="/admin"
              element={routeElement(
                <AdminPage
                  products={products}
                  onAdd={addProduct}
                  onUpdate={updateProduct}
                  onDelete={deleteProduct}
                  categories={CATEGORIES}
                  formatPrice={formatPrice}
                  authed={adminAuthed}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                />,
              )}
            />
          </Routes>
        </AnimatePresence>
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

      <div className="fixed top-4 right-4 z-[120] space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex items-center gap-3 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-lg shadow-stone-900/20 border border-stone-700"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span className="text-sm">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
