import { useState, MouseEvent } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, Image as ImageIcon } from "lucide-react";

export default function PhotoGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1200&q=80",
      title: "Hofburg Palace at Sunset",
      tag: "palaces",
      desc: "The sprawling former principal imperial palace of the Habsburg dynasty in the center of Vienna."
    },
    {
      url: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=1200&q=80",
      title: "Schönbrunn Palace Gardens",
      tag: "palaces",
      desc: "The glorious baroque palace gardens containing symmetrical flower tunnels and the Neptune Fountain."
    },
    {
      url: "https://images.unsplash.com/photo-1541343072885-9be562d6ec0f?auto=format&fit=crop&w=1200&q=80",
      title: "St. Stephen's Cathedral Spire",
      tag: "sightseeing",
      desc: "Gothic display architecture showcasing the multi-colored tile roofs of the symbol of Vienna."
    },
    {
      url: "/vienna-opera-hall.png",
      title: "Vienna State Opera Hall",
      tag: "culture",
      desc: "One of the most acclaimed opera venues globally, host of the historic annual Vienna Opera Ball."
    },
    {
      url: "/vienna-coffee-culture.png",
      title: "Classic Vienna Coffee Protocol",
      tag: "culture",
      desc: "Indulging in a traditional Wiener Melange espresso accompanied by a slice of decadent Sachertorte chocolate cake."
    },
    {
      url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80",
      title: "Scenic Danube Cruise Sunset",
      tag: "sightseeing",
      desc: "Breathtaking views of Vienna's skyline reflected on the blue ribbon waters of the Danube river."
    },
    {
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      title: "Belvedere Palace Water Reflections",
      tag: "palaces",
      desc: "Baroque palace complex containing Gustav Klimt's legendary painting 'The Kiss'."
    },
    {
      url: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1200&q=80",
      title: "Prater Amusement Park Ferris Wheel",
      tag: "sightseeing",
      desc: "The Wiener Riesenrad giant Ferris wheel, standing sentinel at the entrance of the Prater woods since 1897."
    }
  ];

  const tags = [
    { value: "all", label: "All Photos" },
    { value: "palaces", label: "Imperial Palaces" },
    { value: "sightseeing", label: "Scenic Sights" },
    { value: "culture", label: "Arts & Culture" }
  ];

  const filteredImages = galleryImages.filter(img => selectedTag === "all" || img.tag === selectedTag);

  const handlePrev = (e: MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === 0 ? filteredImages.length - 1 : lightboxIndex - 1);
  };

  const handleNext = (e: MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === filteredImages.length - 1 ? 0 : lightboxIndex + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-ivory border-t border-b border-charcoal/10" id="gallery-section">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-gold font-bold block mb-1">Scenic Travel Galleries</span>
        <h2 className="text-3xl font-serif font-black text-charcoal mb-4 tracking-tight">Vienna Postcard Galleries</h2>
        <p className="text-gray-500 font-light text-sm sm:text-base">
          Browse our high-contrast, professional travel photo collections. Click any photo to launch the interactive high-definition lightbox viewer.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {tags.map((tag) => (
          <button
            key={tag.value}
            id={`gallery-tag-${tag.value}`}
            onClick={() => setSelectedTag(tag.value)}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold border transition-all cursor-pointer rounded-none ${
              selectedTag === tag.value
                ? "bg-charcoal text-white border-charcoal shadow-sm"
                : "bg-white text-gray-500 hover:bg-stone-50 border-charcoal/10 hover:border-charcoal/30"
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* Masonry Responsive Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-4 gap-6 space-y-6" id="gallery-grid-container">
        {filteredImages.map((img, index) => (
          <div 
            key={index}
            id={`gallery-item-${index}`}
            onClick={() => setLightboxIndex(index)}
            className="break-inside-avoid bg-stone-50 border border-charcoal/10 overflow-hidden hover:shadow-xl hover:border-gold group relative cursor-pointer transition-all duration-300 rounded-none"
          >
            <img 
              src={img.url} 
              alt={img.title} 
              className="w-full object-cover transform group-hover:scale-102 transition-transform duration-300 rounded-none"
              loading="lazy"
            />
            {/* Hover overlay details */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
              <span className="text-gold text-[9px] font-mono uppercase tracking-wider mb-1 flex items-center space-x-1">
                <ZoomIn className="h-3 w-3" />
                <span>Launch Lightbox</span>
              </span>
              <h4 className="font-serif font-bold text-sm leading-tight">{img.title}</h4>
              <p className="text-[10px] text-gray-300 font-light mt-1 line-clamp-2">{img.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Overlay Modal */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between items-center py-6 px-4 animate-fade-in text-white"
          onClick={() => setLightboxIndex(null)}
          id="lightbox-overlay-modal"
        >
          {/* Header Controls */}
          <div className="w-full max-w-7xl flex justify-between items-center text-xs font-mono text-gray-400 shrink-0">
            <span className="flex items-center space-x-1.5 text-white">
              <ImageIcon className="h-4 w-4 text-gold" />
              <span>Vienna Slide {lightboxIndex + 1} of {filteredImages.length}</span>
            </span>
            <button 
              onClick={() => setLightboxIndex(null)}
              className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full cursor-pointer transition-colors"
              title="Close Lightbox"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Lightbox Center Content with Arrows */}
          <div className="relative flex-grow flex items-center justify-center w-full max-w-5xl my-4">
            
            {/* Left Button */}
            <button 
              onClick={handlePrev}
              className="absolute left-2 md:left-4 z-10 bg-black/50 hover:bg-black/80 border border-white/20 p-3 rounded-full text-white cursor-pointer transition-colors hover:scale-105"
              title="Previous Photo"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Expanded Image */}
            <img 
              src={filteredImages[lightboxIndex].url} 
              alt="" 
              className="max-w-full max-h-[70vh] object-contain rounded-lg border border-white/10 shadow-2xl animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Right Button */}
            <button 
              onClick={handleNext}
              className="absolute right-2 md:right-4 z-10 bg-black/50 hover:bg-black/80 border border-white/20 p-3 rounded-full text-white cursor-pointer transition-colors hover:scale-105"
              title="Next Photo"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

          </div>

          {/* Bottom Captions */}
          <div 
            className="w-full max-w-xl text-center space-y-1.5 shrink-0 bg-black/60 p-4 rounded-xl border border-white/10 backdrop-blur"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-serif text-lg font-bold text-gold">{filteredImages[lightboxIndex].title}</h4>
            <p className="text-xs text-gray-300 font-light leading-relaxed">{filteredImages[lightboxIndex].desc}</p>
          </div>

        </div>
      )}

    </div>
  );
}
