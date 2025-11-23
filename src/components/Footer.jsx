import React from 'react';
import { ArrowRight } from 'lucide-react';

const Footer = () => (
  <footer className="bg-stone-900 text-[#FDFBF7] pt-20 pb-10 px-6 mt-20">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 border-b border-stone-800 pb-12">
      <div className="md:col-span-2">
        <h2 className="font-serif text-4xl mb-6">Mirai</h2>
        <p className="text-stone-400 max-w-sm font-light leading-relaxed">
          Crafting moments of sweetness through precision, patience, and the finest ingredients nature has to offer.
        </p>
      </div>
      <div>
        <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-6">Visit Us</h3>
        <p className="text-stone-300 font-light mb-2">Wadaslintang Vilalage</p>
        <p className="text-stone-300 font-light mb-2">Wonosobo</p>
        <p className="text-stone-500 text-sm mt-4">Open Daily 8am - 7pm</p>
      </div>
      <div>
        <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-6">Social</h3>
        <ul className="space-y-2">
          {[
            { label: 'Instagram', href: 'https://www.instagram.com' },
            { label: 'Twitter', href: 'https://twitter.com' },
            { label: 'Pinterest', href: 'https://www.pinterest.com' },
          ].map(link => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-stone-300 hover:text-white transition-colors font-light flex items-center gap-2 group"
              >
                {link.label} <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-stone-600">
      <p>&copy; 2024 Mirai Patisserie. All rights reserved.</p>
      <div className="flex gap-6 mt-4 md:mt-0">
        <a href="#" className="hover:text-stone-400">Privacy</a>
        <a href="#" className="hover:text-stone-400">Terms</a>
      </div>
    </div>
  </footer>
);

export default Footer;
