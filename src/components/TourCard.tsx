import { useState } from "react";
import { Star, Clock, Users, Heart, MapPin, Check, Info } from "lucide-react";
import { Tour } from "../types";

interface TourCardProps {
  tour: Tour;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  onBookClick: () => void;
  onSelect: () => void;
}

export default function TourCard({
  tour,
  isWishlisted,
  onWishlistToggle,
  onBookClick,
  onSelect
}: TourCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="bg-white border border-charcoal/10 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group rounded-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image & Badges Container */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={tour.image} 
          alt={tour.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category Overlay */}
        <span className="absolute top-4 left-4 bg-charcoal text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-1">
          {tour.category}
        </span>

        {/* Wishlist button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle();
          }}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur text-charcoal p-2 rounded-full hover:bg-white hover:text-red-500 shadow-md transition-colors cursor-pointer border border-charcoal/5"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
        </button>

        {/* Duration Overlay in bottom right */}
        <div className="absolute bottom-4 right-4 bg-white border border-charcoal/10 text-charcoal text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 flex items-center space-x-1 shadow-sm">
          <Clock className="h-3 w-3 text-gold" />
          <span>{tour.duration}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow">
        
        {/* Review rating and Title */}
        <div className="flex items-center space-x-1 text-gold text-sm font-mono font-semibold mb-2">
          <Star className="h-4 w-4 fill-gold text-gold" />
          <span>{tour.rating.toFixed(1)}</span>
          <span className="text-gray-400 font-light font-sans text-xs">({tour.reviewsCount} reviews)</span>
        </div>

        <h3 className="font-serif text-xl font-bold text-gray-900 group-hover:text-gold transition-colors duration-300 leading-tight mb-2">
          {tour.title}
        </h3>

        <p className="text-gray-500 text-sm font-light leading-relaxed mb-4 line-clamp-2">
          {tour.description}
        </p>

        {/* Key highlights bullets */}
        <div className="space-y-1.5 mb-5 mt-auto">
          {tour.highlights.slice(0, 3).map((hl, i) => (
            <div key={i} className="flex items-start space-x-2 text-xs text-gray-700">
              <Check className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
              <span className="truncate">{hl}</span>
            </div>
          ))}
        </div>

        {/* Tour Metadata Row */}
        <div className="grid grid-cols-2 gap-2 py-3 border-t border-b border-gray-100 text-xs text-gray-500 font-mono mb-6">
          <div className="flex items-center space-x-1.5">
            <Users className="h-3.5 w-3.5 text-gold" />
            <span>{tour.groupSize}</span>
          </div>
          <div className="flex items-center space-x-1.5 truncate">
            <MapPin className="h-3.5 w-3.5 text-gold" />
            <span className="truncate" title={tour.startPoint}>{tour.startPoint.split("(")[0]}</span>
          </div>
        </div>

        {/* Bottom Booking & Pricing */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-gray-400 text-[9px] block uppercase tracking-wider font-mono">Tours from</span>
            <span className="text-2xl font-serif font-black text-charcoal">
              €{tour.price}
              <span className="text-xs font-light text-gray-500 font-sans"> / person</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Info / Learn More */}
            <button 
              onClick={onSelect}
              className="p-3 border border-charcoal/10 text-gray-500 hover:text-charcoal hover:border-charcoal hover:bg-stone-50 transition-all cursor-pointer"
              title="View Tour Details"
            >
              <Info className="h-4 w-4" />
            </button>

            {/* Book Now */}
            <button 
              onClick={onBookClick}
              className="bg-charcoal hover:bg-black text-white px-5 py-3 border border-charcoal transition-all text-[10px] font-bold uppercase tracking-widest cursor-pointer"
            >
              Book Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
