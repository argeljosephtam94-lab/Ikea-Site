import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Menu as MenuIcon, 
  X, 
  Phone, 
  MapPin, 
  Clock, 
  Facebook, 
  MessageCircle, 
  ChevronRight, 
  Star, 
  Cake, 
  Utensils, 
  IceCream, 
  Coffee,
  Upload,
  Plus,
  Minus,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MENU_ITEMS, MenuItem } from './constants';
import { cn } from './lib/utils';

// --- Components ---

const Navbar = ({ 
  onCartOpen, 
  cartCount, 
  activeSection, 
  setActiveSection 
}: { 
  onCartOpen: () => void; 
  cartCount: number;
  activeSection: string;
  setActiveSection: (s: string) => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Menu', id: 'menu' },
    { name: 'Custom Cake', id: 'custom' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-paper/90 backdrop-blur-xl border-b border-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer group"
            onClick={() => setActiveSection('home')}
          >
            <div className="flex flex-col items-start">
              <span className="font-serif italic text-3xl md:text-4xl text-primary leading-none tracking-tighter lowercase">Ikea</span>
              <span className="micro-label -mt-1">Cakes & Snacks</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-12 items-center">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveSection(link.id)}
                className={cn(
                  "text-accent/60 font-bold text-[10px] uppercase tracking-[0.3em] hover:text-primary transition-all cursor-pointer relative group",
                  activeSection === link.id ? "text-primary" : ""
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute -bottom-2 left-0 w-0 h-px bg-primary transition-all duration-500 group-hover:w-full",
                  activeSection === link.id ? "w-full" : ""
                )} />
              </button>
            ))}
            <button 
              onClick={onCartOpen}
              className="relative p-2 text-primary hover:text-secondary transition-all cursor-pointer"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-paper text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={onCartOpen}
              className="relative p-2 bg-primary text-white rounded-full"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-primary text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-primary">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-primary">
              {isMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-secondary border-t border-primary/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveSection(link.id);
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "block w-full text-left px-3 py-4 text-primary font-bold text-lg border-b border-primary/5",
                    activeSection === link.id ? "text-accent pl-5" : ""
                  )}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemove,
  onCheckout
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  cartItems: { item: MenuItem; quantity: number }[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}) => {
  const total = cartItems.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-accent/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-paper z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-primary/5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif italic text-primary">Your Selection</h2>
                <p className="micro-label mt-1">{cartItems.length} Items</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-primary/5 rounded-full transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-accent/30 space-y-6">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="font-serif italic text-xl">The basket is empty</p>
                  <button 
                    onClick={onClose}
                    className="micro-label text-primary underline underline-offset-4 cursor-pointer"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                cartItems.map((entry) => (
                  <div key={entry.item.id} className="flex gap-6 group">
                    <div className="w-24 h-24 overflow-hidden flex-shrink-0">
                      <img 
                        src={entry.item.image} 
                        alt={entry.item.name} 
                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif italic text-xl text-primary">{entry.item.name}</h3>
                          <button 
                            onClick={() => onRemove(entry.item.id)}
                            className="text-accent/20 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-xs text-accent/40 mt-1">₱{entry.item.price}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4 border border-primary/10 px-3 py-1">
                          <button 
                            onClick={() => onUpdateQuantity(entry.item.id, -1)}
                            className="text-accent/40 hover:text-primary transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{entry.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(entry.item.id, 1)}
                            className="text-accent/40 hover:text-primary transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-bold text-sm">₱{(entry.item.price * entry.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-8 bg-white border-t border-primary/5 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="micro-label">Subtotal</span>
                  <span className="text-3xl font-serif italic text-primary">₱{total.toLocaleString()}</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="btn-primary w-full py-5"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Hero = ({ onAction }: { onAction: () => void }) => (
  <section className="relative min-h-screen flex items-center overflow-hidden bg-paper">
    {/* Vertical Rail Text */}
    <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:block">
      <span className="vertical-text">Ormoc's Finest Artisanal Bakery • Est. 1994</span>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="lg:col-span-7"
        >
          <span className="micro-label mb-6 block">A Legacy of Taste</span>
          <h1 className="editorial-title text-primary mb-12">
            Crafting <br />
            <span className="text-secondary not-italic font-sans font-black uppercase tracking-tighter text-6xl md:text-8xl block mt-4">Sweet Memories</span>
          </h1>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-16">
            <div className="h-px w-24 bg-primary/20 hidden sm:block" />
            <p className="text-lg text-accent/60 font-medium max-w-md leading-relaxed">
              From our signature chocolate fudge to Filipino comfort classics, 
              we've been the silent guest at Ormoc's celebrations for over three decades.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={onAction}
              className="btn-primary"
            >
              Order Online
            </button>
            <button 
              onClick={onAction}
              className="btn-secondary"
            >
              Explore Menu
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="lg:col-span-5 relative"
        >
          <div className="relative aspect-[3/4] overflow-hidden group">
            <img 
              src="https://picsum.photos/seed/bakery-hero-luxury/1200/1600" 
              alt="Signature Cake" 
              className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 border-[20px] border-paper/10" />
            
            {/* Floating Detail */}
            <div className="absolute bottom-0 left-0 bg-primary p-8 text-paper">
              <span className="micro-label text-paper/60 block mb-2">Signature</span>
              <p className="font-serif italic text-2xl">Chocolate Fudge</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const FeaturedItems = ({ onAddToCart }: { onAddToCart: (item: MenuItem) => void }) => {
  const popularItems = useMemo(() => MENU_ITEMS.filter(item => item.popular), []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <span className="micro-label mb-4 block">The Selection</span>
            <h2 className="text-5xl md:text-7xl font-serif italic text-primary leading-none">Signature Collection</h2>
          </div>
          <p className="text-accent/50 max-w-xs text-sm leading-relaxed">
            A curated selection of our most beloved creations, crafted with artisanal precision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-primary/10 border border-primary/10">
          {popularItems.map((item) => (
            <motion.div 
              key={item.id}
              className="bg-white p-8 group flex flex-col h-full relative"
            >
              <div className="relative mb-8 overflow-hidden aspect-[4/5]">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              <div className="flex-1">
                <span className="micro-label text-secondary mb-2 block">Best Seller</span>
                <h3 className="text-2xl font-serif italic text-primary mb-3">{item.name}</h3>
                <p className="text-xs text-accent/50 leading-relaxed mb-8 line-clamp-3">{item.description}</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-primary/5">
                <span className="text-xl font-bold text-primary">₱{item.price}</span>
                <button 
                  onClick={() => onAddToCart(item)}
                  className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-secondary transition-colors cursor-pointer"
                >
                  Add to Basket
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MenuSection = ({ onAddToCart }: { onAddToCart: (item: MenuItem) => void }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Cakes');
  const categories = ['Cakes', 'Desserts', 'Meals', 'Snacks', 'Drinks'];

  const filteredItems = useMemo(() => 
    MENU_ITEMS.filter(item => item.category === activeCategory), 
    [activeCategory]
  );

  return (
    <section id="menu" className="py-24 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-20">
          <span className="micro-label mb-4">The Menu</span>
          <h2 className="text-5xl md:text-7xl font-serif italic text-primary">Sweet & Savory</h2>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto pb-8 mb-16 space-x-12 no-scrollbar justify-start md:justify-center border-b border-primary/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "pb-4 font-bold uppercase tracking-[0.2em] text-[10px] transition-all relative",
                activeCategory === cat 
                  ? "text-primary" 
                  : "text-accent/30 hover:text-accent/60"
              )}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div 
                  layoutId="activeCategory"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <AnimatePresence mode="wait">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="group flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden mb-6">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <button 
                    onClick={() => onAddToCart(item)}
                    className="absolute bottom-4 right-4 bg-primary text-paper p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-serif italic text-2xl text-primary">{item.name}</h4>
                  <span className="font-bold text-primary">₱{item.price}</span>
                </div>
                <p className="text-xs text-accent/50 leading-relaxed italic">{item.description}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const CustomCakeSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="custom" className="py-24 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          <div className="lg:col-span-5">
            <span className="micro-label mb-4 block">Bespoke Baking</span>
            <h2 className="text-5xl md:text-7xl font-serif italic text-primary mb-10 leading-none">Custom Masterpieces</h2>
            <p className="text-xl text-accent/60 mb-12 leading-relaxed italic font-serif">
              "Every celebration deserves a centerpiece as unique as the moment itself."
            </p>
            
            <div className="bg-primary text-paper p-10 relative overflow-hidden mb-12">
              <div className="absolute top-0 right-0 w-32 h-32 bg-paper/5 rounded-full -mr-16 -mt-16" />
              <h4 className="font-serif italic text-2xl mb-6 flex items-center">
                <X className="mr-3 text-secondary" size={24} />
                Consultation Policy
              </h4>
              <p className="text-sm opacity-80 leading-relaxed font-medium">
                To ensure the highest quality for your special day, we do not accept customized occasion cake orders over the phone. 
                Please visit our main branch on-site for a consultation, downpayment, and to receive your claim stub.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="h-px w-12 bg-primary/20" />
                <span className="micro-label">Artisanal Craftsmanship</span>
              </div>
              <div className="flex items-center space-x-6">
                <div className="h-px w-12 bg-primary/20" />
                <span className="micro-label">Premium Ingredients Only</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 w-full">
            <div className="bg-white p-12 border border-primary/5 shadow-2xl relative">
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="text-primary w-24 h-24 flex items-center justify-center rounded-full mx-auto mb-8 border border-primary/10">
                    <CheckCircle2 size={48} strokeWidth={1} />
                  </div>
                  <h3 className="text-3xl font-serif italic text-primary mb-4">Inquiry Received</h3>
                  <p className="text-accent/50 max-w-xs mx-auto">Please visit our store to finalize your order with a consultation and downpayment.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="micro-label">Your Name</label>
                      <input 
                        required
                        type="text" 
                        className="w-full py-4 border-b border-primary/10 focus:border-primary outline-none bg-transparent transition-colors font-serif italic text-xl"
                        placeholder="Juan Dela Cruz"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="micro-label">Phone Number</label>
                      <input 
                        required
                        type="tel" 
                        className="w-full py-4 border-b border-primary/10 focus:border-primary outline-none bg-transparent transition-colors font-serif italic text-xl"
                        placeholder="0968 649 7867"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="micro-label">Celebration Date</label>
                      <input 
                        required
                        type="date" 
                        className="w-full py-4 border-b border-primary/10 focus:border-primary outline-none bg-transparent transition-colors font-serif italic text-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="micro-label">Cake Size</label>
                      <select className="w-full py-4 border-b border-primary/10 focus:border-primary outline-none bg-transparent transition-colors font-serif italic text-xl appearance-none">
                        <option>6 inch (Small)</option>
                        <option>8 inch (Medium)</option>
                        <option>10 inch (Large)</option>
                        <option>2-Tier Special</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="micro-label">Instructions / Theme</label>
                    <textarea 
                      className="w-full py-4 border-b border-primary/10 focus:border-primary outline-none bg-transparent transition-colors font-serif italic text-xl h-32 resize-none"
                      placeholder="Tell us about the theme, colors, or message..."
                    ></textarea>
                  </div>
                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="btn-primary w-full"
                    >
                      Send Inquiry
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => (
  <section id="about" className="py-24 bg-white overflow-hidden relative">
    {/* Decorative Vertical Text */}
    <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block">
      <span className="vertical-text">Artisanal Quality • Locally Sourced • Family Owned</span>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
        <div className="lg:col-span-5 relative">
          <div className="aspect-[4/5] overflow-hidden">
            <img 
              src="https://picsum.photos/seed/bakery-store/1000/1250" 
              alt="IKEA Cakes Store" 
              className="w-full h-full object-cover grayscale-[0.2]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 bg-primary p-12 text-paper hidden md:block">
            <p className="text-5xl font-serif italic leading-none">30+</p>
            <p className="micro-label text-paper/60 mt-2">Years of Tradition</p>
          </div>
        </div>
        
        <div className="lg:col-span-7">
          <span className="micro-label mb-6 block">Our Heritage</span>
          <h2 className="text-5xl md:text-7xl font-serif italic text-primary mb-10 leading-none">A Legacy of Taste</h2>
          
          <div className="space-y-8 text-accent/70">
            <p className="text-xl leading-relaxed italic font-serif">
              "Serving Ormoc for nearly three decades, IKEA Cakes & Snacks has been the silent guest at thousands of celebrations."
            </p>
            <p className="text-base leading-relaxed">
              What started as a modest local bakery has blossomed into a community landmark. 
              We remain committed to the traditional recipes that first made us famous—our 
              unmistakable chocolate fudge and the refreshing layers of our signature halo-halo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-primary/10 border border-primary/10 mt-16">
            <div className="bg-white p-10">
              <p className="text-4xl font-serif italic text-primary mb-2">100%</p>
              <p className="micro-label">Artisanal Fresh</p>
            </div>
            <div className="bg-white p-10">
              <p className="text-4xl font-serif italic text-primary mb-2">Ormoc</p>
              <p className="micro-label">Born & Raised</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ContactSection = () => (
  <section id="contact" className="py-24 bg-paper">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center mb-20">
        <span className="micro-label mb-4">Find Us</span>
        <h2 className="text-5xl md:text-7xl font-serif italic text-primary">Our Locations</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-primary/10 border border-primary/10">
        {/* Branch 1 */}
        <div className="bg-white p-12 flex flex-col gap-12">
          <div>
            <h3 className="text-4xl font-serif italic text-primary mb-8">Main Branch</h3>
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <MapPin className="flex-shrink-0 mt-1 text-secondary" size={20} strokeWidth={1.5} />
                <p className="text-accent/70 font-medium leading-relaxed">Bonifacio Street, Ormoc City, Leyte</p>
              </div>
              <div className="flex items-center space-x-6">
                <Phone className="flex-shrink-0 text-secondary" size={20} strokeWidth={1.5} />
                <p className="text-accent/70 font-medium">(053) 561-XXXX</p>
              </div>
              <div className="flex items-center space-x-6">
                <Clock className="flex-shrink-0 text-secondary" size={20} strokeWidth={1.5} />
                <p className="text-accent/70 font-medium">8:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>
          
          <div className="h-80 grayscale-[0.5] hover:grayscale-0 transition-all duration-1000 overflow-hidden">
             <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.475294524454!2d124.6041666!3d11.0027778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3307f0f6f6f6f6f7%3A0x1234567890abcdef!2sIKEA%20Cakes%20%26%20Snacks!5e0!3m2!1sen!2sph!4v1625000000000!5m2!1sen!2sph" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                title="Main Branch Map"
              ></iframe>
          </div>
        </div>

        {/* Branch 2 */}
        <div className="bg-white p-12 flex flex-col gap-12">
          <div>
            <h3 className="text-4xl font-serif italic text-primary mb-8">Robinsons Branch</h3>
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <MapPin className="flex-shrink-0 mt-1 text-secondary" size={20} strokeWidth={1.5} />
                <p className="text-accent/70 font-medium leading-relaxed">Robinsons Place Ormoc, Leyte</p>
              </div>
              <div className="flex items-center space-x-6">
                <Phone className="flex-shrink-0 text-secondary" size={20} strokeWidth={1.5} />
                <p className="text-accent/70 font-medium">(053) 561-YYYY</p>
              </div>
              <div className="flex items-center space-x-6">
                <Clock className="flex-shrink-0 text-secondary" size={20} strokeWidth={1.5} />
                <p className="text-accent/70 font-medium">10:00 AM - 9:00 PM</p>
              </div>
            </div>
          </div>
          
          <div className="h-80 grayscale-[0.5] hover:grayscale-0 transition-all duration-1000 overflow-hidden">
             <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.475294524454!2d124.6041666!3d11.0027778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3307f0f6f6f6f6f7%3A0x1234567890abcdef!2sRobinsons%20Place%20Ormoc!5e0!3m2!1sen!2sph!4v1625000000000!5m2!1sen!2sph" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                title="Robinsons Branch Map"
              ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-accent text-paper py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
        <div className="md:col-span-6">
          <div className="flex flex-col items-start mb-10">
            <span className="font-serif italic text-4xl text-paper leading-none tracking-tighter lowercase">Ikea</span>
            <span className="micro-label text-paper/40 -mt-1">Cakes & Snacks</span>
          </div>
          <p className="text-paper/50 max-w-md mb-10 leading-relaxed font-medium">
            Ormoc's premier destination for artisanal cakes and Filipino comfort. 
            Crafting sweet traditions since 1994 with locally sourced ingredients 
            and family recipes.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-paper/40 hover:text-secondary transition-colors">
              <Facebook size={20} strokeWidth={1.5} />
            </a>
            <a href="#" className="text-paper/40 hover:text-secondary transition-colors">
              <MessageCircle size={20} strokeWidth={1.5} />
            </a>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <h3 className="micro-label text-paper mb-8">Navigation</h3>
          <ul className="space-y-4 text-paper/40 text-sm font-bold uppercase tracking-widest">
            <li><a href="#home" className="hover:text-paper transition-colors">Home</a></li>
            <li><a href="#menu" className="hover:text-paper transition-colors">Menu</a></li>
            <li><a href="#custom" className="hover:text-paper transition-colors">Custom Cakes</a></li>
            <li><a href="#about" className="hover:text-paper transition-colors">Our Story</a></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h3 className="micro-label text-paper mb-8">Contact</h3>
          <ul className="space-y-6 text-paper/40 text-sm font-medium">
            <li className="flex items-start space-x-4">
              <Phone size={16} strokeWidth={1.5} className="mt-1" />
              <span>(053) 561-XXXX</span>
            </li>
            <li className="flex items-start space-x-4">
              <MapPin size={16} strokeWidth={1.5} className="mt-1" />
              <span>Bonifacio Street, <br />Ormoc City, Leyte</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="pt-12 border-t border-paper/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="micro-label text-paper/20">© 2026 IKEA Cakes & Snacks Ormoc. All rights reserved.</p>
        <p className="micro-label text-paper/20 italic font-serif lowercase tracking-normal">Crafted with tradition</p>
      </div>
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(true);

  // Scroll to section when activeSection changes
  useEffect(() => {
    const element = document.getElementById(activeSection);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSection]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(e => e.item.id === item.id);
      if (existing) {
        return prev.map(e => e.item.id === item.id ? { ...e, quantity: e.quantity + 1 } : e);
      }
      return [...prev, { item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(e => {
      if (e.item.id === id) {
        const newQty = Math.max(1, e.quantity + delta);
        return { ...e, quantity: newQty };
      }
      return e;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(e => e.item.id !== id));
  };

  const cartCount = cart.reduce((sum, e) => sum + e.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Promo Banner */}
      <AnimatePresence>
        {showPromo && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="bg-primary text-paper text-center py-3 px-4 relative z-[60]"
          >
            <span className="micro-label text-paper/80">Special Announcement</span>
            <p className="text-xs font-bold uppercase tracking-widest mt-1">
              🎉 Birthday Cake Packages available! Order 3 days in advance.
            </p>
            <button 
              onClick={() => setShowPromo(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-paper/40 hover:text-paper cursor-pointer"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar 
        onCartOpen={() => setIsCartOpen(true)} 
        cartCount={cartCount}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="flex-1">
        <div id="home">
          <Hero onAction={() => setActiveSection('menu')} />
          <FeaturedItems onAddToCart={addToCart} />
        </div>
        
        <MenuSection onAddToCart={addToCart} />
        <CustomCakeSection />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />

      {/* Sticky Order Button (Mobile) */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <button 
          onClick={() => setIsCartOpen(true)}
          className="bg-primary text-paper p-5 rounded-full shadow-2xl flex items-center justify-center cursor-pointer border border-paper/10"
        >
          <ShoppingBag size={24} strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-secondary text-primary text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-paper">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Messenger Chat Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <a 
          href="https://m.me/IKEACakesSnacksOrmoc" 
          target="_blank" 
          rel="noreferrer"
          className="bg-[#0084FF] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        >
          <MessageCircle size={24} />
        </a>
      </div>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={() => {
          // In a real app, this would redirect to a checkout page
          console.log('Proceeding to checkout...');
          setIsCartOpen(false);
        }}
      />
    </div>
  );
}
