import { useState, useMemo } from "react";
import { SlidersHorizontal, Search, Star, Filter, Heart, ArrowUpDown, X, Sparkles } from "lucide-react";
import { Tour } from "../types";
import TourCard from "./TourCard";

interface TourCatalogProps {
  tours: Tour[];
  wishlist: string[];
  onWishlistToggle: (tourId: string) => void;
  onBookClick: (tour: Tour) => void;
  onSelectTour: (tour: Tour) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function TourCatalog({
  tours,
  wishlist,
  onWishlistToggle,
  onBookClick,
  onSelectTour,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory
}: TourCatalogProps) {
  const [maxPrice, setMaxPrice] = useState<number>(120);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [showOnlyWishlist, setShowOnlyWishlist] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const categories = [
    { value: "all", label: "All Experiences" },
    { value: "History & Culture", label: "History & Culture" },
    { value: "Food & Wine", label: "Culinary & Wine" },
    { value: "Music & Arts", label: "Concerts & Music" },
    { value: "Nature & Sightseeing", label: "Cruises & Sights" }
  ];

  // Filtering Logic
  const filteredTours = useMemo(() => {
    return tours
      .filter((tour) => {
        // Keyword Search
        const matchesKeyword = 
          tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tour.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tour.longDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tour.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));

        // Category Filter
        const matchesCategory = 
          selectedCategory === "all" || tour.category === selectedCategory;

        // Price Filter
        const matchesPrice = tour.price <= maxPrice;

        // Rating Filter
        const matchesRating = tour.rating >= minRating;

        // Wishlist filter
        const matchesWishlist = !showOnlyWishlist || wishlist.includes(tour.id);

        return matchesKeyword && matchesCategory && matchesPrice && matchesRating && matchesWishlist;
      })
      .sort((a, b) => {
        // Sorting Logic
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "popularity") return b.reviewsCount - a.reviewsCount;
        return 0; // default featured
      });
  }, [tours, searchQuery, selectedCategory, maxPrice, minRating, sortBy, showOnlyWishlist, wishlist]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setMaxPrice(120);
    setMinRating(0);
    setSortBy("featured");
    setShowOnlyWishlist(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="tours-catalog">
      
      {/* Title block */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-serif font-black text-charcoal mb-4 tracking-tight">
          Imperial Vienna Experiences
        </h2>
        <p className="text-gray-500 font-light text-base sm:text-lg">
          Unveil the grandeur of Austria's capital through award-winning local excursions, historical walks, and sensory culinary journeys.
        </p>
        <div className="mt-4 flex justify-center items-center space-x-1 font-serif italic text-gold">
          <span>Rated 5.01 Stars Based on Google Customer Reviews</span>
        </div>
      </div>

      {/* Main Filter Control bar */}
      <div className="bg-white border border-charcoal/10 shadow-sm rounded-none p-6 mb-8">
        
        {/* Row 1: Quick Search and Sorting */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Category Toggle Tabs */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.value}
                id={`cat-btn-${cat.value.replace(/\s+/g, "-")}`}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer rounded-none border ${
                  selectedCategory === cat.value
                    ? "bg-charcoal text-white border-charcoal shadow-sm"
                    : "bg-stone-50 text-gray-600 hover:bg-stone-100 border-charcoal/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search, Filter, Sort Actions */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto items-center justify-end">
            
            {/* Wishlist only Toggle */}
            <button
              id="filter-wishlist-toggle"
              onClick={() => setShowOnlyWishlist(!showOnlyWishlist)}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-none text-xs font-semibold uppercase tracking-wider font-mono border transition-all cursor-pointer ${
                showOnlyWishlist
                  ? "bg-[#F7F3EE] border-gold text-gold-dark font-bold"
                  : "bg-white border-charcoal/15 text-gray-500 hover:bg-stone-50"
              }`}
            >
              <Heart className={`h-4 w-4 ${showOnlyWishlist ? "fill-gold text-gold-dark" : ""}`} />
              <span>Wishlist ({wishlist.length})</span>
            </button>

            {/* Comprehensive filters drawer toggle */}
            <button
              id="filter-drawer-toggle"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-none text-xs font-semibold uppercase tracking-wider font-mono border transition-all cursor-pointer ${
                showFilters
                  ? "bg-charcoal text-white border-charcoal"
                  : "bg-white border-charcoal/15 text-gray-500 hover:bg-stone-50"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </button>

            {/* Sorting Select */}
            <div className="relative flex items-center bg-white border border-charcoal/15 rounded-none px-3 py-2.5 text-xs font-semibold uppercase tracking-wider font-mono text-gray-500 hover:bg-stone-50 transition-colors w-full sm:w-auto">
              <ArrowUpDown className="h-4 w-4 text-gray-400 mr-2" />
              <select
                id="tour-sorting-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-gray-600 focus:outline-none cursor-pointer text-xs uppercase tracking-wider font-mono pr-4"
              >
                <option value="featured">Featured Excursions</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating: High to Low</option>
                <option value="popularity">Popular Excursions</option>
              </select>
            </div>

          </div>

        </div>

        {/* Expandable Advanced Filters Drawer */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-charcoal/10 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" id="advanced-filters-drawer">
            
            {/* Price Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-gray-500">
                <span>Maximum Price:</span>
                <span className="font-bold text-charcoal">€{maxPrice}</span>
              </div>
              <input
                id="filter-price-slider"
                type="range"
                min="35"
                max="120"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold cursor-pointer h-2 bg-stone-100 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>€35</span>
                <span>€75</span>
                <span>€120</span>
              </div>
            </div>

            {/* Min Star Rating */}
            <div className="space-y-2">
              <span className="block text-xs font-mono uppercase tracking-wider text-gray-500">Minimum Rating:</span>
              <div className="flex items-center space-x-2">
                {[0, 4, 4.5, 4.8, 4.9].map((rating) => (
                  <button
                    key={rating}
                    id={`filter-rating-${rating}`}
                    onClick={() => setMinRating(rating)}
                    className={`px-3 py-2 rounded-none text-xs font-mono tracking-wider font-semibold uppercase border transition-all cursor-pointer ${
                      minRating === rating
                        ? "bg-gold text-charcoal border-gold"
                        : "bg-white border-charcoal/10 text-gray-600 hover:bg-stone-50"
                    }`}
                  >
                    {rating === 0 ? "Any ★" : `${rating}★+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters Summary / Reset */}
            <div className="flex flex-col justify-between p-4 bg-stone-50 rounded-none border border-charcoal/10">
              <div className="text-xs text-gray-500">
                <span className="font-semibold block mb-1">Active Filters:</span>
                <p className="font-light">
                  Showing <span className="font-semibold text-gold">{filteredTours.length}</span> of {tours.length} total Vienna tours.
                </p>
              </div>
              <button
                id="filter-reset-btn"
                onClick={resetFilters}
                className="mt-3 inline-flex items-center justify-center space-x-1.5 px-3 py-2 border border-charcoal/10 text-gray-600 hover:text-red-500 hover:border-red-200 rounded-none text-xs font-mono tracking-wider font-semibold uppercase transition-colors cursor-pointer w-full bg-white"
              >
                <X className="h-3.5 w-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Featured Promo Banner */}
      {searchQuery === "" && selectedCategory === "all" && !showOnlyWishlist && (
        <div className="bg-charcoal text-white rounded-none p-6 lg:p-8 border border-gold/30 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 mb-10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-32 w-32 bg-gold/5 rounded-full blur-2xl"></div>
          <div className="space-y-2 relative z-10">
            <span className="inline-flex items-center space-x-1 bg-gold/20 text-gold px-2.5 py-1 rounded-none text-[9px] font-mono uppercase tracking-widest font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Imperial Special Promotion</span>
            </span>
            <h3 className="font-serif text-2xl font-bold">Wachau Valley Vineyard Excursion</h3>
            <p className="text-gray-300 font-light text-sm max-w-xl">
              Take 15% off our premium full-day Danube coach tour! Sip local Grüner Veltliner wines at a family Heuriger. Use coupon <strong className="text-gold font-semibold font-mono">VIENNA15</strong>.
            </p>
          </div>
          <button
            onClick={() => {
              const woodsTour = tours.find(t => t.id === "vienna-woods");
              if (woodsTour) onBookClick(woodsTour);
            }}
            className="bg-gold hover:bg-gold-dark text-charcoal font-bold px-6 py-3 rounded-none border border-gold hover:border-gold-dark transition-colors text-[10px] font-mono uppercase tracking-widest shrink-0 shadow relative z-10 cursor-pointer"
          >
            Claim 15% Discount
          </button>
        </div>
      )}

      {/* Grid of Tour Cards */}
      {filteredTours.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="tours-grid-container">
          {filteredTours.map((tour) => (
            <div key={tour.id} className="animate-fade-in" id={`tour-card-wrapper-${tour.id}`}>
              <TourCard
                tour={tour}
                isWishlisted={wishlist.includes(tour.id)}
                onWishlistToggle={() => onWishlistToggle(tour.id)}
                onBookClick={() => onBookClick(tour)}
                onSelect={() => onSelectTour(tour)}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-white border border-charcoal/10 rounded-none shadow-sm p-8" id="tours-empty-state">
          <div className="bg-stone-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-charcoal/5">
            <Filter className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">No Vienna Tours Match Your Filters</h3>
          <p className="text-gray-500 font-light text-sm max-w-md mx-auto mb-6">
            We couldn't find any excursions fitting your exact criteria. Try adjusting your price range, lowering the rating threshold, or searching with simpler keywords.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center space-x-2 bg-charcoal text-white px-5 py-2.5 rounded-none text-xs font-mono uppercase tracking-wider font-semibold border border-charcoal hover:bg-black transition-colors cursor-pointer"
          >
            <span>Show All Vienna Tours</span>
          </button>
        </div>
      )}

    </div>
  );
}
