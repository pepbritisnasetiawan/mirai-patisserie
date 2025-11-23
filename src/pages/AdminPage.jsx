import React, { useMemo, useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, Lock, LogOut } from 'lucide-react';

const emptyForm = {
  name: '',
  category: 'Cakes',
  price: '',
  description: '',
  ingredients: '',
  image: '',
  stock: '',
  showOnHome: false,
};

const AdminPage = ({ products, onAdd, onUpdate, onDelete, categories, formatPrice, authed, onLogin, onLogout }) => {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [creds, setCreds] = useState({ user: '', pass: '' });

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products],
  );

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin(creds.user, creds.pass);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = (val) => (val || '').replace(/[<>]/g, '').trim();

    const payload = {
      name: clean(form.name),
      category: clean(form.category),
      price: parseFloat(form.price || '0'),
      stock: parseInt(form.stock || '0', 10),
      image: clean(form.image) || 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1000&auto=format&fit=crop',
      description: clean(form.description) || 'No description yet.',
      ingredients: clean(form.ingredients) || 'Will update soon.',
      badges: [],
      accent: 'bg-stone-100 text-stone-800',
      showOnHome: Boolean(form.showOnHome),
    };

    if (editingId) {
      onUpdate(editingId, payload);
    } else {
      onAdd(payload);
    }
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      ingredients: product.ingredients,
      image: product.image,
      stock: product.stock?.toString() || '',
      showOnHome: product.showOnHome ?? false,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  if (!authed) {
    return (
      <div className="bg-[#FDFBF7] min-h-screen">
        <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-rose-900 text-white border-b border-stone-700/60">
          <div className="container mx-auto px-6 py-16 flex flex-col gap-6">
            <p className="text-xs uppercase tracking-[0.3em] text-rose-200">Admin</p>
            <div>
              <h1 className="font-serif text-4xl md:text-5xl">Product Console</h1>
              <p className="text-stone-200 mt-3 max-w-2xl">
                Secure area to add, edit, and remove SKUs.
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-md mx-auto bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-5 h-5 text-stone-700" />
              <div>
                <h2 className="font-serif text-2xl text-stone-900">Sign in</h2>
                <p className="text-sm text-stone-500">Enter admin credentials to manage products.</p>
              </div>
            </div>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-stone-500">Username</label>
                <input
                  required
                  value={creds.user}
                  onChange={(e) => setCreds({ ...creds, user: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                  placeholder="admin"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-stone-500">Password</label>
                <input
                  required
                  type="password"
                  value={creds.pass}
                  onChange={(e) => setCreds({ ...creds, pass: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                  placeholder="******"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-stone-900 text-white py-3 rounded-xl uppercase tracking-[0.2em] text-sm hover:bg-rose-500 transition-colors"
              >
                Enter Console
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-rose-900 text-white border-b border-stone-700/60">
        <div className="container mx-auto px-6 py-16 flex flex-col gap-6">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-200">Admin</p>
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl">Product Console</h1>
              <p className="text-stone-200 mt-3 max-w-2xl">
                Manage SKUs, update stock, and curate what appears on the home page.
              </p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm hover:bg-white/20 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-10">
        <section className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl text-stone-900">Add / Edit Product</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-stone-500 flex items-center gap-2">
              <Plus className="w-4 h-4" /> {editingId ? 'Update Product' : 'Add Product'}
            </span>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-stone-500">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                placeholder="Product name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-stone-500">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-stone-500">Price (IDR)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                placeholder="120000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-stone-500">Stock</label>
              <input
                required
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                placeholder="10"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-[0.2em] text-stone-500">Image URL</label>
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-[0.2em] text-stone-500">Description</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                placeholder="Short description"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-[0.2em] text-stone-500">Ingredients</label>
              <textarea
                rows={2}
                value={form.ingredients}
                onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                placeholder="Matcha, Yuzu, ... "
              />
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <input
                id="showOnHome"
                type="checkbox"
                checked={form.showOnHome}
                onChange={(e) => setForm({ ...form, showOnHome: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="showOnHome" className="text-sm text-stone-600">
                Show on home page
              </label>
            </div>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-xl uppercase tracking-[0.2em] text-sm hover:bg-rose-500 transition-colors"
              >
                {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingId ? 'Update' : 'Add'} Product
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex items-center gap-2 border border-stone-300 px-6 py-3 rounded-xl uppercase tracking-[0.2em] text-sm text-stone-600 hover:text-stone-900"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl text-stone-900">Inventory</h2>
            <p className="text-sm text-stone-500">{sortedProducts.length} items</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <div key={product.id} className="border border-stone-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-serif text-lg text-stone-900 leading-tight">{product.name}</p>
                    <p className="text-sm text-stone-500">{formatPrice(product.price)}</p>
                  </div>
                </div>
                <p className="text-xs text-stone-500">Stock: {product.stock ?? 0}</p>
                <p className="text-xs text-stone-500">Home: {product.showOnHome ? 'Visible' : 'Hidden'}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(product)}
                    className="flex-1 border border-stone-200 rounded-lg py-2 text-sm text-stone-700 hover:border-stone-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-2 rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white"
                    aria-label="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
