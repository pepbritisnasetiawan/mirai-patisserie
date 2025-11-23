import React, { useMemo, useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const emptyForm = {
  name: '',
  category: 'Cakes',
  price: '',
  description: '',
  ingredients: '',
  image: '',
  stock: '',
};

const ProductsPage = ({ products, onAdd, onUpdate, onDelete, onAddToCart, formatPrice, categories }) => {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products],
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: parseFloat(form.price || '0'),
      stock: parseInt(form.stock || '0', 10),
      image: form.image || 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1000&auto=format&fit=crop',
      description: form.description || 'No description yet.',
      ingredients: form.ingredients || 'Will update soon.',
      badges: [],
      accent: 'bg-stone-100 text-stone-800',
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
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      <div className="bg-gradient-to-br from-rose-50 via-white to-stone-100 border-b border-stone-200/60">
        <div className="container mx-auto px-6 py-16 flex flex-col gap-6">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-500">Our Catalogue</p>
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-stone-900">All Products</h1>
            <p className="text-stone-600 mt-3 max-w-2xl">
              Browse every pastry we craft, including seasonal specials and gift sets. Admins can manage inventory below.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-12">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl text-stone-900">Catalogue</h2>
            <p className="text-sm text-stone-500">{sortedProducts.length} items</p>
          </div>
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
                      onClick={() => startEdit(product)}
                      className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300"
                      aria-label="Edit product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-2 rounded-lg border border-stone-200 text-rose-500 hover:text-white hover:bg-rose-500 hover:border-rose-500"
                      aria-label="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl text-stone-900">Admin: Manage Products</h2>
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
      </div>
    </div>
  );
};

export default ProductsPage;
