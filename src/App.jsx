import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import Footer from './components/Footer';
import Hero from './components/Hero'; // Kept for preloading or if used elsewhere, though HomePage uses it now.
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';
import ProductModal from './components/ProductModal';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';

import { APP_CONFIG } from './config';
import { CATEGORIES, PRODUCTS } from './data/products';
import {
  createProduct as apiCreateProduct,
  createReview as apiCreateReview,
  deleteProduct as apiDeleteProduct,
  login as apiLogin,
  fetchProducts,
  fetchReviews,
  updateProduct as apiUpdateProduct,
} from './lib/api';

const REVIEW_KEY = 'mirai_reviews';
const PRODUCT_KEY = 'mirai_products';
const defaultReviews = [
  { id: 1, name: 'Ayu', city: 'Jakarta', rating: 5, text: 'Flavors are balanced and not too sweet. Delivery was fast.', date: '2 days ago' },
  { id: 2, name: 'Dewi', city: 'Bandung', rating: 4, text: 'The croissants are incredible—please open in Bandung!', date: '1 week ago' },
  { id: 3, name: 'Michael', city: 'Singapore', rating: 5, text: 'Attention to detail is world-class. Packaging was beautiful.', date: '3 weeks ago' },
];
const DEFAULT_ACCENT = 'bg-stone-200 text-stone-700';

const normalizeProduct = (p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
  description: p.description || '',
  ingredients: p.ingredients || '',
  image: p.image || '',
  stock: typeof p.stock === 'number' ? p.stock : Number(p.stock) || 0,
  showOnHome: typeof p.showOnHome === 'boolean' ? p.showOnHome : Boolean(p.show_on_home),
  accent: p.accent || DEFAULT_ACCENT,
  badges: p.badges || [],
});

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem(PRODUCT_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).map(normalizeProduct);
      } catch {
        localStorage.removeItem(PRODUCT_KEY);
      }
    }
    return PRODUCTS.map((p) => normalizeProduct({ ...p, showOnHome: p.showOnHome ?? true }));
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
  const ADMIN_USER = APP_CONFIG.adminUser;
  const ADMIN_PASS = APP_CONFIG.adminPass;
  const [reviewForm, setReviewForm] = useState({ name: '', city: '', text: '', rating: 5 });
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('mirai_admin_token') || '');
  const apiReady = Boolean(import.meta.env.VITE_API_BASE);
  const [loadingData, setLoadingData] = useState(false);
  const [loadError, setLoadError] = useState('');

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

    const saveLocal = (saved) => {
      setProducts((prev) => [...prev, saved]);
      pushToast('Product added');
    };

    if (apiReady && (adminToken || adminAuthed)) {
      apiCreateProduct(payload, adminToken || localStorage.getItem('mirai_admin_token'))
        .then((res) => saveLocal(normalizeProduct(res)))
        .catch(() => {
          saveLocal({
            ...payload,
            id: Date.now(),
            showOnHome: payload.showOnHome ?? false,
            accent: payload.accent || DEFAULT_ACCENT,
          });
        });
    } else {
      saveLocal({
        ...payload,
        id: Date.now(),
        showOnHome: payload.showOnHome ?? false,
        accent: payload.accent || DEFAULT_ACCENT,
      });
    }
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
      accent: updates.accent || DEFAULT_ACCENT,
    };
    const applyLocal = () => {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...payload, id } : p)),
      );
      pushToast('Product updated');
    };
    if (apiReady && (adminToken || adminAuthed)) {
      apiUpdateProduct(id, payload, adminToken || localStorage.getItem('mirai_admin_token')).then(applyLocal).catch(applyLocal);
    } else {
      applyLocal();
    }
  };

  const deleteProduct = (id) => {
    const applyLocal = () => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      pushToast('Product removed');
    };
    if (apiReady && (adminToken || adminAuthed)) {
      apiDeleteProduct(id, adminToken || localStorage.getItem('mirai_admin_token')).then(applyLocal).catch(applyLocal);
    } else {
      applyLocal();
    }
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
    const applyLocal = () => {
      setReviews((prev) => [newReview, ...prev].slice(0, 20));
      setReviewForm({ name: '', city: '', text: '', rating: 5 });
      pushToast('Thanks for your review!');
    };
    if (apiReady) {
      apiCreateReview(newReview).then(applyLocal).catch(applyLocal);
    } else {
      applyLocal();
    }
  };

  const handleLogin = (user, pass) => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      localStorage.setItem('mirai_admin_token', 'ok');
      setAdminAuthed(true);
      pushToast('Admin logged in');
      return;
    }
    if (apiReady) {
      apiLogin(user, pass)
        .then((res) => {
          localStorage.setItem('mirai_admin_token', res.token);
          setAdminToken(res.token);
          setAdminAuthed(true);
          pushToast('Admin logged in');
        })
        .catch(() => pushToast('Invalid credentials'));
    } else {
      pushToast('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mirai_admin_token');
    setAdminToken('');
    setAdminAuthed(false);
    pushToast('Logged out');
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!apiReady) return;
    setLoadingData(true);
    setLoadError('');
    Promise.all([fetchProducts(), fetchReviews()])
      .then(([productsData, reviewsData]) => {
        setProducts(productsData.map(normalizeProduct));
        setReviews(reviewsData);
      })
      .catch(() => setLoadError('Failed to sync with server. Showing local data.'))
      .finally(() => setLoadingData(false));
  }, [apiReady]);
  /* eslint-enable react-hooks/set-state-in-effect */

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
                  loadingData={loadingData}
                  loadError={loadError}
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
                  categories={CATEGORIES}
                  setActiveProduct={setActiveProduct}
                  loadingData={loadingData}
                  loadError={loadError}
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
        whatsappNumber={APP_CONFIG.whatsappNumber}
      />

      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[250] space-y-3 pointer-events-none w-full max-w-xl px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="pointer-events-auto flex items-center gap-3 bg-stone-900/95 text-white px-5 py-4 rounded-2xl shadow-2xl shadow-stone-900/30 border border-stone-700/40 backdrop-blur-xl"
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
