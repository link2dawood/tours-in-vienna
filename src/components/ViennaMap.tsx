import { useState } from "react";
import { MapPin, Compass, Navigation, Info, Award, ShoppingBag } from "lucide-react";
import { Tour } from "../types";

interface ViennaMapProps {
  tours: Tour[];
  onSelectTour: (tour: Tour) => void;
  onBookTour: (tour: Tour) => void;
}

export default function ViennaMap({ tours, onSelectTour, onBookTour }: ViennaMapProps) {
  const [selectedPinId, setSelectedPinId] = useState<string | null>("vienna-classic");

  // Custom coordinate plots corresponding to coordinates inside tours data
  const mapMarkers = [
    { id: "vienna-classic", x: 440, y: 210, label: "St. Stephen's (Cathedral)" },
    { id: "schonbrunn-palace", x: 190, y: 380, label: "Schönbrunn Imperial Palace" },
    { id: "vienna-woods", x: 90, y: 130, label: "Vienna Woods & Wachau Valley" },
    { id: "mozart-concert", x: 510, y: 280, label: "Kursalon Music Hall" },
    { id: "danube-cruise", x: 560, y: 160, label: "Schwedenplatz Boat Dock" },
    { id: "vienna-food", x: 370, y: 330, label: "Naschmarkt Food Market" }
  ];

  const activeTour = tours.find(t => t.id === selectedPinId) || tours[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-ivory border-t border-gray-100" id="map-section">
      
      {/* Map Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold font-bold block mb-1">Explore Vienna Geographically</span>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Interactive Excursion Map</h2>
          <p className="text-gray-500 font-light text-sm max-w-xl mt-2">
            Click on our custom gold map markers below to locate our primary tour departure points, legendary historic districts, and scenic routes across Vienna.
          </p>
        </div>
        
        {/* Quick Legend */}
        <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-500 bg-white px-4 py-2.5 rounded-lg border border-gray-100 shadow-sm shrink-0">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 bg-blue-400 opacity-60 rounded-full block"></span>
            <span>Danube River</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 bg-emerald-100 rounded block border border-emerald-300"></span>
            <span>Vineyards & Parks</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 bg-imperial rounded-full block animate-ping"></span>
            <span>Live Tour Start Pin</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Canvas Map on Left, Selected Card Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: SVG Map Workspace */}
        <div className="lg:col-span-8 bg-stone-50 border border-gray-200 rounded-2xl shadow-inner relative overflow-hidden min-h-[400px] sm:min-h-[500px] flex items-center justify-center p-4">
          
          {/* Custom vector-based premium Vienna SVG map */}
          <svg 
            viewBox="0 0 800 500" 
            className="w-full h-full max-h-[480px] text-gray-300 font-sans"
            style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.05))" }}
          >
            {/* Background elements (Water & Green zones) */}
            
            {/* Soft Green Parks: Vienna Woods on left side */}
            <path d="M 0,0 L 150,0 Q 120,250 180,500 L 0,500 Z" fill="#E8F5E9" stroke="#C8E6C9" strokeWidth="1.5" />
            <text x="35" y="80" fill="#2E7D32" fontSize="12" fontFamily="monospace" letterSpacing="1" transform="rotate(-60 35 80)">VIENNA WOODS FOREST</text>
            
            {/* Ringstraße stylized inner road loop */}
            <path d="M 330,190 C 330,150 490,150 490,240 C 490,320 330,300 330,190 Z" fill="#FBF9F5" stroke="#E6DFD3" strokeWidth="4" strokeDasharray="6,3" />
            <text x="390" y="160" fill="#AA8B2C" fontSize="10" fontFamily="sans-serif" fontWeight="bold" letterSpacing="1">RINGSTRASSE</text>

            {/* Blue Ribbon representing Danube River */}
            <path 
              d="M 120,0 Q 300,120 480,0 T 800,160 L 800,210 Q 510,10 320,180 T 120,50 Z" 
              fill="url(#danubeGrad)" 
              opacity="0.25"
            />
            
            {/* Blue Line representing Danube Canal */}
            <path 
              d="M 320,130 Q 480,180 580,100 T 800,450" 
              fill="none" 
              stroke="#90CAF9" 
              strokeWidth="10" 
              strokeLinecap="round"
              opacity="0.6"
            />
            <text x="640" y="270" fill="#1565C0" fontSize="11" fontFamily="sans-serif" fontStyle="italic" transform="rotate(45 640 270)">DANUBE CANAL</text>

            {/* SVG Defs for river gradients */}
            <defs>
              <linearGradient id="danubeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#42A5F5" />
                <stop offset="100%" stopColor="#1565C0" />
              </linearGradient>
            </defs>

            {/* Landmarks Drawings (Icons/Text placeholders in map) */}
            
            {/* Danube River Label */}
            <text x="500" y="30" fill="#1565C0" fontSize="12" fontFamily="sans-serif" fontStyle="italic">Danube River (Donau)</text>

            {/* Schönbrunn Park drawing */}
            <rect x="140" y="350" width="100" height="70" rx="6" fill="#E8F5E9" stroke="#A5D6A7" strokeWidth="1" />
            <text x="150" y="410" fill="#388E3C" fontSize="10" fontWeight="bold">Schönbrunn Gardens</text>
            
            {/* Historic Core shaded bubble */}
            <circle cx="430" cy="220" r="45" fill="var(--color-gold)" opacity="0.1" />
            
            {/* SVG Map Lines connecting pins for premium flight itinerary aesthetic */}
            {selectedPinId && (
              <line 
                x1="440" y1="210" 
                x2={mapMarkers.find(m => m.id === selectedPinId)?.x || 440} 
                y2={mapMarkers.find(m => m.id === selectedPinId)?.y || 210} 
                stroke="var(--color-gold)" 
                strokeWidth="1.5" 
                strokeDasharray="4,4" 
                opacity="0.7"
              />
            )}

            {/* Interactive SVG Pin Renderings */}
            {mapMarkers.map((marker) => {
              const isSelected = selectedPinId === marker.id;
              return (
                <g 
                  key={marker.id} 
                  transform={`translate(${marker.x}, ${marker.y})`}
                  className="cursor-pointer group"
                  onClick={() => setSelectedPinId(marker.id)}
                  id={`map-pin-${marker.id}`}
                >
                  {/* Outer breathing pulse circle */}
                  <circle 
                    cx="0" 
                    cy="0" 
                    r={isSelected ? 16 : 8} 
                    className={isSelected ? "fill-imperial/20 stroke-imperial/40" : "fill-gold/20 group-hover:fill-imperial/10"} 
                    style={{ transition: "all 0.3s ease" }}
                  />
                  {/* Pin core drop-marker */}
                  <path 
                    d="M 0,0 C -6,-6 -10,-14 -10,-20 C -10,-26 -5,-30 0,-30 C 5,-30 10,-26 10,-20 C 10,-14 6,-6 0,0 Z" 
                    fill={isSelected ? "var(--color-charcoal)" : "var(--color-gold)"} 
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    style={{ transition: "all 0.3s ease" }}
                  />
                  {/* Small inner dot of pin */}
                  <circle cx="0" cy="-20" r="3.5" fill="#ffffff" />
                  
                  {/* Floating tooltip text */}
                  <rect 
                    x="-65" 
                    y="-50" 
                    width="130" 
                    height="18" 
                    rx="3" 
                    fill="#1A1A1A" 
                    opacity={isSelected ? "0.9" : "0"} 
                    style={{ transition: "all 0.2s ease", pointerEvents: "none" }}
                  />
                  <text 
                    x="0" 
                    y="-38" 
                    fill="#ffffff" 
                    fontSize="9" 
                    fontFamily="monospace" 
                    textAnchor="middle"
                    opacity={isSelected ? "1" : "0"}
                    style={{ transition: "all 0.2s ease", pointerEvents: "none" }}
                  >
                    {marker.label.substring(0, 20)}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map Controls instructions Overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-charcoal/80 text-white p-3 rounded-lg backdrop-blur border border-white/10 text-xs text-center flex items-center justify-center space-x-2 font-mono">
            <Navigation className="h-4 w-4 text-gold animate-bounce" />
            <span>Select any gold map pin to highlight details and departure logistics.</span>
          </div>
        </div>

        {/* Right Side: Selected Tour Interactive Card */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-white border border-gray-100 rounded-2xl shadow-xl p-6 relative">
          
          {/* Tag and Image */}
          <div>
            <div className="relative h-44 rounded-xl overflow-hidden mb-5 border border-gray-100">
              <img 
                src={activeTour.image} 
                alt={activeTour.title} 
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-imperial text-white text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded">
                {activeTour.category}
              </span>
              <span className="absolute bottom-3 right-3 bg-charcoal/70 text-gold text-xs font-mono font-semibold px-2 py-1 rounded backdrop-blur">
                €{activeTour.price} / traveler
              </span>
            </div>

            {/* Badges / Ratings */}
            <div className="flex items-center space-x-2 text-xs font-mono text-gold mb-2">
              <span className="bg-gold/10 text-gold-dark px-2 py-0.5 rounded font-bold">★ {activeTour.rating}</span>
              <span className="text-gray-400">({activeTour.reviewsCount} verified reviews)</span>
            </div>

            {/* Tour Title */}
            <h3 className="font-serif text-xl font-bold text-gray-900 leading-tight mb-2">
              {activeTour.title}
            </h3>

            {/* Highlights bullet */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2 mb-4">
              <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block border-b pb-1">Geographic Departure Details:</span>
              <div className="text-xs text-gray-700 space-y-1 font-sans">
                <p><strong>Meet point:</strong> {activeTour.startPoint}</p>
                <p className="mt-2 text-gray-500 font-light">Duration: <strong>{activeTour.duration}</strong> | Group limit: <strong>{activeTour.groupSize}</strong></p>
              </div>
            </div>

            <p className="text-gray-500 text-xs font-light leading-relaxed line-clamp-3">
              {activeTour.longDescription}
            </p>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-100 mt-6">
            <button
              id={`map-tour-more-btn-${activeTour.id}`}
              onClick={() => onSelectTour(activeTour)}
              className="inline-flex items-center justify-center space-x-1 border border-gray-200 hover:border-imperial/30 hover:text-imperial rounded-lg py-3 text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer"
            >
              <Info className="h-4 w-4" />
              <span>Full Details</span>
            </button>
            
            <button
              id={`map-tour-book-btn-${activeTour.id}`}
              onClick={() => onBookTour(activeTour)}
              className="inline-flex items-center justify-center bg-imperial hover:bg-imperial-dark text-white border border-gold/20 hover:border-gold/50 rounded-lg py-3 text-xs font-mono uppercase tracking-wider font-semibold shadow transition-colors cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4 text-gold mr-1" />
              <span>Book Ticket</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
