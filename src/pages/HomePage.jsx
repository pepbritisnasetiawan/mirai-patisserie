import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import Hero from '../components/Hero';
import { CATEGORIES } from '../data/products';
import { APP_CONFIG } from '../config';
import { Star } from 'lucide-react';

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
    loadingData,
    loadError,
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
                {(loadingData || loadError) && (
                    <div className="mb-6 text-sm">
                        {loadingData && <span className="text-stone-500">Syncing latest menu…</span>}
                        {loadError && <span className="text-amber-600">{loadError}</span>}
                    </div>
                )}
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
                                className={`px-6 py-2 rounded-full text-sm transition-all duration-300 ${selectedCategory === cat
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
                    className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 xl:gap-10"
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
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-5 sm:mb-6 bg-stone-200">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent group-hover:bg-black/15 transition-colors duration-500" />

                                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                                            <span className="px-3 py-1 text-xs rounded-full bg-white/80 text-stone-800">
                                                {remaining > 0 ? `${remaining} left` : 'Sold out'}
                                            </span>
                                            <span className={`px-3 py-1 text-[11px] rounded-full bg-white/80 ${product.accent}`}>
                                                {product.category}
                                            </span>
                                            <span className="px-3 py-1 text-[11px] rounded-full bg-white/70 text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                                View details
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

                                    <div className="flex justify-between items-baseline max-[425px]:flex-col max-[425px]:items-start max-[425px]:gap-1 mb-1">
                                        <h4 className="font-serif text-lg sm:text-xl lg:text-2xl text-stone-900 group-hover:text-rose-500 transition-colors">
                                            {product.name}
                                        </h4>
                                        <span className="font-medium text-stone-600 max-[425px]:text-sm">{formatPrice(product.price)}</span>
                                    </div>
                                    <p className="text-stone-500 text-xs sm:text-sm line-clamp-2 font-light">{product.description}</p>
                                </motion.div>
                            )
                        })}
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
                            href={`https://wa.me/+${APP_CONFIG.whatsappNumber}`}
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
                                            className={`w-9 h-9 rounded-full flex items-center justify-center transition transform hover:-translate-y-0.5 ${active ? 'text-amber-500 bg-amber-50 shadow-sm' : 'text-stone-300 bg-white border border-stone-200'
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
                        {reviews.slice(0, 6).map((review) => (
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

export default HomePage;
