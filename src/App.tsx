/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode, FormEvent } from 'react';
import { 
  Instagram, 
  Phone, 
  MapPin, 
  Clock, 
  Mail, 
  Star, 
  CheckCircle2, 
  Menu, 
  X, 
  ChevronRight,
  ArrowRight,
  Heart,
  Sparkles,
  Users,
  ShieldCheck,
  Gem,
  Award,
  Wand2,
  Loader2,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateNailDesign, generateNailDesignImage, NailArtDesign } from './services/gemini';

const INSTAGRAM_URL = "https://www.instagram.com/ivys_nail_lounge?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=2070&auto=format&fit=crop",
  nails1: "https://images.unsplash.com/photo-1604654894611-6973b376cbde?q=80&w=1200&auto=format&fit=crop",
  nails2: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=1200&auto=format&fit=crop",
  nails3: "https://images.unsplash.com/photo-1599948058210-7a2ec13a9bf9?q=80&w=1200&auto=format&fit=crop",
  pedicure: "https://images.unsplash.com/photo-1519415749292-0fe7a5568e0d?q=80&w=1200&auto=format&fit=crop",
  salon: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1200&auto=format&fit=crop",
  insta1: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=1200&auto=format&fit=crop",
  insta2: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
  insta3: "https://images.unsplash.com/photo-1610992015762-46639634e402?q=80&w=1200&auto=format&fit=crop",
  insta4: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=1200&auto=format&fit=crop",
  bridal_french_nails: "https://images.unsplash.com/photo-1629295551984-7a1309f743df?q=80&w=1200&auto=format&fit=crop",
  chrome_pink_nails: "https://images.unsplash.com/photo-1629191024508-4122d2518e38?q=80&w=1200&auto=format&fit=crop",
};

const SectionHeading = ({ children, subtitle, light = false }: { children: ReactNode, subtitle?: string, light?: boolean }) => (
  <div className="text-center mb-16 px-4">
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className={`uppercase tracking-[0.3em] text-xs mb-4 font-medium ${light ? 'text-white/70' : 'text-brand-gold'}`}
      >
        {subtitle}
      </motion.p>
    )}
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={`text-4xl md:text-5xl lg:text-6xl ${light ? 'text-white' : 'text-zinc-900'}`}
    >
      {children}
    </motion.h2>
    <div className={`h-px w-24 mx-auto mt-8 ${light ? 'bg-white/20' : 'bg-brand-gold/30'}`} />
  </div>
);

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Booking Form State
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: ''
  });

  const handleBookingSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`New Nail Appointment Request - ${bookingData.name}`);
    const body = encodeURIComponent(
      `Appointment Details:\n\n` +
      `Name: ${bookingData.name}\n` +
      `Phone: ${bookingData.phone}\n` +
      `Service: ${bookingData.service}\n` +
      `Preferred Date: ${bookingData.date}\n` +
      `Preferred Time: ${bookingData.time}\n` +
      `Additional Notes: ${bookingData.notes}\n\n` +
      `Sent from Ivy's Nail Lounge Website`
    );
    window.location.href = `mailto:ivy_phan128@yahoo.co.uk?subject=${subject}&body=${body}`;
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Services', href: '#services', id: 'services' },
    { name: 'Gallery', href: '#gallery', id: 'gallery' },
    { name: 'Reviews', href: '#reviews', id: 'reviews' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  // AI Designer State
  const [preferences, setPreferences] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesign, setGeneratedDesign] = useState<NailArtDesign | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!preferences.trim()) return;
    setIsGenerating(true);
    setGeneratedDesign(null);
    setGeneratedImage(null);

    try {
      const design = await generateNailDesign(preferences);
      setGeneratedDesign(design);
      
      // Attempt image generation
      try {
        const imageUrl = await generateNailDesignImage(design.title + ": " + design.description);
        setGeneratedImage(imageUrl);
      } catch (imgError) {
        console.error("Image generation failed:", imgError);
        // Fallback or just show text
      }
    } catch (error) {
      console.error("AI Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [selectedImage, setSelectedImage] = useState<{ src: string, title: string } | null>(null);

  return (
    <div className="min-h-screen">
      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] glass bg-zinc-900/90 flex items-center justify-center p-6 md:p-12 cursor-zoom-out"
          >
            <motion.button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            >
              <X className="w-8 h-8" />
            </motion.button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-full bg-white rounded-[2rem] overflow-hidden gold-shadow cursor-default"
            >
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title} 
                className="w-full h-auto max-h-[80vh] object-contain bg-zinc-50"
                referrerPolicy="no-referrer"
              />
              <div className="p-8 md:p-10 bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-3xl font-display text-zinc-900 mb-2 italic">{selectedImage.title}</h3>
                    <p className="text-brand-gold font-bold tracking-widest text-xs uppercase">Bespoke Design • Ivy's Nail Lounge</p>
                  </div>
                  <button 
                    onClick={() => {
                      setBookingData({...bookingData, service: selectedImage.title});
                      setSelectedImage(null);
                      scrollToSection('booking');
                    }}
                    className="bg-brand-gold text-white px-8 py-3 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-brand-gold-dark transition-all"
                  >
                    Book This Style
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass py-4 shadow-sm' : 'bg-transparent py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="#" className="flex items-center gap-2">
            <span className={`text-2xl md:text-3xl font-display font-semibold tracking-tight ${isScrolled ? 'text-zinc-900' : 'text-white'}`}>
              Ivy's <span className={isScrolled ? 'text-brand-gold' : 'text-brand-blush'}>Nail Lounge</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(link.id); }}
                className={`text-sm tracking-widest uppercase font-medium transition-colors hover:text-brand-gold ${
                  isScrolled ? 'text-zinc-600' : 'text-white/90'
                }`}
              >
                {link.name}
              </a>
            ))}
            <button 
              id="nav-book-now"
              onClick={() => scrollToSection('booking')}
              className="bg-brand-gold hover:bg-brand-gold-dark text-white text-xs tracking-[0.2em] uppercase font-bold px-6 py-3 rounded-full transition-all gold-shadow"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-zinc-900" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className={isScrolled ? 'text-zinc-900' : 'text-white'} />
            ) : (
              <Menu className={isScrolled ? 'text-zinc-900' : 'text-white'} />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-zinc-100 overflow-hidden"
            >
              <div className="p-6 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollToSection(link.id); }}
                    className="text-lg font-medium text-zinc-800"
                  >
                    {link.name}
                  </a>
                ))}
                <button 
                  onClick={() => scrollToSection('booking')}
                  className="w-full bg-brand-gold text-white font-bold py-4 rounded-xl"
                >
                  Book Appointment
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={IMAGES.hero} 
            alt="Ivy's Nail Lounge Luxury Interior" 
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex justify-center mb-6">
              <span className="px-4 py-1 rounded-full border border-white/30 text-[10px] uppercase tracking-[0.3em] backdrop-blur-md">
                Premiere Salon in Bath
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display mb-8 leading-[1.1] tracking-tight">
              Luxury Nails in the <br />
              <span className="italic font-normal">Heart of Bath</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Beautiful BIAB, acrylics, gel nails & nail art designed to make you feel confident and elegant.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => scrollToSection('booking')}
                className="w-full sm:w-auto bg-brand-gold hover:bg-brand-gold-dark text-white px-10 py-5 rounded-full font-bold tracking-widest text-sm uppercase transition-all transform hover:scale-105 gold-shadow"
              >
                Book Appointment
              </button>
              <button 
                onClick={() => scrollToSection('gallery')}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-10 py-5 rounded-full font-bold tracking-widest text-sm uppercase transition-all"
              >
                View Gallery
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12 opacity-90">
              {[
                { label: '160+ Happy Clients', icon: Users },
                { label: '4.7★ Rated', icon: Award },
                { label: 'Walk-ins Welcome', icon: CheckCircle2 },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2">
                  <badge.icon className="w-5 h-5 text-brand-blush" />
                  <span className="text-xs uppercase tracking-widest font-semibold">{badge.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-px h-16 bg-linear-to-b from-white/60 to-transparent" />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 md:py-32 bg-brand-nude over">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 rounded-[2rem] overflow-hidden gold-shadow">
                <img src={IMAGES.salon} alt="Ivy's Nail Lounge Atmosphere" className="w-full h-auto" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-brand-blush/40 rounded-full blur-3xl -z-0" />
              <div className="absolute -top-8 -left-8 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -z-0" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-brand-gold uppercase tracking-[0.3em] text-xs font-bold mb-6">Our Story</p>
              <h2 className="text-4xl md:text-5xl font-display text-zinc-900 mb-8 leading-tight">
                Bath's Favorite Destination for <span className="italic">Nail Perfection</span>
              </h2>
              <div className="space-y-6 text-zinc-600 leading-relaxed text-lg">
                <p>
                  Located in the vibrant heart of Bath, Ivy’s Nail Lounge has established itself as a premier sanctuary for beauty enthusiasts. Our studio is more than just a nail salon; it's a place where artistry meets relaxation.
                </p>
                <p>
                  We pride ourselves on our highly skilled technicians who specialize in trendy nail art, professional BIAB treatments, and long-lasting acrylics. Every appointment at Ivy’s is designed to be a luxury experience, ensuring you leave feeling confident and pampered.
                </p>
                <div className="grid grid-cols-2 gap-8 pt-6">
                  <div>
                    <h4 className="font-display text-2xl text-zinc-900 mb-2">Central Location</h4>
                    <p className="text-sm">Easy access in the heart of Bath city center.</p>
                  </div>
                  <div>
                    <h4 className="font-display text-2xl text-zinc-900 mb-2">Expert Artists</h4>
                    <p className="text-sm">Specialists in detailed nail art and BIAB.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading subtitle="What We Offer">Luxury Services</SectionHeading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'BIAB Nails', price: '£35', desc: 'Builder In A Bottle — perfect for strengthening natural nails.', icon: ShieldCheck },
              { title: 'Gel Manicure', price: '£28', desc: 'Chip-resistant glossy finish that lasts for weeks.', icon: Sparkles },
              { title: 'Acrylic Full Set', price: '£35', desc: 'Standard or sculpted extensions for extra length.', icon: Gem },
              { title: 'Luxury Pedicure', price: '£25', desc: 'Relaxing soak, exfoliation, and perfect polish.', icon: Heart },
              { title: 'Nail Art', price: 'from £5', desc: 'Custom designs, chrome, gems, and hand-painted art.', icon: Award },
              { title: 'Removal & Infills', price: 'from £20', desc: 'Professional maintenance for your sets.', icon: CheckCircle2 },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-3xl border border-zinc-100 bg-brand-nude/30 hover:bg-white hover:shadow-xl hover:border-brand-gold/10 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <service.icon className="w-6 h-6 text-brand-gold" />
                </div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-display text-zinc-900">{service.title}</h3>
                  <span className="text-brand-gold font-bold">{service.price}</span>
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                  {service.desc}
                </p>
                <button 
                  onClick={() => {
                    setBookingData({...bookingData, service: service.title});
                    scrollToSection('booking');
                  }}
                  className="text-xs uppercase tracking-widest font-bold flex items-center gap-2 text-brand-gold hover:gap-4 transition-all"
                >
                  Book Now <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Bespoke Designer Section */}
      <section id="ai-designer" className="py-24 md:py-32 bg-brand-pink/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionHeading subtitle="Innovation Meets Beauty">Bespoke AI Designer</SectionHeading>
              <p className="text-zinc-600 mb-8 -mt-12 text-center lg:text-left mx-auto lg:mx-0 max-w-xl">
                Can't decide on your next look? Let our AI nail consultant design a unique concept tailored just for you. Describe your mood, outfit, or event, and watch the magic happen.
              </p>
              
              <div className="glass p-8 rounded-[2.5rem] gold-shadow relative">
                <textarea 
                  className="w-full h-40 bg-white/50 border border-brand-gold/20 rounded-2xl p-6 text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all resize-none mb-6"
                  placeholder="e.g., 'Modern minimalist with gold leaf for a summer wedding' or 'Dark emerald green with celestial patterns'"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                />
                <button 
                  onClick={handleGenerate}
                  disabled={!preferences.trim() || isGenerating}
                  className="w-full bg-linear-to-r from-zinc-900 to-zinc-800 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:from-brand-gold hover:to-brand-gold-dark transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Designing Your Concept...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Generate My Design
                    </>
                  )}
                </button>
                <div className="absolute -top-4 -right-4 bg-brand-gold text-white p-3 rounded-2xl gold-shadow animate-pulse">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
            </motion.div>

            <div className="relative min-h-[500px]">
              <AnimatePresence mode="wait">
                {generatedDesign ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="h-full"
                  >
                    <div className="bg-white rounded-[3rem] p-10 gold-shadow border border-brand-gold/10 relative overflow-hidden h-full">
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 text-brand-gold mb-4 font-bold tracking-widest text-xs uppercase">
                          <CheckCircle2 className="w-4 h-4" /> Your Custom Creation
                        </div>
                        <h3 className="text-3xl md:text-4xl font-display text-zinc-900 mb-4 italic">
                          {generatedDesign.title}
                        </h3>
                        <p className="text-zinc-600 mb-8 leading-relaxed">
                          {generatedDesign.description}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                          <div>
                            <h4 className="text-xs uppercase tracking-widest font-bold text-zinc-400 mb-4 flex items-center gap-2">
                              <Palette className="w-3 h-3" /> Color Palette
                            </h4>
                            <div className="flex gap-3">
                              {generatedDesign.colors.map((color, i) => (
                                <div key={i} className="group relative">
                                  <div className="w-10 h-10 rounded-full border border-zinc-100 shadow-sm" style={{ backgroundColor: color.toLowerCase() }} title={color} />
                                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 text-white px-2 py-1 rounded">
                                    {color}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs uppercase tracking-widest font-bold text-zinc-400 mb-4 flex items-center gap-2">
                              <Wand2 className="w-3 h-3" /> Occasion
                            </h4>
                            <p className="text-zinc-800 font-medium">{generatedDesign.occasion}</p>
                          </div>
                        </div>

                        <div className="mb-8">
                          <h4 className="text-xs uppercase tracking-widest font-bold text-zinc-400 mb-4">Techniques Used</h4>
                          <div className="flex flex-wrap gap-2">
                            {generatedDesign.techniques.map((tech, i) => (
                              <span key={i} className="bg-brand-pink text-brand-gold text-[10px] font-bold px-3 py-1.5 rounded-full border border-brand-gold/10">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {generatedImage ? (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="aspect-square rounded-3xl overflow-hidden gold-shadow mb-8"
                          >
                            <img src={generatedImage} alt={generatedDesign.title} className="w-full h-full object-cover" />
                          </motion.div>
                        ) : (
                          <div className="aspect-square rounded-3xl border-2 border-dashed border-brand-gold/20 flex flex-col items-center justify-center p-8 bg-brand-pink/20 mb-8">
                            <Sparkles className="w-10 h-10 text-brand-gold/30 mb-4" />
                            <p className="text-zinc-400 text-sm text-center">Visualizing your design...</p>
                          </div>
                        )}

                        <button 
                          onClick={() => {
                            if (generatedDesign) {
                              setBookingData({...bookingData, service: `AI Bespoke: ${generatedDesign.title}`, notes: `AI Recommended Techniques: ${generatedDesign.techniques.join(', ')}`});
                              scrollToSection('booking');
                            }
                          }}
                          className="w-full bg-brand-gold text-white font-bold py-4 rounded-2xl hover:bg-brand-gold-dark transition-all"
                        >
                          Book This Design
                        </button>
                      </div>
                      <div className="absolute top-0 right-0 p-8 opacity-5">
                         <Wand2 className="w-64 h-64 text-brand-gold rotate-12" />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center p-12 text-center"
                  >
                    <div className="w-24 h-24 rounded-full bg-brand-blush/30 flex items-center justify-center mb-8 animate-pulse">
                      <Sparkles className="w-10 h-10 text-brand-gold" />
                    </div>
                    <h3 className="text-2xl font-display text-zinc-900 mb-4 italic">Waiting for Your Inspiration</h3>
                    <p className="text-zinc-500 max-w-sm">Enter your style preferences to the left and our luxury AI will weave a design specifically for you.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 md:py-32 bg-brand-nude">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading subtitle="Our Portfolio">Instagram Worthy</SectionHeading>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
            {[
              { src: IMAGES.nails1, title: 'Glossy Nude Nails' },
              { src: IMAGES.nails2, title: 'Gold Leaf Art' },
              { src: IMAGES.nails3, title: 'Summer BIAB' },
              { src: IMAGES.insta3, title: 'Celestial Art' },
              { src: IMAGES.bridal_french_nails, title: 'Bridal French Tips' },
              { src: IMAGES.chrome_pink_nails, title: 'Iridescent Chrome' },
              { src: IMAGES.pedicure, title: 'Luxury Pedicure' },
              { src: IMAGES.insta1, title: 'Modern Salon Aesthetic' },
              { src: IMAGES.insta2, title: 'Detailed Nail Art' },
              { src: IMAGES.insta4, title: 'Pastel Dream' },
            ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  onClick={() => setSelectedImage(item)}
                  className="break-inside-avoid relative overflow-hidden rounded-2xl md:rounded-[2rem] bg-zinc-100 gold-shadow cursor-pointer group"
                >
                  <img 
                    src={item.src} 
                    alt={item.title} 
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                    <p className="text-white font-display text-xl text-center mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {item.title}
                    </p>
                    <div className="h-px w-12 bg-brand-gold transform scale-0 group-hover:scale-100 transition-transform duration-500" />
                  </div>
                </motion.div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <a 
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-brand-gold font-bold uppercase tracking-widest hover:gap-5 transition-all"
            >
              <Instagram className="w-5 h-5" /> View More on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section id="reviews" className="py-24 md:py-32 bg-zinc-900 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading subtitle="Loved by Clients" light>Customer Praise</SectionHeading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Sarah', text: "Always a lovely experience, great quality and quick and friendly! Wouldn't go anywhere else in Bath." },
              { name: 'Jessica', text: "I commute from Bristol because I refuse to go anywhere else. Best nail salon ever!" },
              { name: 'Emma', text: "My BIAB nails lasted beautifully for weeks. Excellent attention to detail and staff are so welcoming." },
              { name: 'Chloe', text: "The staff are so welcoming and my nails always look stunning. A true luxury experience." },
              { name: 'Mia', text: "Quick and professional service without compromising quality. The nail art is next level!" },
              { name: 'Olivia', text: "Beautiful salon atmosphere and very clean. My go-to spot for special event nails." },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm p-10 rounded-3xl border border-white/10 relative"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                  ))}
                </div>
                <p className="text-white/80 italic text-lg mb-8 leading-relaxed">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-linear-to-tr from-brand-gold/20 to-brand-gold flex items-center justify-center text-white font-bold">
                    {review.name[0]}
                  </div>
                  <span className="text-white font-medium">{review.name}</span>
                </div>
                <Sparkles className="absolute top-10 right-10 w-6 h-6 text-brand-gold/20" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading subtitle="Experience the Best">Why Choose Us</SectionHeading>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
            {[
              { title: 'Highly Rated Salon', icon: Award, desc: '160+ verified reviews with consistent 4.7★ excellence.' },
              { title: 'Expert Nail Artists', icon: Users, desc: 'Trained professionals who stay on top of the latest trends.' },
              { title: 'Long-Lasting Results', icon: ShieldCheck, desc: 'Premium products ensure your nails stay healthy and beautiful.' },
              { title: 'Friendly Team', icon: Heart, desc: 'A welcoming atmosphere where every client feels like family.' },
              { title: 'Trendy Designs', icon: Sparkles, desc: 'From minimal chic to elaborate hand-painted art.' },
              { title: 'Premium Products', icon: Gem, desc: 'We only use top-tier brands for the best possible finish.' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-brand-nude flex items-center justify-center mb-6 text-brand-gold">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-display text-zinc-900 mb-3">{item.title}</h3>
                <p className="text-zinc-500 text-sm max-w-xs">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram / Social Section */}
      <section className="py-24 bg-brand-nude overflow-hidden border-t border-brand-gold/10">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
            <Instagram className="w-8 h-8 mx-auto mb-4 text-brand-gold" />
            <h2 className="text-3xl font-display mb-2">Follow the Aesthetic</h2>
            <p className="text-brand-gold tracking-[0.2em] uppercase text-xs font-bold">@ivys_nail_lounge</p>
        </div>
        
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto no-scrollbar mask-fade-sides py-4 px-12 md:px-24">
              {[IMAGES.insta1, IMAGES.insta2, IMAGES.insta3, IMAGES.insta4, IMAGES.nails1, IMAGES.nails2, IMAGES.nails3, IMAGES.bridal_french_nails].map((img, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className="min-w-[280px] h-[350px] rounded-3xl overflow-hidden shadow-lg border border-white/20 bg-zinc-100"
                  >
                      <img 
                        src={img} 
                        alt="Instagram Feed" 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                  </motion.div>
              ))}
          </div>
        </div>

        <div className="text-center mt-12 px-6">
            <p className="text-zinc-500 mb-8 max-w-lg mx-auto leading-relaxed">Get your daily dose of nail inspiration, latest designs, and studio updates directly from our Instagram feed.</p>
            <a 
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-900 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 mx-auto hover:bg-brand-gold transition-all gold-shadow group w-fit"
            >
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" /> Follow for Inspiration
            </a>
        </div>
      </section>

      {/* Location & Contact */}
      <section id="contact" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <SectionHeading subtitle="Visit Us">Find Our Studio</SectionHeading>
              
              <div className="space-y-12">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-nude flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-brand-gold" />
                  </div>
                  <div>
                    <h4 className="text-xl font-display mb-2">Address</h4>
                    <p className="text-zinc-600">13A Westgate Buildings, Bath BA1 1EB, UK</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-nude flex items-center justify-center flex-shrink-0">
                    <Clock className="text-brand-gold" />
                  </div>
                  <div>
                    <h4 className="text-xl font-display mb-2">Opening Hours</h4>
                    <div className="grid grid-cols-2 gap-x-8 text-zinc-600">
                      <span>Mon – Sat:</span>
                      <span>9:00 AM – 7:00 PM</span>
                      <span>Sunday:</span>
                      <span>10:30 AM – 5:00 PM</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-nude flex items-center justify-center flex-shrink-0">
                    <Phone className="text-brand-gold" />
                  </div>
                  <div>
                    <h4 className="text-xl font-display mb-2">Call to Book</h4>
                    <p className="text-zinc-600">01225 335511</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-nude flex items-center justify-center flex-shrink-0">
                    <Mail className="text-brand-gold" />
                  </div>
                  <div>
                    <h4 className="text-xl font-display mb-2">Email</h4>
                    <p className="text-zinc-600 lowercase">ivy_phan128@yahoo.co.uk</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[500px] lg:h-auto rounded-[3rem] overflow-hidden gold-shadow">
                {/* Simulated Google Map UI */}
                <div className="absolute inset-0 bg-stone-200">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2490.1!2d-2.3639!3d51.3814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4871811568c07e69%3A0xc39f9b5c90b6fdc2!2s13A%20Westgate%20Buildings%2C%20Bath%20BA1%201EB!5e0!3m2!1sen!2suk!4v1715354977000!5m2!1sen!2suk"
                      className="w-full h-full border-none grayscale contrast-[1.1] brightness-[0.95]"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    ></iframe>
                </div>
                <div className="absolute top-10 left-10 glass p-6 rounded-2xl hidden md:block">
                    <h4 className="font-display font-medium text-lg mb-1">Ivy's Nail Lounge</h4>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest">13A Westgate Buildings</p>
                    <div className="mt-4 flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest">
                        <MapPin className="w-3 h-3" /> Get Directions
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking" className="py-24 md:py-32 bg-brand-nude/40">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeading subtitle="Reserve Your Spot">Book an Appointment</SectionHeading>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[3rem] p-10 md:p-16 gold-shadow border border-brand-gold/10"
          >
            <form onSubmit={handleBookingSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-zinc-400 px-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Jane Doe"
                    className="w-full bg-brand-nude/30 border border-zinc-100 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all"
                    value={bookingData.name}
                    onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-zinc-400 px-1">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="e.g. 07700 900000"
                    className="w-full bg-brand-nude/30 border border-zinc-100 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-zinc-400 px-1">Select Service</label>
                <select 
                  required
                  className="w-full bg-brand-nude/30 border border-zinc-100 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all appearance-none"
                  value={bookingData.service}
                  onChange={(e) => setBookingData({...bookingData, service: e.target.value})}
                >
                  <option value="">Choose a treatment...</option>
                  <option value="BIAB Nails">BIAB Nails</option>
                  <option value="Gel Manicure">Gel Manicure</option>
                  <option value="Acrylic Full Set">Acrylic Full Set</option>
                  <option value="Luxury Pedicure">Luxury Pedicure</option>
                  <option value="Nail Art">Nail Art</option>
                  <option value="Removal & Infills">Removal & Infills</option>
                  <option value="Other">Other (Please specify in notes)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-zinc-400 px-1">Preferred Date</label>
                  <input 
                    required
                    type="date" 
                    className="w-full bg-brand-nude/30 border border-zinc-100 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-zinc-400 px-1">Preferred Time</label>
                  <input 
                    required
                    type="time" 
                    className="w-full bg-brand-nude/30 border border-zinc-100 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all"
                    value={bookingData.time}
                    onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-zinc-400 px-1">Additional Notes (Optional)</label>
                <textarea 
                  placeholder="Any specific nail art ideas or special requirements?"
                  className="w-full h-32 bg-brand-nude/30 border border-zinc-100 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all resize-none"
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-brand-gold hover:bg-brand-gold-dark text-white font-bold py-6 rounded-2xl tracking-[0.2em] uppercase text-sm transition-all gold-shadow"
              >
                Send Booking Request
              </button>
              <p className="text-center text-[10px] text-zinc-400 uppercase tracking-widest leading-relaxed">
                Clicking send will open your email client with your details.<br /> We will contact you shortly to confirm your slot.
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-brand-gold">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-display mb-8">Ready for Your Next <br /> <span className="italic">Nail Appointment?</span></h2>
            <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">Experience the finest nail artistry in Bath. Our chairs fill up quickly, so book your luxury session today.</p>
            <button 
              onClick={() => scrollToSection('booking')}
              className="bg-white text-zinc-900 px-12 py-5 rounded-full font-bold text-sm tracking-[0.2em] uppercase hover:bg-brand-blush transition-colors shadow-2xl"
            >
              Book Your Appointment
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-brand-nude">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-display font-semibold mb-12">Ivy's <span className="text-brand-gold">Nail Lounge</span></h2>
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-12">
                {navLinks.map((link) => (
                    <a 
                        key={link.name} 
                        href={link.href}
                        onClick={(e) => { e.preventDefault(); scrollToSection(link.id); }}
                        className="text-xs uppercase tracking-widest font-bold text-zinc-500 hover:text-brand-gold transition-colors"
                    >
                        {link.name}
                    </a>
                ))}
            </div>

            <div className="flex justify-center gap-6 mb-12">
                <a 
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-zinc-400 hover:text-brand-gold hover:shadow-lg transition-all"
                >
                    <Instagram className="w-5 h-5" />
                </a>
                <a href="tel:01225335511" className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-zinc-400 hover:text-brand-gold hover:shadow-lg transition-all">
                    <Phone className="w-5 h-5" />
                </a>
            </div>

            <div className="h-px bg-zinc-200 w-full mb-12" />

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs tracking-widest text-zinc-400 font-medium uppercase">
                <p>&copy; 2024 Ivy's Nail Lounge Bath. All rights reserved.</p>
                <div className="flex gap-8">
                    <a href="#" className="hover:text-zinc-600">Privacy Policy</a>
                    <a href="#" className="hover:text-zinc-600">Terms & Conditions</a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
