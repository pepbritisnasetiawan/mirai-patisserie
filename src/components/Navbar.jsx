import React, { useState, useEffect } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';

const Navbar = ({ cartCount, onOpenCart, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Menu', href: '#menu' },
    { label: 'Story', href: '#story' },
    { label: 'Products', href: '/products' },
    { label: 'Admin', href: '/admin' },
  ];
  const mainColor = scrolled ? 'text-stone-900' : 'text-white';
  const subtleColor = scrolled ? 'text-stone-600 hover:text-stone-900' : 'text-white/80 hover:text-white';
  const iconColor = scrolled ? 'text-stone-800' : 'text-white';

  const handleNavigate = (href) => {
    setIsMenuOpen(false);
    if (onNavigate) onNavigate(href);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled ? 'py-4 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-stone-200/50' : 'py-8 bg-transparent'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`flex items-center gap-2 hover:text-rose-200 transition-colors md:hidden ${iconColor}`}
            aria-label="Open navigation"
          >
            <Menu className="w-6 h-6" />
            <span className={`text-xs uppercase tracking-[0.2em] ${scrolled ? 'text-stone-600' : 'text-white/80'}`}>Menu</span>
          </button>
          <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-[0.2em]">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavigate(link.href)}
                className={`${subtleColor} transition-colors`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className={`font-serif text-3xl font-bold tracking-tight cursor-pointer transition-colors ${mainColor}`}>
            MIRAI
          </h1>
        </div>

        <button onClick={onOpenCart} className="relative group flex items-center gap-2">
          <span className={`hidden md:block text-xs uppercase tracking-[0.2em] transition-colors ${subtleColor}`}>Bag</span>
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 transition-transform group-hover:scale-110 ${iconColor}`} />
            {cartCount > 0 && (
              <span className={`absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 ${scrolled ? 'border-[#FDFBF7]' : 'border-white'}`}></span>
            )}
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-[#FDFBF7] border-r border-stone-200 z-[60] p-6 space-y-8 transform transition-transform duration-300 md:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between">
          <span className="font-serif text-xl text-stone-900">Mirai</span>
          <button onClick={() => setIsMenuOpen(false)} aria-label="Close navigation" className="p-2 rounded-full hover:bg-stone-100">
            <X className="w-5 h-5 text-stone-800" />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavigate(link.href)}
              className="text-left text-lg text-stone-800 hover:text-rose-500 uppercase tracking-[0.2em]"
            >
              {link.label}
            </button>
          ))}
        </div>
        <div className="pt-4 border-t border-stone-200">
          <button
            onClick={() => {
              setIsMenuOpen(false);
              onOpenCart();
            }}
            className="flex items-center gap-3 text-stone-800 hover:text-rose-500"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="uppercase tracking-[0.2em] text-sm">View Bag ({cartCount})</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
