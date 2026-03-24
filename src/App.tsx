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
    <nav className="sticky top-0 z-50 bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer"
            onClick={() => setActiveSection('home')}
          >
            <div className="bg-secondary p-2 rounded-lg mr-2 shadow-inner">
              <Cake className="text-primary w-8 h-8" />
            </div>
            <div>
              <h1 className="text-accent font-black text-xl leading-none uppercase tracking-tighter">IKEA</h1>
              <p className="text-secondary font-bold text-xs leading-none">Cakes & Snacks</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveSection(link.id)}
                className={cn(
                  "text-accent font-bold hover:text-secondary transition-colors cursor-pointer",
                  activeSection === link.id ? "border-b-2 border-secondary" : ""
                )}
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={onCartOpen}
              className="relative p-2 bg-secondary text-white rounded-full hover:bg-accent transition-colors cursor-pointer"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-secondary text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-secondary">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={onCartOpen}
              className="relative p-2 bg-secondary text-white rounded-full"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-secondary text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-secondary">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-accent">
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
            className="md:hidden bg-primary border-t border-primary/20 overflow-hidden"
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
                    "block w-full text-left px-3 py-4 text-accent font-bold text-lg border-b border-primary/10",
                    activeSection === link.id ? "text-secondary pl-5" : ""
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
            className="fixed inset-0 bg-black/50 z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-4 bg-primary flex justify-between items-center">
              <h2 className="text-accent font-black text-xl uppercase">Your Basket</h2>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full cursor-pointer">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <ShoppingBag size={64} strokeWidth={1} />
                  <p className="font-medium">Your basket is empty</p>
                  <button 
                    onClick={onClose}
                    className="text-secondary font-bold underline cursor-pointer"
                  >
                    Start shopping
                  </button>
                </div>
              ) : (
                cartItems.map((entry) => (
                  <div key={entry.item.id} className="flex space-x-4 border-b pb-4">
                    <img 
                      src={entry.item.image} 
                      alt={entry.item.name} 
                      className="w-20 h-20 object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-accent">{entry.item.name}</h3>
                      <p className="text-secondary font-bold">₱{entry.item.price}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center border rounded-full px-2 py-1">
                          <button 
                            onClick={() => onUpdateQuantity(entry.item.id, -1)}
                            className="p-1 hover:text-secondary cursor-pointer"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 font-bold">{entry.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(entry.item.id, 1)}
                            className="p-1 hover:text-secondary cursor-pointer"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button 
                          onClick={() => onRemove(entry.item.id)}
                          className="text-gray-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t space-y-4">
                <div className="flex justify-between items-center text-xl font-black text-accent">
                  <span>Total</span>
                  <span>₱{total.toLocaleString()}</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full bg-secondary text-white py-4 rounded-full font-black text-lg shadow-lg hover:bg-accent transition-all uppercase tracking-wider cursor-pointer"
                >
                  Checkout Now
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
  <section className="relative bg-primary overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 flex flex-col md:flex-row items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:w-1/2 text-center md:text-left z-10"
      >
        <div className="inline-block bg-secondary text-white px-4 py-1 rounded-full text-sm font-bold mb-6 animate-bounce">
          🎂 Freshly Baked Daily!
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-accent leading-tight mb-6">
          Ormoc's Favorite <br />
          <span className="text-secondary">Cakes & Snacks</span>
        </h1>
        <p className="text-lg text-accent/80 font-medium mb-8 max-w-lg">
          Serving fresh cakes, Filipino favorites, and desserts loved by locals for years. 
          Taste the tradition in every bite!
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
          <button 
            onClick={onAction}
            className="bg-secondary text-white px-10 py-4 rounded-full font-black text-lg shadow-xl hover:scale-105 transition-transform uppercase cursor-pointer"
          >
            Order Now
          </button>
          <button 
            onClick={onAction}
            className="bg-white text-accent border-2 border-accent px-10 py-4 rounded-full font-black text-lg hover:bg-accent hover:text-white transition-all uppercase cursor-pointer"
          >
            View Menu
          </button>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="md:w-1/2 mt-12 md:mt-0 relative"
      >
        <div className="absolute inset-0 bg-secondary/20 rounded-full blur-3xl" />
        <img 
          src="https://picsum.photos/seed/bakery-hero/800/800" 
          alt="Featured Chocolate Cake" 
          className="relative rounded-3xl shadow-2xl border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border-2 border-primary hidden md:block">
          <div className="flex items-center space-x-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <span className="font-bold text-accent">5,000+ Happy Locals</span>
          </div>
        </div>
      </motion.div>
    </div>
    
    {/* Decorative elements */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -mr-32 -mt-32" />
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full -ml-48 -mb-48" />
  </section>
);

const FeaturedItems = ({ onAddToCart }: { onAddToCart: (item: MenuItem) => void }) => {
  const popularItems = useMemo(() => MENU_ITEMS.filter(item => item.popular), []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-accent uppercase tracking-tight">Most Ordered</h2>
          <div className="w-24 h-2 bg-primary mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {popularItems.map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ y: -10 }}
              className="card-yellow flex flex-col h-full"
            >
              <div className="relative mb-4 overflow-hidden rounded-xl">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                  Best Seller
                </div>
              </div>
              <h3 className="text-lg font-black text-accent mb-1">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-4 flex-1">{item.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xl font-black text-secondary">₱{item.price}</span>
                <button 
                  onClick={() => onAddToCart(item)}
                  className="bg-secondary text-white p-2 rounded-full hover:bg-accent transition-colors cursor-pointer"
                >
                  <Plus size={20} />
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
    <section id="menu" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-accent uppercase">Full Menu</h2>
          <p className="text-gray-500 mt-2">Authentic Filipino flavors for every craving</p>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-8 space-x-4 no-scrollbar justify-start md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all flex items-center space-x-2 cursor-pointer",
                activeCategory === cat 
                  ? "bg-secondary text-white shadow-lg scale-105" 
                  : "bg-white text-accent border-2 border-primary hover:bg-primary/20"
              )}
            >
              {cat === 'Cakes' && <Cake size={18} />}
              {cat === 'Desserts' && <IceCream size={18} />}
              {cat === 'Meals' && <Utensils size={18} />}
              {cat === 'Snacks' && <Star size={18} />}
              {cat === 'Drinks' && <Coffee size={18} />}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex space-x-4 hover:shadow-md transition-shadow"
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-black text-accent leading-tight">{item.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-black text-secondary">₱{item.price}</span>
                    <button 
                      onClick={() => onAddToCart(item)}
                      className="text-xs bg-primary text-accent font-bold px-3 py-1 rounded-full hover:bg-secondary hover:text-white transition-colors cursor-pointer"
                    >
                      Add to Basket
                    </button>
                  </div>
                </div>
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
    <section id="custom" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-black text-accent uppercase mb-6">Custom Cakes</h2>
            <p className="text-lg text-gray-600 mb-8">
              Make your celebrations extra special with a personalized cake. 
              Whether it's for a birthday, wedding, or anniversary, we'll bake your dream design!
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-primary p-3 rounded-full text-secondary">
                  <CheckCircle2 size={24} />
                </div>
                <span className="font-bold text-accent">Choose your flavor & size</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-primary p-3 rounded-full text-secondary">
                  <CheckCircle2 size={24} />
                </div>
                <span className="font-bold text-accent">Upload your own design</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-primary p-3 rounded-full text-secondary">
                  <CheckCircle2 size={24} />
                </div>
                <span className="font-bold text-accent">Pickup or Delivery in Ormoc</span>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="card-yellow p-8">
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="bg-green-100 text-green-600 w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-6">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-accent mb-2">Order Received!</h3>
                  <p className="text-gray-600">We'll contact you shortly to confirm your custom cake details.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-accent mb-1">Your Name</label>
                      <input 
                        required
                        type="text" 
                        className="w-full p-3 rounded-xl border-2 border-primary focus:border-secondary outline-none"
                        placeholder="Juan Dela Cruz"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-accent mb-1">Phone Number</label>
                      <input 
                        required
                        type="tel" 
                        className="w-full p-3 rounded-xl border-2 border-primary focus:border-secondary outline-none"
                        placeholder="0912 345 6789"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-accent mb-1">Celebration Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full p-3 rounded-xl border-2 border-primary focus:border-secondary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-accent mb-1">Cake Size</label>
                    <select className="w-full p-3 rounded-xl border-2 border-primary focus:border-secondary outline-none bg-white">
                      <option>6 inch (Small)</option>
                      <option>8 inch (Medium)</option>
                      <option>10 inch (Large)</option>
                      <option>2-Tier Special</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-accent mb-1">Instructions / Theme</label>
                    <textarea 
                      className="w-full p-3 rounded-xl border-2 border-primary focus:border-secondary outline-none h-24"
                      placeholder="Tell us about the theme, colors, or message..."
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-accent mb-1">Upload Design (Optional)</label>
                    <div className="border-2 border-dashed border-primary rounded-xl p-6 text-center hover:bg-primary/5 transition-colors cursor-pointer">
                      <Upload className="mx-auto text-secondary mb-2" />
                      <p className="text-xs text-gray-500">Click to upload or drag and drop image</p>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-secondary text-white py-4 rounded-full font-black text-lg shadow-lg hover:bg-accent transition-all uppercase cursor-pointer"
                  >
                    Request Quote
                  </button>
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
  <section id="about" className="py-16 bg-primary/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <img 
            src="https://picsum.photos/seed/bakery-store/800/600" 
            alt="IKEA Cakes Store" 
            className="rounded-3xl shadow-xl border-4 border-white"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-3xl md:text-5xl font-black text-accent uppercase mb-6">Our Story</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Serving Ormoc for many years, <span className="font-bold text-secondary">IKEA Cakes & Snacks</span> has become a beloved go-to spot 
            for families celebrating life's sweetest moments. 
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            What started as a small local bakery has grown into a community favorite, 
            known for our signature chocolate cakes, refreshing halo-halo, and 
            comforting Filipino meals. We pride ourselves on using quality ingredients 
            and traditional recipes that bring a smile to every customer.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
              <p className="text-3xl font-black text-secondary">100%</p>
              <p className="text-sm font-bold text-accent">Freshly Baked</p>
            </div>
            <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
              <p className="text-3xl font-black text-secondary">Local</p>
              <p className="text-sm font-bold text-accent">Ormoc Favorite</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ContactSection = () => (
  <section id="contact" className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-accent uppercase">Visit Us</h2>
        <p className="text-gray-500 mt-2">We have two convenient locations in Ormoc City</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Branch 1 */}
        <div className="card-yellow p-8 flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <h3 className="text-2xl font-black text-secondary mb-4">Main Branch</h3>
            <div className="space-y-4 text-accent">
              <div className="flex items-start space-x-3">
                <MapPin className="flex-shrink-0 mt-1" />
                <p className="font-medium">Bonifacio Street, Ormoc City, Leyte</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="flex-shrink-0" />
                <p className="font-medium">(053) 561-XXXX</p>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="flex-shrink-0" />
                <p className="font-medium">8:00 AM - 8:00 PM</p>
              </div>
            </div>
            <button className="mt-8 flex items-center space-x-2 bg-secondary text-white px-6 py-3 rounded-full font-bold hover:bg-accent transition-all cursor-pointer">
              <MessageCircle size={20} />
              <span>Chat on Messenger</span>
            </button>
          </div>
          <div className="md:w-1/2 h-48 md:h-auto bg-gray-200 rounded-2xl overflow-hidden">
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
        <div className="card-yellow p-8 flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <h3 className="text-2xl font-black text-secondary mb-4">Robinsons Branch</h3>
            <div className="space-y-4 text-accent">
              <div className="flex items-start space-x-3">
                <MapPin className="flex-shrink-0 mt-1" />
                <p className="font-medium">Robinsons Place Ormoc, Leyte</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="flex-shrink-0" />
                <p className="font-medium">(053) 561-YYYY</p>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="flex-shrink-0" />
                <p className="font-medium">10:00 AM - 9:00 PM</p>
              </div>
            </div>
            <button className="mt-8 flex items-center space-x-2 bg-secondary text-white px-6 py-3 rounded-full font-bold hover:bg-accent transition-all cursor-pointer">
              <MessageCircle size={20} />
              <span>Chat on Messenger</span>
            </button>
          </div>
          <div className="md:w-1/2 h-48 md:h-auto bg-gray-200 rounded-2xl overflow-hidden">
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
  <footer className="bg-accent text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center mb-6">
            <div className="bg-secondary p-2 rounded-lg mr-2">
              <Cake className="text-primary w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">IKEA Cakes & Snacks</h2>
          </div>
          <p className="text-gray-300 max-w-md mb-6">
            Ormoc's favorite destination for fresh cakes, snacks, and Filipino comfort food. 
            Celebrating life's sweetest moments with you since many years.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-secondary transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-secondary transition-colors">
              <MessageCircle size={20} />
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-6 text-primary">Quick Links</h3>
          <ul className="space-y-4 text-gray-300">
            <li><a href="#home" className="hover:text-white">Home</a></li>
            <li><a href="#menu" className="hover:text-white">Menu</a></li>
            <li><a href="#custom" className="hover:text-white">Custom Cakes</a></li>
            <li><a href="#about" className="hover:text-white">Our Story</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-6 text-primary">Contact</h3>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-center space-x-3">
              <Phone size={16} />
              <span>(053) 561-XXXX</span>
            </li>
            <li className="flex items-center space-x-3">
              <MapPin size={16} />
              <span>Ormoc City, Leyte</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-400">
        <p>© 2026 IKEA Cakes & Snacks Ormoc. All rights reserved.</p>
        <p className="mt-2">Designed with ❤️ for Ormoc Locals.</p>
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
            className="bg-secondary text-white text-center py-2 px-4 text-sm font-bold relative z-[60]"
          >
            🎉 Birthday Cake Packages available! Order 3 days in advance.
            <button 
              onClick={() => setShowPromo(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-primary cursor-pointer"
            >
              <X size={16} />
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
          className="bg-secondary text-white p-4 rounded-full shadow-2xl flex items-center justify-center animate-pulse cursor-pointer"
        >
          <ShoppingBag size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-accent text-xs font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-secondary">
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
          alert('Checkout feature coming soon! Please visit our store or message us on Facebook to complete your order.');
          setIsCartOpen(false);
        }}
      />
    </div>
  );
}
