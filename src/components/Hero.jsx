import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const Hero = () => {
  const heroImages = [
    {
      src: 'https://images.unsplash.com/photo-1651369278645-86bd73fbd26b?q=80&w=1425&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Lime cheesecake.',
    },
    {
      src: 'https://images.unsplash.com/photo-1582391123539-3b4fec0c2232?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Baker glazing delicate mille-feuille layers',
    },
    {
      src: 'https://images.unsplash.com/photo-1641848373087-845c3ad756c0?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Pouring espresso over an affogato dessert',
    },
  ];

  const [heroIndex, setHeroIndex] = useState(0);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const y = useTransform(scrollY, [0, 500], [0, 150]); 
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const activeImage = heroImages[heroIndex];
  const goNext = () => setHeroIndex((prev) => (prev + 1) % heroImages.length);
  const goPrev = () => setHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  useEffect(() => {
    const id = setInterval(() => {
      goNext();
    }, 6000);
    return () => clearInterval(id);
  }, [heroImages.length]); // Added dependency to be safe

  return (
    <section id="hero" className="relative h-screen min-h-[700px] overflow-hidden flex items-center justify-center bg-stone-900">
      
      {/* CONTAINER FOR PARALLAX 
        We apply the scroll Y and Scroll Opacity here to the container, 
        instead of the individual images, to prevent jitter.
      */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-stone-900/20 z-10 mix-blend-multiply pointer-events-none" />
        
        {/* ANIMATE PRESENCE 
          This is the key to the smooth transition. It allows the exiting component
          to remain in the DOM until its 'exit' animation finishes.
        */}
        <AnimatePresence mode='popLayout'>
          <motion.img
            key={heroIndex} // Changing key triggers the exit/enter
            src={activeImage.src}
            alt={activeImage.alt}
            
            // Animation States
            initial={{ opacity: 0, scale: 1.1 }} // Start slightly zoomed out and invisible
            animate={{ opacity: 1, scale: 1 }}   // Fade in and settle
            exit={{ opacity: 0 }}                // Fade out when removed
            
            // Transition Settings
            transition={{ 
              duration: 1.5, // Long duration for smoothness
              ease: "easeInOut" 
            }}
            
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </motion.div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
        >
          <span className="inline-block py-1 px-3 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs tracking-[0.2em] uppercase mb-6">
            Wonosobo • Jogja • Jakarta
          </span>
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[1.1]">
            The Art of <br/>
            <span className="italic font-light">Delicate Layers</span>
          </h2>
          <p className="text-white/90 text-lg md:text-xl font-light max-w-xl mx-auto mb-10 leading-relaxed">
            Mirai bridges traditional French technique with modern Japanese precision. Sweetness is not the goal—balance is.
          </p>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-stone-900 px-8 py-4 rounded-full text-sm tracking-widest uppercase font-medium hover:bg-stone-100 transition-colors shadow-lg shadow-black/20"
            onClick={() => {
              // Add simple fallback if menu doesn't exist yet
              const menu = document.getElementById('menu');
              if (menu) menu.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore Collection
          </motion.button>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-10 hidden md:block z-20">
        <p className="text-white/60 text-xs tracking-widest uppercase rotate-90 origin-bottom-left">Est. 2024</p>
      </div>

      {/* Image Controls */}
      <div className="absolute bottom-10 right-10 z-20 flex items-center gap-3 bg-black/30 text-white px-4 py-2 rounded-full backdrop-blur border border-white/10">
        <button
          onClick={goPrev}
          className="text-xs uppercase tracking-[0.2em] hover:text-rose-200 transition-colors pr-2"
        >
          Prev
        </button>
        <div className="flex gap-2">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${idx === heroIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <button
          onClick={goNext}
          className="text-xs uppercase tracking-[0.2em] hover:text-rose-200 transition-colors pl-2"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default Hero;