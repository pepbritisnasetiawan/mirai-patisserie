import React, { useMemo, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Loader2, CheckCircle2 } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, items, formatPrice, onSubmit, whatsappNumber }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    note: '',
  });
  const [status, setStatus] = useState('idle'); // idle | processing | success

  const total = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items],
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!items.length || status === 'processing') return;
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        const phoneTarget = whatsappNumber || '+62895404922012';
        const lines = [
          'Halo Mirai, saya ingin memesan:',
          ...items.map(
            (item) =>
              `- ${item.name} x${item.quantity} (${formatPrice(item.price * item.quantity)})`,
          ),
          `Total: ${formatPrice(total)}`,
          '',
          `Nama: ${form.name}`,
          `Telepon: ${form.phone}`,
          form.email ? `Email: ${form.email}` : null,
          form.note ? `Catatan: ${form.note}` : null,
        ].filter(Boolean);

        const whatsappUrl = `https://wa.me/${phoneTarget}?text=${encodeURIComponent(lines.join('\n'))}`;
        window.open(whatsappUrl, '_blank');
        onSubmit?.(form);
        onClose();
      }, 1000);
    }, 800);
  };

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return undefined;
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="checkout-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/30 backdrop-blur-sm z-[80]"
          />
          <motion.div
            key="checkout-modal"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 md:inset-12 lg:inset-20 z-[90] flex items-center justify-center p-3 md:p-4"
          >
            <div className="bg-[#FDFBF7] w-full max-w-5xl h-full md:h-auto md:max-h-full overflow-y-auto rounded-[1.5rem] md:rounded-[2rem] shadow-2xl relative">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 md:top-4 md:right-4 p-2 rounded-full hover:bg-stone-100"
                aria-label="Close checkout"
              >
                <X className="w-5 h-5 text-stone-700" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-10">
                <div className="p-6 md:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-stone-200">
                  <h3 className="font-serif text-3xl text-stone-900 mb-4">Checkout</h3>
                  <p className="text-stone-500 mb-8">Confirm your details and preferred contact. We will reach out to finalize pickup or delivery.</p>

                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.2em] text-stone-500">Full Name</label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-xl border border-stone-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-[0.2em] text-stone-500">Phone</label>
                        <input
                          required
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full rounded-xl border border-stone-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                          placeholder="+62 ..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-[0.2em] text-stone-500">Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full rounded-xl border border-stone-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.2em] text-stone-500">Notes</label>
                      <textarea
                        rows={3}
                        value={form.note}
                        onChange={(e) => setForm({ ...form, note: e.target.value })}
                        className="w-full rounded-xl border border-stone-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-stone-900"
                        placeholder="Allergies, pickup time preference, etc."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'processing' || !items.length}
                      className={`w-full py-4 rounded-xl text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-colors ${status === 'processing' || !items.length ? 'bg-stone-300 text-stone-500 cursor-not-allowed' : 'bg-stone-900 text-[#FDFBF7] hover:bg-rose-500'}`}
                    >
                      {status === 'processing' && <Loader2 className="w-4 h-4 animate-spin" />}
                      {status === 'success' ? 'Order Placed' : 'Place Order'}
                    </button>
                    {status === 'success' && (
                      <div className="flex items-center gap-2 text-emerald-600 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        Order received! We will contact you shortly.
                      </div>
                    )}
                  </form>
                </div>

                <div className="p-8 lg:p-12 bg-stone-100/80">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-serif text-2xl text-stone-900">Your Bag</h4>
                    <span className="text-sm text-stone-500">{items.length} items</span>
                  </div>

                  <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                    {items.length === 0 ? (
                      <p className="text-stone-500">Your bag is empty.</p>
                    ) : (
                      items.map((item) => (
                        <div key={item.cartId} className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-200">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="font-serif text-lg text-stone-900 leading-tight">{item.name}</p>
                            <p className="text-xs text-stone-500">Qty {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium text-stone-900">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="border-t border-stone-300 mt-6 pt-6 flex justify-between items-center">
                    <span className="text-sm uppercase tracking-[0.2em] text-stone-500">Total</span>
                    <span className="font-serif text-2xl text-stone-900">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
