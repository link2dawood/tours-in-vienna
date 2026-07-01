import { useState, useEffect, FormEvent } from "react";
import { X, Calendar, Users, Phone, Mail, User, ShieldCheck, Ticket, CreditCard, Sparkles, Printer, CheckCircle } from "lucide-react";
import { Tour, Booking } from "../types";

interface BookingModalProps {
  tour: Tour | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export default function BookingModal({
  tour,
  isOpen,
  onClose,
  onBookingSuccess
}: BookingModalProps) {
  const [step, setStep] = useState<number>(1);
  
  // Form State
  const [bookingDate, setBookingDate] = useState<string>("");
  const [bookingTime, setBookingTime] = useState<string>("09:00");
  const [guests, setGuests] = useState<number>(2);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvv, setCardCvv] = useState<string>("");
  const [cardName, setCardName] = useState<string>("");
  const [promoCode, setPromoCode] = useState<string>("");

  // UI States
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Reset form when opening/closing
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setBookingDate("");
      setBookingTime("09:00");
      setGuests(2);
      setFullName("");
      setEmail("");
      setPhone("");
      setCardNumber("");
      setCardExpiry("");
      setCardCvv("");
      setCardName("");
      setPromoCode("");
      setPromoApplied(false);
      setPromoDiscount(0);
      setPromoError("");
      setErrorMsg("");
      setConfirmedBooking(null);
    }
  }, [isOpen]);

  if (!isOpen || !tour) return null;

  const basePrice = tour.price;
  const subtotal = basePrice * guests;
  const finalTotal = promoApplied ? subtotal - promoDiscount : subtotal;

  const handleApplyPromo = () => {
    setPromoError("");
    const code = promoCode.toUpperCase().trim();
    if (code === "VIENNA15") {
      setPromoDiscount(subtotal * 0.15);
      setPromoApplied(true);
    } else if (code === "WELCOMETOWIEN") {
      setPromoDiscount(subtotal * 0.10);
      setPromoApplied(true);
    } else {
      setPromoError("Invalid promotional code.");
    }
  };

  const handleStep1Submit = (e: FormEvent) => {
    e.preventDefault();
    if (!bookingDate) {
      setErrorMsg("Please select an excursion date.");
      return;
    }
    setErrorMsg("");
    setStep(2);
  };

  const handleStep2Submit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      setErrorMsg("Please complete all personal details.");
      return;
    }
    setErrorMsg("");
    setStep(3);
  };

  const handlePaymentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
      setErrorMsg("Please complete all credit card details.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");

    // Simulate Payment Gateway processing delay
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour.id,
          bookingDate,
          bookingTime,
          fullName,
          email,
          phone,
          guests,
          cardNumber,
          promoCode: promoApplied ? promoCode : undefined
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Payment transaction declined.");
      }

      setConfirmedBooking(data.booking);
      onBookingSuccess(data.booking);
      setStep(4);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while securing your booking.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="bg-ivory border border-gold/30 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
        id="booking-modal-container"
      >
        
        {/* Modal Header */}
        <div className="bg-charcoal text-white p-5 flex justify-between items-center border-b border-gold/20 shrink-0">
          <div className="flex items-center space-x-2">
            <Ticket className="h-5 w-5 text-gold" />
            <h3 className="font-serif text-lg font-semibold tracking-wide">
              {step === 4 ? "Booking Secured!" : "Secure Excursion Ticket"}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            id="close-booking-modal-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Multi-step progress bar */}
        {step < 4 && (
          <div className="bg-gray-100 px-6 py-3 border-b border-gray-200 flex items-center justify-between text-xs font-mono text-gray-400 shrink-0">
            <span className={step >= 1 ? "text-imperial font-bold" : ""}>1. Logistics</span>
            <span className="text-gray-300">&rarr;</span>
            <span className={step >= 2 ? "text-imperial font-bold" : ""}>2. Travelers</span>
            <span className="text-gray-300">&rarr;</span>
            <span className={step >= 3 ? "text-imperial font-bold" : ""}>3. Checkout</span>
          </div>
        )}

        {/* Scrollable Body Content */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          
          {/* Active Tour Highlight Panel */}
          {step < 4 && (
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center space-x-4">
              <img src={tour.image} alt="" className="h-16 w-16 object-cover rounded-lg border" />
              <div>
                <span className="text-[10px] font-mono uppercase bg-imperial/10 text-imperial px-2 py-0.5 rounded font-bold">
                  {tour.category}
                </span>
                <h4 className="font-serif font-bold text-gray-900 mt-1 leading-tight">{tour.title}</h4>
                <p className="text-xs text-gray-500 font-mono mt-0.5">€{tour.price} / person &bull; {tour.duration}</p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-sm text-red-700 font-mono">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* STEP 1: LOGISTICS */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4" id="booking-step1-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Datepicker */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold block">
                    Excursion Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input 
                      type="date" 
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-imperial"
                    />
                  </div>
                </div>

                {/* Time picker */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold block">
                    Departure Slot
                  </label>
                  <select 
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-imperial cursor-pointer"
                  >
                    <option value="09:00">Morning (09:00 AM)</option>
                    <option value="11:30">Mid-Day (11:30 AM)</option>
                    <option value="14:00">Afternoon (02:00 PM)</option>
                    <option value="17:00">Sunset slot (05:00 PM)</option>
                    <option value="20:00">Evening slot (08:00 PM)</option>
                  </select>
                </div>

              </div>

              {/* Guest Count Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold block">
                  Number of Travelers
                </label>
                <div className="flex items-center space-x-3 bg-white border border-gray-200 rounded-lg p-2.5 max-w-xs justify-between">
                  <button 
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="h-8 w-8 rounded-md bg-gray-50 border flex items-center justify-center font-bold hover:bg-gray-100 text-gray-700"
                  >
                    -
                  </button>
                  <div className="flex items-center space-x-1 font-mono">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="font-bold text-charcoal">{guests} travelers</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setGuests(Math.min(10, guests + 1))}
                    className="h-8 w-8 rounded-md bg-gray-50 border flex items-center justify-center font-bold hover:bg-gray-100 text-gray-700"
                  >
                    +
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 font-mono">Private group settings are automatically configured for reservations of 8+ guests.</p>
              </div>

              {/* Price Calculation details */}
              <div className="bg-stone-50 rounded-xl p-4 border border-gray-200 space-y-2 font-mono text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Ticket Price:</span>
                  <span>€{basePrice.toFixed(2)} / guest</span>
                </div>
                <div className="flex justify-between">
                  <span>Travelers Count:</span>
                  <span>&times; {guests}</span>
                </div>
                <div className="border-t border-dashed pt-2 flex justify-between font-bold text-gray-900 text-base">
                  <span>Subtotal Amount:</span>
                  <span className="text-imperial">€{subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Step 1 Submit button */}
              <button
                type="submit"
                id="booking-step1-submit-btn"
                className="w-full bg-imperial hover:bg-imperial-dark text-white font-bold py-3.5 rounded-lg border border-gold/30 hover:border-gold/50 transition-colors text-sm uppercase tracking-wider font-mono shadow cursor-pointer text-center"
              >
                Continue to Traveler Details
              </button>

            </form>
          )}

          {/* STEP 2: TRAVELER DETAILS */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4" id="booking-step2-form">
              <div className="space-y-3">
                
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold block">
                    Lead Traveler Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Charlotte Dupont"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-imperial"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold block">
                    Email Address (for receipt / itinerary)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. charlotte@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-imperial"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold block">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. +43 664 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-imperial"
                    />
                  </div>
                </div>

              </div>

              {/* Quick instructions reminder */}
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded text-xs text-amber-800 leading-relaxed font-sans">
                📌 <strong>Guaranteed Seat Confirmation:</strong> An automated SMS and a beautiful PDF invoice ticket confirmation will be generated and logged to your client mailbox instantly upon securing payment checkout.
              </div>

              {/* Navigation buttons */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg py-3.5 text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer text-center"
                >
                  Back
                </button>
                <button
                  type="submit"
                  id="booking-step2-submit-btn"
                  className="bg-imperial hover:bg-imperial-dark text-white font-bold py-3.5 rounded-lg border border-gold/30 hover:border-gold/50 transition-colors text-xs uppercase tracking-wider font-mono shadow cursor-pointer text-center"
                >
                  Proceed to Payment
                </button>
              </div>

            </form>
          )}

          {/* STEP 3: SECURE PAYMENT GATEWAY */}
          {step === 3 && (
            <form onSubmit={handlePaymentSubmit} className="space-y-5" id="booking-step3-form">
              
              {/* Payment Info */}
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 flex items-center space-x-3 text-xs leading-normal">
                <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
                <div>
                  <strong className="block">128-bit SSL Secure Merchant Connection</strong>
                  Simulating direct credit card processing. Merchant ID: #VIE-TOUR-77. Do not enter actual personal bank card details—use test numbers (e.g., 4242 4242 ...).
                </div>
              </div>

              <div className="space-y-3">
                {/* Cardholder Name */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold block">
                    Cardholder Full Name
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Charlotte Dupont"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-imperial"
                  />
                </div>

                {/* Card Number */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold block">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      required
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").substring(0, 16))}
                      className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-imperial"
                    />
                  </div>
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold block">
                      Expiry Date (MM/YY)
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value.substring(0, 5))}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-imperial text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold block">
                      CVV Code
                    </label>
                    <input 
                      type="password" 
                      required
                      placeholder="***"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").substring(0, 3))}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-imperial text-center"
                    />
                  </div>
                </div>

                {/* Promotional Coupon field */}
                <div className="pt-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold block mb-1">
                    Promo Coupon Code
                  </label>
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="e.g. VIENNA15 or WELCOMETOWIEN"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                      className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-imperial flex-grow uppercase font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={promoApplied || !promoCode}
                      className="bg-charcoal hover:bg-black text-white text-xs font-semibold font-mono uppercase tracking-wider px-4 py-2 rounded-lg border border-gold/20 disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-xs text-emerald-600 mt-1 font-mono">
                      🎉 Coupon successfully applied! Saved €{promoDiscount.toFixed(2)}.
                    </p>
                  )}
                  {promoError && (
                    <p className="text-xs text-red-500 mt-1 font-mono">
                      ❌ {promoError}
                    </p>
                  )}
                </div>

              </div>

              {/* Checkout Calculation details */}
              <div className="bg-stone-50 rounded-xl p-4 border border-gray-200 space-y-2 font-mono text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal for {guests} travelers:</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount Promo:</span>
                    <span>- €{promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-dashed pt-2 flex justify-between font-bold text-gray-900 text-sm">
                  <span>Grand Total Secured Amount:</span>
                  <span className="text-lg text-imperial font-bold">€{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Secure Checkout button */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setStep(2)}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg py-3.5 text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer text-center"
                >
                  Back
                </button>
                <button
                  type="submit"
                  id="booking-checkout-submit-btn"
                  disabled={isProcessing}
                  className="bg-imperial hover:bg-imperial-dark text-white font-bold py-3.5 rounded-lg border border-gold/30 hover:border-gold/50 transition-colors text-xs uppercase tracking-wider font-mono shadow cursor-pointer flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4 text-gold" />
                      <span>Pay €{finalTotal.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* STEP 4: CONFIRMATION & PRINTABLE RECEIPT */}
          {step === 4 && confirmedBooking && (
            <div className="space-y-6 animate-fade-in" id="booking-confirmation-panel">
              
              {/* Clean Confirmed Alert banner */}
              <div className="text-center space-y-2">
                <div className="bg-emerald-100 h-14 w-14 rounded-full flex items-center justify-center mx-auto border border-emerald-300">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900">Excursion Securely Confirmed!</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  A verification receipt and meeting agenda details have been simulated and sent to <span className="text-gray-900 font-semibold">{confirmedBooking.email}</span>.
                </p>
              </div>

              {/* Beautiful physical-style ticket with punched side cutouts */}
              <div 
                className="bg-white border border-gray-200 rounded-2xl shadow-lg relative overflow-hidden ticket-grid max-w-md mx-auto"
                id="printable-receipt-card"
              >
                {/* Gold header band */}
                <div className="bg-imperial text-white p-4 text-center border-b border-gold/30">
                  <span className="font-serif text-lg tracking-widest font-bold text-gold">TOURS IN VIENNA</span>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-white/80 font-mono">Official Imperial Boarding Ticket</p>
                </div>

                <div className="p-5 space-y-4">
                  
                  {/* Tour title and ID row */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Experience Details</span>
                      <h4 className="font-serif font-bold text-gray-900 text-lg leading-tight mt-0.5">{confirmedBooking.tourTitle}</h4>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Ticket Code</span>
                      <span className="text-sm font-mono font-bold text-imperial block mt-0.5">{confirmedBooking.id}</span>
                    </div>
                  </div>

                  {/* Traveler info grid */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 border-t border-b border-dashed border-gray-100 py-3 text-xs font-mono text-gray-600">
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase block">Traveler</span>
                      <span className="font-semibold text-gray-900 truncate block">{confirmedBooking.fullName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase block">Guests</span>
                      <span className="font-semibold text-gray-900 block">{confirmedBooking.guests} travelers</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase block">Excursion Date</span>
                      <span className="font-semibold text-gray-900 block">{confirmedBooking.bookingDate}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase block">Departure</span>
                      <span className="font-semibold text-gray-900 block">{confirmedBooking.bookingTime}</span>
                    </div>
                  </div>

                  {/* Meeting instructions */}
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-[10px] text-amber-900 leading-normal">
                    <strong>Meeting Point:</strong> {tour.startPoint}<br/>
                    Please arrive 10 minutes prior. Look for the burgundy uniform with the gold crest. Show this digital/printed ticket to the guide.
                  </div>

                  {/* QR code and pricing */}
                  <div className="flex items-center justify-between pt-2">
                    {/* Simulated vector SVG QR Code */}
                    <div className="border p-1 bg-white rounded-md shrink-0">
                      <svg width="64" height="64" viewBox="0 0 24 24" stroke="#1A1A1A" strokeWidth="1" strokeLinecap="square">
                        <path d="M1,1 h6 v6 h-6 Z M2,2 h4 v4 h-4 Z" />
                        <path d="M17,1 h6 v6 h-6 Z M18,2 h4 v4 h-4 Z" />
                        <path d="M1,17 h6 v6 h-6 Z M2,18 h4 v4 h-4 Z" />
                        <rect x="3" y="3" width="2" height="2" />
                        <rect x="19" y="3" width="2" height="2" />
                        <rect x="3" y="19" width="2" height="2" />
                        <rect x="10" y="2" width="4" height="2" />
                        <rect x="10" y="6" width="2" height="4" />
                        <rect x="14" y="10" width="4" height="2" />
                        <rect x="6" y="12" width="4" height="4" />
                        <rect x="14" y="16" width="6" height="4" />
                      </svg>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-[9px] text-gray-400 uppercase block">Total Amount Paid</span>
                      <span className="text-2xl font-serif font-bold text-imperial">€{confirmedBooking.totalAmount.toFixed(2)}</span>
                      <span className="text-[9px] text-emerald-600 block">✓ SSL SECURE PAID</span>
                    </div>
                  </div>

                </div>

                {/* Secure seal footer */}
                <div className="bg-gray-50 p-3 text-center border-t border-gray-100 text-[9px] text-gray-400 font-mono uppercase tracking-wider">
                  Verified Payment Auth &bull; Card ending *{confirmedBooking.cardLast4}
                </div>
              </div>

              {/* Action row buttons */}
              <div className="flex space-x-3 max-w-md mx-auto justify-center">
                <button
                  onClick={handlePrint}
                  className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider font-mono flex items-center space-x-1 cursor-pointer shadow-sm"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Ticket</span>
                </button>
                <button
                  onClick={onClose}
                  className="bg-charcoal hover:bg-black text-white font-semibold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider font-mono flex items-center space-x-1 cursor-pointer shadow-sm border border-gold/20"
                >
                  <span>Close Window</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
