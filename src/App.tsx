import { useState, useEffect } from "react";
import { 
  Compass, Heart, Star, Clock, Users, MapPin, Check, 
  Info, ArrowRight, ShieldCheck, Ticket, Calendar, Phone, Mail, Award, X, Sparkles
} from "lucide-react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TourCatalog from "./components/TourCatalog";
import ViennaMap from "./components/ViennaMap";
import ReviewsList from "./components/ReviewsList";
import BlogGrid from "./components/BlogGrid";
import PhotoGallery from "./components/PhotoGallery";
import ContactForm from "./components/ContactForm";
import AdminConsole from "./components/AdminConsole";
import AuthModal from "./components/AuthModal";
import BookingModal from "./components/BookingModal";
import NotificationCenter from "./components/NotificationCenter";

import { Tour, BlogPost, Review, Booking, ContactInquiry, UserProfile, BlogComment } from "./types";

export default function App() {
  // Navigation & UI Triggers
  const [currentTab, setCurrentTab] = useState<string>("tours");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Server Data States
  const [tours, setTours] = useState<Tour[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);

  // User Auth & Modal states
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isNotificationAllowed, setIsNotificationAllowed] = useState<boolean>(true);
  const [unreadCount, setUnreadCount] = useState<number>(1);

  // Active Interactive Overlays
  const [selectedTourDetail, setSelectedTourDetail] = useState<Tour | null>(null);
  const [activeBookingTour, setActiveBookingTour] = useState<Tour | null>(null);

  // Toast System for Push Notifications Simulation
  const [activeToast, setActiveToast] = useState<{ title: string; body: string } | null>(null);

  // Fetch initial seed data from backend on boot
  useEffect(() => {
    const loadData = async () => {
      try {
        const [toursRes, blogRes, reviewsRes, bookingsRes, inquiriesRes] = await Promise.all([
          fetch("/api/tours"),
          fetch("/api/blog"),
          fetch("/api/reviews"),
          fetch("/api/bookings"),
          fetch("/api/inquiries")
        ]);

        if (toursRes.ok) setTours(await toursRes.json());
        if (blogRes.ok) setBlogs(await blogRes.json());
        if (reviewsRes.ok) setReviews(await reviewsRes.json());
        if (bookingsRes.ok) setBookings(await bookingsRes.json());
        if (inquiriesRes.ok) setInquiries(await inquiriesRes.json());
      } catch (err) {
        console.error("Critical error fetching system database:", err);
      }
    };

    loadData();

    // Setup periodic push alert simulation
    const timers = [
      setTimeout(() => {
        triggerToastAlert(
          "🎫 Imperial Palace Flash Sale!",
          "Use coupon code VIENNA15 inside checkout for 15% off Schönbrunn Palace!"
        );
      }, 8000),
      setTimeout(() => {
        triggerToastAlert(
          "🚩 Classic Walk Advisory",
          "St. Stephen's Gothic Walk guide is arriving at the South Spire shortly. Look for the burgundy sash."
        );
      }, 35000)
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const triggerToastAlert = (title: string, body: string) => {
    setUnreadCount((prev) => prev + 1);
    setActiveToast({ title, body });
    setTimeout(() => setActiveToast(null), 6500);
  };

  // Wishlist toggle
  const handleWishlistToggle = (tourId: string) => {
    setWishlist((prev) => 
      prev.includes(tourId) ? prev.filter(id => id !== tourId) : [...prev, tourId]
    );
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    // Auto increment reviews / analytics or pull fresh bookings
    fetch("/api/bookings")
      .then(res => res.json())
      .then(data => setBookings(data));
  };

  const handleNewReviewAdded = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
    // Refresh tours to get updated ratings calculations
    fetch("/api/tours")
      .then(res => res.json())
      .then(data => setTours(data));
  };

  const handleNewInquiryAdded = (newInquiry: ContactInquiry) => {
    setInquiries((prev) => [newInquiry, ...prev]);
  };

  const handleNewCommentAdded = (blogId: string, newComment: BlogComment) => {
    setBlogs((prev) => prev.map(b => {
      if (b.id === blogId) {
        return {
          ...b,
          comments: [...b.comments, newComment]
        };
      }
      return b;
    }));
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-between selection:bg-gold/30 selection:text-imperial relative" id="applet-root">
      
      {/* Floating Push Notification Toast Alert */}
      {activeToast && (
        <div 
          className="fixed top-24 right-6 z-50 bg-charcoal border-2 border-gold text-white p-4 rounded-xl shadow-2xl max-w-sm flex items-start space-x-3 animate-slide-in"
          id="push-toast-alert"
        >
          <div className="bg-imperial text-gold p-2 rounded-lg border border-gold/30 shrink-0">
            👨‍✈️
          </div>
          <div className="space-y-1">
            <strong className="text-xs font-serif text-gold block">{activeToast.title}</strong>
            <p className="text-[11px] text-gray-300 leading-snug">{activeToast.body}</p>
          </div>
          <button 
            onClick={() => setActiveToast(null)}
            className="text-gray-400 hover:text-white shrink-0 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Navigation Menu */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          // Jump to top on menu shifts
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        wishlistCount={wishlist.length}
        user={user}
        onAuthClick={() => setIsAuthOpen(true)}
        onLogout={() => setUser(null)}
        onOpenNotifications={() => {
          setIsNotificationsOpen(true);
          setUnreadCount(0);
        }}
        unreadNotifications={unreadCount}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Active Workspaces & Sub-screens Router */}
      <main className="flex-grow">
        
        {/* TOURS TAB */}
        {currentTab === "tours" && (
          <div className="space-y-4 animate-fade-in" id="tours-workspace">
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onExploreClick={() => {
                document.getElementById("tours-catalog")?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <TourCatalog
              tours={tours}
              wishlist={wishlist}
              onWishlistToggle={handleWishlistToggle}
              onBookClick={(tour) => setActiveBookingTour(tour)}
              onSelectTour={(tour) => setSelectedTourDetail(tour)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        )}

        {/* INTERACTIVE MAP VIEW */}
        {currentTab === "map" && (
          <div className="space-y-4 animate-fade-in" id="map-workspace">
            {/* Direct access to Vienna Map */}
            <ViennaMap
              tours={tours}
              onSelectTour={(tour) => setSelectedTourDetail(tour)}
              onBookTour={(tour) => setActiveBookingTour(tour)}
            />
          </div>
        )}

        {/* PHOTO GALLERY */}
        {currentTab === "gallery" && (
          <div className="animate-fade-in" id="gallery-workspace">
            <PhotoGallery />
          </div>
        )}

        {/* TRAVEL BLOG */}
        {currentTab === "blog" && (
          <div className="animate-fade-in" id="blog-workspace">
            <BlogGrid 
              blogs={blogs} 
              onNewCommentAdded={handleNewCommentAdded}
            />
          </div>
        )}

        {/* CONTACT PAGE */}
        {currentTab === "contact" && (
          <div className="animate-fade-in" id="contact-workspace">
            <ContactForm onNewInquiryAdded={handleNewInquiryAdded} />
          </div>
        )}

        {/* PROFILE WORKSPACE (Wishlist details) */}
        {currentTab === "profile" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in" id="profile-workspace">
            {user ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="bg-charcoal text-white p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 border-b border-gold/20">
                  <img src={user.avatar} className="h-16 w-16 rounded-full border-2 border-gold object-cover shadow" alt="" />
                  <div className="text-center sm:text-left">
                    <h2 className="font-serif text-2xl font-bold text-white">{user.fullName}</h2>
                    <p className="text-xs text-gold font-mono uppercase tracking-wider mt-0.5">Premium Club Traveler &bull; ID: {user.uid}</p>
                  </div>
                </div>

                <div className="p-6 space-y-8">
                  {/* Wishlisted tours list */}
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg font-bold text-gray-900 border-b pb-2">My Saved Experiences Wishlist ({wishlist.length})</h3>
                    {wishlist.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {tours.filter(t => wishlist.includes(t.id)).map(tour => (
                          <div key={tour.id} className="border rounded-xl p-4 shadow-sm bg-stone-50 flex space-x-3 items-center justify-between">
                            <div className="flex items-center space-x-3 truncate">
                              <img src={tour.image} alt="" className="h-12 w-12 object-cover rounded-md shrink-0 border" />
                              <div className="truncate">
                                <strong className="text-xs text-gray-900 block truncate font-sans">{tour.title}</strong>
                                <span className="text-[10px] text-imperial font-mono">€{tour.price} &bull; {tour.duration}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleWishlistToggle(tour.id)}
                              className="text-red-500 hover:text-red-700 shrink-0 p-1 cursor-pointer"
                              title="Remove"
                            >
                              <Heart className="h-4 w-4 fill-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400 font-mono text-xs">
                        Your saved tours wishlist is empty. Tap hearts on tour cards to build your custom itinerary!
                      </div>
                    )}
                  </div>

                  {/* Booking history */}
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg font-bold text-gray-900 border-b pb-2">My Simulated Excursions Ledger ({bookings.filter(b => b.email === user.email).length})</h3>
                    {bookings.filter(b => b.email === user.email).length > 0 ? (
                      <div className="space-y-3">
                        {bookings.filter(b => b.email === user.email).map(b => (
                          <div key={b.id} className="border rounded-xl p-4 bg-emerald-50/40 border-emerald-100 flex justify-between items-center text-xs font-mono">
                            <div>
                              <strong className="text-gray-900 font-sans block text-sm">{b.tourTitle}</strong>
                              <span className="text-gray-500">Scheduled: {b.bookingDate} @ {b.bookingTime} &bull; {b.guests} guests</span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-emerald-700 font-bold block">€{b.totalAmount.toFixed(2)}</span>
                              <span className="text-[9px] text-emerald-600 block">✓ SSL PAID</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400 font-mono text-xs">
                        You haven't made any bookings under {user.email} yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border p-8 shadow-xl max-w-md mx-auto">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">Sign In Required</h3>
                <p className="text-gray-500 text-xs font-mono uppercase tracking-wider mb-6">Access Personal Traveler Profile Ledger</p>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="bg-imperial text-white px-6 py-3 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold border border-gold/30 hover:bg-imperial-dark transition-colors cursor-pointer shadow-md"
                >
                  Sign In / Access Console
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* DETAILED VIEW MODAL: Selected Tour Info */}
      {selectedTourDetail && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          id="tour-detail-modal"
        >
          <div className="bg-ivory border border-gold/30 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh] animate-scale-up">
            
            {/* Header image banner */}
            <div className="relative h-64 sm:h-72 border-b shrink-0">
              <img src={selectedTourDetail.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Close */}
              <button 
                onClick={() => setSelectedTourDetail(null)}
                className="absolute top-4 right-4 bg-charcoal/80 hover:bg-black text-white p-2 rounded-full cursor-pointer transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute bottom-5 left-6 right-6 text-white space-y-1">
                <span className="bg-imperial text-white text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-gold/30">
                  {selectedTourDetail.category}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">{selectedTourDetail.title}</h3>
              </div>
            </div>

            {/* Scrollable details */}
            <div className="p-6 overflow-y-auto flex-grow space-y-6">
              
              {/* Key Quick Facts row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-stone-50 p-4 rounded-xl border border-gray-100 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block">Duration</span>
                  <strong className="text-gray-800 text-sm block mt-0.5">{selectedTourDetail.duration}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block">Group Limit</span>
                  <strong className="text-gray-800 text-sm block mt-0.5">{selectedTourDetail.groupSize}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block">Departing</span>
                  <strong className="text-gray-800 text-sm block mt-0.5 truncate" title={selectedTourDetail.startPoint}>
                    {selectedTourDetail.startPoint.split("(")[0]}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block">Rating score</span>
                  <strong className="text-gold-dark text-sm block mt-0.5">★ {selectedTourDetail.rating}</strong>
                </div>
              </div>

              {/* Long Description and highlights */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Long copy */}
                <div className="md:col-span-8 space-y-3 font-light text-gray-600 text-sm sm:text-base leading-relaxed">
                  <h4 className="font-serif text-lg font-bold text-gray-900">Excursion Narrative</h4>
                  <p className="whitespace-pre-wrap">{selectedTourDetail.longDescription}</p>
                </div>

                {/* Bullets lists */}
                <div className="md:col-span-4 bg-stone-50 p-4 border rounded-xl space-y-3">
                  <h5 className="font-serif text-sm font-bold text-gray-900 border-b pb-1.5 uppercase tracking-wider text-xs">Highlights</h5>
                  <div className="space-y-2">
                    {selectedTourDetail.highlights.map((hl, i) => (
                      <div key={i} className="flex items-start space-x-1.5 text-xs text-gray-700 font-light leading-normal">
                        <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Specific Tour Reviews Filter render list */}
              <div className="border-t pt-6">
                <ReviewsList
                  reviews={reviews}
                  tours={tours}
                  activeTourId={selectedTourDetail.id}
                  onNewReviewAdded={handleNewReviewAdded}
                />
              </div>

            </div>

            {/* Bottom booking trigger drawer */}
            <div className="p-4 bg-stone-50 border-t border-charcoal/10 flex justify-between items-center shrink-0">
              <div>
                <span className="text-[10px] text-gray-400 font-mono block uppercase">Securable ticket:</span>
                <span className="text-xl font-serif font-black text-charcoal">€{selectedTourDetail.price} <span className="text-xs text-gray-500 font-sans font-light">/ traveler</span></span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedTourDetail(null)}
                  className="bg-white hover:bg-stone-50 border border-charcoal/10 px-4 py-2 rounded-none text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const chosen = selectedTourDetail;
                    setSelectedTourDetail(null);
                    setActiveBookingTour(chosen);
                  }}
                  className="bg-charcoal hover:bg-black text-white border border-charcoal px-5 py-2 rounded-none text-xs font-mono uppercase tracking-widest font-bold cursor-pointer"
                >
                  Configure Tickets
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* GLOBAL FOOTER */}
      <footer className="bg-[#111111] text-white border-t border-charcoal/20 pt-12 pb-6 shrink-0 font-sans" id="applet-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-sm text-gray-400">
          
          {/* Logo & Crown */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3 text-white">
              <div className="bg-gold p-2 rounded-full border border-white/10">
                <Compass className="h-5 w-5 text-white animate-spin-slow" />
              </div>
              <div>
                <span className="font-serif text-lg tracking-tighter font-bold uppercase italic text-white block">TOURS IN VIENNA</span>
                <span className="text-[9px] uppercase tracking-widest text-gold font-mono block -mt-1 font-bold">Verified 5.01★ Google Service</span>
              </div>
            </div>
            <p className="text-xs font-light leading-relaxed max-w-sm">
              We guide global travelers through Maria Theresa's palaces, gothic alleys, romantic vineyards, and classical music waltz halls. Licensed by the Austrian Federal Ministry of Tourism.
            </p>
            <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
              Hotline: +43 664 4126911 &bull; Schlettergasse 3/9/10, 1220 Wien
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif text-white font-semibold uppercase text-xs tracking-wider">Vienna Excursions</h4>
            <div className="flex flex-col space-y-1.5 text-xs font-light">
              <button onClick={() => { setCurrentTab("tours"); setSearchQuery("Palace"); }} className="text-left hover:text-gold transition-colors cursor-pointer">Schönbrunn Palace Explorer</button>
              <button onClick={() => { setCurrentTab("tours"); setSearchQuery("Woods"); }} className="text-left hover:text-gold transition-colors cursor-pointer">Vienna Woods Day Coach</button>
              <button onClick={() => { setCurrentTab("tours"); setSearchQuery("Concert"); }} className="text-left hover:text-gold transition-colors cursor-pointer">Kursalon Music Waltz Concert</button>
              <button onClick={() => { setCurrentTab("tours"); setSearchQuery("Food"); }} className="text-left hover:text-gold transition-colors cursor-pointer">Naschmarkt Culinary Tasting</button>
            </div>
          </div>

          {/* Security details */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif text-white font-semibold uppercase text-xs tracking-wider">Secured Operations</h4>
            <p className="text-xs font-light leading-relaxed">
              Our payments process directly through simulated 128-bit SSL tokenization. Client email auto-replies deploy dynamically.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 flex items-center space-x-2 text-[10px] font-mono text-emerald-500">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>SSL SHA-256 ENCRYPTED TRANSACTION FLOW</span>
            </div>
          </div>

        </div>

        {/* Legal copyright bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between text-[10px] font-mono text-gray-500">
          <span>&copy; {new Date().getFullYear()} TOURS IN VIENNA. All rights reserved.</span>
          <span className="mt-2 sm:mt-0">Licensed Tour Operator ID: #WIE-5012-AUT</span>
        </div>
      </footer>

      {/* MODAL CHECKOUT FLOW PANELS */}
      <BookingModal
        tour={activeBookingTour}
        isOpen={activeBookingTour !== null}
        onClose={() => setActiveBookingTour(null)}
        onBookingSuccess={handleBookingSuccess}
      />

      <AdminConsole
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        bookings={bookings}
        inquiries={inquiries}
        reviews={reviews}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(loggedInUser) => setUser(loggedInUser)}
      />

      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        isAllowed={isNotificationAllowed}
        onNotificationAllowed={(allowed) => setIsNotificationAllowed(allowed)}
      />

    </div>
  );
}
