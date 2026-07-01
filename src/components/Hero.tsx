import { Search, MapPin, Calendar, Clock, Star, Compass } from "lucide-react";

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onExploreClick: () => void;
}

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onExploreClick
}: HeroProps) {
  const categories = [
    { value: "all", label: "All Experiences" },
    { value: "History & Culture", label: "History & Culture" },
    { value: "Food & Wine", label: "Culinary & Tastings" },
    { value: "Music & Arts", label: "Concerts & Music" },
    { value: "Nature & Sightseeing", label: "Cruises & Nature" }
  ];

  return (
    <div className="relative bg-ivory text-charcoal overflow-hidden min-h-[550px] md:min-h-[620px] flex items-center border-b border-charcoal/10">
      
      {/* Background Image with Layered Gradients */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-multiply">
        <img 
          src="https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1920&q=80" 
          alt="Vienna Hofburg Palace Skyline" 
          className="w-full h-full object-cover object-center transform scale-105"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Copy Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Google Rating Badge */}
            <div className="inline-flex items-center space-x-3 mb-2">
              <span className="text-gold text-sm tracking-tight font-bold">★★★★★</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-charcoal/50 font-mono">5.01 Google Reviews • Certified Agency</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[76px] leading-[0.95] font-serif font-black tracking-tighter text-charcoal">
              Unveil the <br/>
              <span className="text-gold italic font-normal">Soul</span> of Vienna
            </h1>

            <p className="text-gray-600 text-sm sm:text-base font-light leading-relaxed max-w-xl">
              Tailored excursions through the historic heart of Austria. From the hidden courtyards of Schlettergasse to the grand echoes of the Hofburg, we curate time. Ditch the massive crowd queues with local historians.
            </p>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <button 
                onClick={onExploreClick}
                className="bg-charcoal hover:bg-black text-white font-bold px-8 py-4 border border-charcoal text-xs uppercase tracking-widest shadow-xl transition-all duration-300 text-center cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Book Curated Walks</span>
              </button>
              <a 
                href="#map-section"
                onClick={(e) => {
                  e.preventDefault();
                  onExploreClick();
                  setTimeout(() => {
                    document.getElementById("map-section")?.scrollIntoView({ behavior: 'smooth' });
                  }, 200);
                }}
                className="bg-white/50 hover:bg-white border border-charcoal/20 text-charcoal font-bold px-8 py-4 text-xs uppercase tracking-widest transition-all duration-300 text-center cursor-pointer flex items-center justify-center space-x-2"
              >
                <MapPin className="h-4 w-4 text-gold" />
                <span>Interactive Map View</span>
              </a>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-charcoal/10 max-w-md">
              <div>
                <span className="font-serif text-2xl lg:text-3xl font-bold text-gold block">100%</span>
                <span className="text-[10px] text-gray-400 block font-mono uppercase tracking-wider font-semibold">Local Guides</span>
              </div>
              <div>
                <span className="font-serif text-2xl lg:text-3xl font-bold text-gold block">5.0★</span>
                <span className="text-[10px] text-gray-400 block font-mono uppercase tracking-wider font-semibold">Google Score</span>
              </div>
              <div>
                <span className="font-serif text-2xl lg:text-3xl font-bold text-gold block">24/7</span>
                <span className="text-[10px] text-gray-400 block font-mono uppercase tracking-wider font-semibold">Concierge Help</span>
              </div>
            </div>

          </div>

          {/* Search Engine Column */}
          <div className="lg:col-span-5 bg-white border border-charcoal/10 p-6 lg:p-8 shadow-xl relative">
            <div className="absolute top-0 right-0 h-16 w-16 bg-gold/10 flex items-center justify-center border-l border-b border-charcoal/5">
              <Compass className="h-6 w-6 text-gold animate-spin-slow" />
            </div>
            
            <h3 className="text-xs uppercase font-bold tracking-widest text-charcoal mb-4">
              Search Expeditions
            </h3>
            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider mb-6 border-b border-charcoal/10 pb-2">
              Instant Pricing & Availability
            </p>

            <form onSubmit={(e) => { e.preventDefault(); onExploreClick(); }} className="space-y-5">
              {/* Keyword Search */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold font-mono uppercase tracking-wider flex items-center space-x-2">
                  <Search className="h-3 w-3 text-gold" />
                  <span>Keyword Search</span>
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="e.g. Schonbrunn, Food, Concert..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-50 border border-charcoal/10 hover:border-charcoal/30 focus:border-gold px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold text-charcoal placeholder-gray-400 transition-colors"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold font-mono uppercase tracking-wider flex items-center space-x-2">
                  <MapPin className="h-3 w-3 text-gold" />
                  <span>Experience Category</span>
                </label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-stone-50 border border-charcoal/10 hover:border-gold px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold text-charcoal transition-colors cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value} className="bg-white text-charcoal">
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Details Alert */}
              <div className="bg-[#F7F3EE] border border-charcoal/5 p-3 text-xs text-gold-dark flex items-start space-x-2 font-mono leading-relaxed">
                <span>💡</span>
                <span>Enter coupon <strong>VIENNA15</strong> inside the checkout panel for a 15% booking discount!</span>
              </div>

              {/* Search Trigger */}
              <button 
                type="submit"
                className="w-full bg-charcoal hover:bg-black text-white font-bold py-3.5 border border-charcoal hover:border-black transition-colors text-xs uppercase tracking-widest font-mono cursor-pointer text-center flex items-center justify-center space-x-2"
              >
                <span>Find My Tour</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
