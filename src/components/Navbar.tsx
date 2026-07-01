import { useState } from "react";
import { Compass, Heart, Menu, X, Bell, User, LayoutDashboard, LogOut } from "lucide-react";
import { UserProfile } from "../types";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  wishlistCount: number;
  user: UserProfile | null;
  onAuthClick: () => void;
  onLogout: () => void;
  onOpenNotifications: () => void;
  unreadNotifications: number;
  onOpenAdmin: () => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  wishlistCount,
  user,
  onAuthClick,
  onLogout,
  onOpenNotifications,
  unreadNotifications,
  onOpenAdmin
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "tours", label: "Our Tours" },
    { id: "map", label: "Interactive Map" },
    { id: "gallery", label: "Photo Gallery" },
    { id: "blog", label: "Travel Blog" },
    { id: "contact", label: "Contact Us" }
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-ivory text-charcoal border-b border-charcoal/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Section */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavClick("tours")}
            id="nav-logo-container"
          >
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center border border-charcoal/15 shadow-sm group-hover:bg-gold-dark transition-all duration-300">
              <Compass className="h-5 w-5 text-white animate-spin-slow" />
            </div>
            <div>
              <span className="font-serif text-lg tracking-tighter font-bold uppercase italic text-charcoal block">
                TOURS IN VIENNA
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-mono block -mt-1 font-bold">
                Travel Agency &bull; 5.0 ★ Google
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-md text-xs uppercase tracking-wider font-semibold transition-colors duration-300 cursor-pointer ${
                  currentTab === item.id
                    ? "text-gold bg-charcoal/5 font-bold"
                    : "text-gray-600 hover:text-charcoal hover:bg-charcoal/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Icon & Profile Operations */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Wishlist Button */}
            <button 
              id="nav-wishlist-btn"
              onClick={() => handleNavClick("tours")} // Shows catalog and triggers filter, or user clicks to wishlist in profile
              className="relative p-2 text-gray-500 hover:text-gold hover:bg-charcoal/5 rounded-full transition-colors duration-300 cursor-pointer"
              title="View Wishlist"
            >
              <Heart className={`h-5 w-5 ${wishlistCount > 0 ? "fill-gold text-gold" : ""}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-charcoal text-white font-mono text-[9px] w-5 h-5 flex items-center justify-center rounded-full border border-gold/50 shadow">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <button 
              id="nav-notifications-btn"
              onClick={onOpenNotifications}
              className="relative p-2 text-gray-500 hover:text-gold hover:bg-charcoal/5 rounded-full transition-colors duration-300 cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[9px] w-5 h-5 flex items-center justify-center rounded-full animate-pulse shadow">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Admin Console Access */}
            <button 
              id="nav-admin-btn"
              onClick={onOpenAdmin}
              className="p-2 text-gray-500 hover:text-gold hover:bg-charcoal/5 rounded-full transition-colors duration-300 cursor-pointer"
              title="Admin Dashboard & Mailbox"
            >
              <LayoutDashboard className="h-5 w-5" />
            </button>

            {/* User Auth Section */}
            {user ? (
              <div className="flex items-center space-x-3 border-l border-charcoal/10 pl-4">
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block font-mono">Willkommen,</span>
                  <span className="text-xs font-bold text-gold block truncate max-w-[120px]">{user.fullName}</span>
                </div>
                <div className="relative group">
                  <button className="flex items-center focus:outline-none cursor-pointer">
                    <img 
                      src={user.avatar} 
                      alt="User Avatar" 
                      className="h-9 w-9 rounded-full border border-gold object-cover shadow"
                    />
                  </button>
                  {/* Dropdown on hover */}
                  <div className="absolute right-0 mt-2 w-48 bg-ivory border border-charcoal/15 rounded-lg shadow-xl py-1 hidden group-hover:block z-50 animate-fade-in">
                    <button
                      onClick={() => handleNavClick("profile")}
                      className="w-full text-left px-4 py-2 text-xs uppercase tracking-wider font-semibold text-gray-700 hover:bg-charcoal/5 hover:text-gold flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-xs uppercase tracking-wider font-semibold text-red-500 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                id="nav-login-btn"
                onClick={onAuthClick}
                className="inline-flex items-center space-x-2 bg-charcoal hover:bg-black text-white px-4 py-2.5 border border-charcoal/10 transition-all duration-300 text-xs font-bold uppercase tracking-tighter shadow-sm cursor-pointer"
              >
                <User className="h-4 w-4 text-gold" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Buttons */}
          <div className="md:hidden flex items-center space-x-3">
            <button 
              onClick={onOpenNotifications}
              className="relative p-2 text-gray-500 hover:text-gold"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white font-mono text-[8px] w-4 h-4 flex items-center justify-center rounded-full">
                  {unreadNotifications}
                </span>
              )}
            </button>
            <button 
              onClick={onOpenAdmin}
              className="p-2 text-gray-500 hover:text-gold"
            >
              <LayoutDashboard className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-charcoal hover:bg-charcoal/5 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ivory border-t border-charcoal/10 px-2 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left block px-4 py-2.5 rounded-md text-sm font-semibold uppercase tracking-wider transition-colors ${
                currentTab === item.id
                  ? "text-gold bg-charcoal/5 font-bold"
                  : "text-gray-600 hover:text-charcoal hover:bg-charcoal/5"
              }`}
            >
              {item.label}
            </button>
          ))}
          
          <div className="pt-4 border-t border-charcoal/10 px-4 space-y-3">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <img src={user.avatar} className="h-9 w-9 rounded-full border border-gold" alt="" />
                  <div>
                    <span className="text-sm font-medium text-charcoal block">{user.fullName}</span>
                    <span className="text-xs text-gray-400 block truncate">{user.email}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => handleNavClick("profile")}
                    className="text-center py-2 rounded bg-charcoal/5 text-xs uppercase tracking-wider font-semibold text-gold hover:bg-charcoal/10"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={onLogout}
                    className="text-center py-2 rounded bg-red-50 text-xs uppercase tracking-wider font-semibold text-red-600 hover:bg-red-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onAuthClick();
                }}
                className="w-full flex items-center justify-center space-x-2 bg-charcoal text-white px-4 py-2.5 border border-charcoal/10 text-xs font-bold uppercase tracking-tighter hover:bg-black transition-colors"
              >
                <User className="h-4 w-4 text-gold" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
