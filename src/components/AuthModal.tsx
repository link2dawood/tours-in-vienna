import { useState, FormEvent } from "react";
import { X, Mail, Lock, User, Sparkles, LogIn } from "lucide-react";
import { UserProfile } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password || (isSignUp && !fullName)) {
      setErrorMsg("Please complete all required credentials.");
      return;
    }

    // Simulate Auth validation & generate mock User Profile
    const finalName = isSignUp ? fullName : email.split("@")[0].toUpperCase();
    const initials = finalName.substring(0, 2).toUpperCase();

    const mockProfile: UserProfile = {
      uid: "usr-" + Math.random().toString().substring(2, 8),
      email: email,
      fullName: finalName,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${initials}`,
      role: "tourist",
      wishlist: [],
      bookingsHistory: []
    };

    onLoginSuccess(mockProfile);
    onClose();
  };

  const handleSocialLogin = (provider: string) => {
    // Generate lovely profile for social log in
    const mockProfile: UserProfile = {
      uid: "usr-social-" + Math.random().toString().substring(2, 8),
      email: `traveler.${provider}@gmail.com`,
      fullName: `Viennese Traveler (${provider})`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${provider}`,
      role: "tourist",
      wishlist: [],
      bookingsHistory: []
    };
    onLoginSuccess(mockProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white border border-gold/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-scale-up" id="auth-modal-container">
        
        {/* Banner header image */}
        <div className="bg-charcoal text-white p-6 border-b border-gold/20 relative overflow-hidden text-center shrink-0">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=600&q=50" 
              alt="" 
              className="w-full h-full object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent"></div>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="relative z-10 space-y-1">
            <span className="font-serif text-lg font-bold tracking-widest text-gold block">TOURS IN VIENNA</span>
            <p className="text-[10px] uppercase tracking-widest text-gray-300 font-mono">Unlock Personal Itinerary Syncing &bull; 15% off</p>
          </div>
        </div>

        {/* Auth Body */}
        <div className="p-6 space-y-5">
          {/* Tabs header */}
          <div className="grid grid-cols-2 gap-2 border-b pb-4 text-xs font-mono uppercase tracking-wider font-semibold text-center text-gray-400">
            <button
              onClick={() => { setIsSignUp(false); setErrorMsg(""); }}
              className={`pb-2 border-b-2 cursor-pointer transition-all ${!isSignUp ? "border-imperial text-imperial font-bold" : "border-transparent"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsSignUp(true); setErrorMsg(""); }}
              className={`pb-2 border-b-2 cursor-pointer transition-all ${isSignUp ? "border-imperial text-imperial font-bold" : "border-transparent"}`}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-500 font-mono text-center">⚠️ {errorMsg}</p>
          )}

          {/* Core Login form */}
          <form onSubmit={handleSubmit} className="space-y-4" id="auth-credentials-form">
            
            {/* Full Name */}
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block font-bold">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Charlotte Dupont"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-gray-200 pl-10 pr-3 py-2 text-xs focus:outline-none focus:border-imperial rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block font-bold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="traveler@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-gray-200 pl-10 pr-3 py-2 text-xs focus:outline-none focus:border-imperial rounded-lg"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block font-bold">Security Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-gray-200 pl-10 pr-3 py-2 text-xs focus:outline-none focus:border-imperial rounded-lg"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-imperial hover:bg-imperial-dark text-white text-xs font-semibold font-mono uppercase tracking-wider py-3 rounded-lg border border-gold/20 flex items-center justify-center space-x-1 cursor-pointer shadow-md"
            >
              <LogIn className="h-4 w-4 text-gold" />
              <span>{isSignUp ? "Initialize Account" : "Access Console"}</span>
            </button>
          </form>

          {/* Social Auth Separator */}
          <div className="relative text-center font-mono text-[9px] uppercase tracking-wider text-gray-400 border-b pb-2">
            <span className="bg-white px-2 relative top-3">Or sign in with</span>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] font-semibold font-mono uppercase tracking-wider">
            {["Google", "Apple", "Facebook"].map((provider) => (
              <button
                key={provider}
                onClick={() => handleSocialLogin(provider)}
                className="bg-stone-50 hover:bg-stone-100 border border-gray-200 rounded-lg py-2.5 text-center transition-all cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>{provider === "Google" ? "🌐" : provider === "Apple" ? "🍎" : "📘"}</span>
                <span className="text-gray-600">{provider}</span>
              </button>
            ))}
          </div>

          {/* Bottom promotion notice */}
          <div className="bg-gold/10 border border-gold/20 p-3 rounded-lg text-[10px] font-mono text-gold-dark flex items-start space-x-1.5 leading-normal">
            <Sparkles className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <span>Signing in locks you in for our <strong>Traveler Circle Premium Wishlist</strong>, letting you sync itineraries across devices.</span>
          </div>

        </div>

      </div>
    </div>
  );
}
