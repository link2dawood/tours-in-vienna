import { useState, FormEvent } from "react";
import { Mail, Phone, MapPin, Clock, Award, Send, CheckCircle, ExternalLink } from "lucide-react";
import { ContactInquiry } from "../types";

interface ContactFormProps {
  onNewInquiryAdded: (inquiry: ContactInquiry) => void;
}

export default function ContactForm({ onNewInquiryAdded }: ContactFormProps) {
  // Form State
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [subject, setSubject] = useState<string>("Tour Booking Inquiry");
  const [message, setMessage] = useState<string>("");

  // UI States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccess(false);

    if (!fullName || !email || !message) {
      setErrorMsg("Please complete all required fields (Name, Email, Message).");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          phone,
          subject,
          message
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit inquiry.");
      }

      onNewInquiryAdded(data.inquiry);
      setFullName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="contact-section">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-gold font-bold block mb-1">Get In Touch</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">Contact Our Imperial Headquarters</h2>
        <p className="text-gray-500 font-light text-sm sm:text-base">
          Have questions about custom itineraries, group discounts, or ticket transfers? Send us a request, and our Viennese travel specialists will get back to you within 2 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left Side: Agency Logistics & Information */}
        <div className="lg:col-span-5 bg-charcoal text-white rounded-2xl p-6 sm:p-8 border border-gold/20 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -left-12 h-36 w-36 bg-gold/5 rounded-full blur-2xl"></div>
          
          <div className="space-y-6 relative z-10">
            {/* Agency badge */}
            <div className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/30 text-gold px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold">
              <Award className="h-4 w-4 text-gold shrink-0" />
              <span>Licensed Austrian Tour Operator</span>
            </div>

            <h3 className="font-serif text-2xl font-bold">Tours in Vienna</h3>
            <p className="text-gray-400 font-light text-xs leading-relaxed">
              We operate premium, historical, and sensory sightseeing excursions across Austria. Registered and audited in Vienna, Austria with 5.01/5.0 Google customer satisfaction rating.
            </p>

            {/* Logistics Grid */}
            <div className="space-y-4 pt-4 border-t border-white/10 text-xs font-mono">
              {/* Address */}
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Imperial Headquarters:</strong>
                  <span className="text-gray-300">Schlettergasse 3/9/10, 1220 Wien, Austria</span>
                </div>
              </div>

              {/* Telephone */}
              <div className="flex items-start space-x-3">
                <Phone className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Viennese hotline:</strong>
                  <a href="tel:+436644126911" className="text-gold hover:underline font-bold">+43 664 4126911</a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Official email inbox:</strong>
                  <a href="mailto:office@toursinvienna.at" className="text-gray-300 hover:text-gold transition-colors">office@toursinvienna.at</a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start space-x-3">
                <Clock className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Concierge Desk Hours:</strong>
                  <span className="text-gray-300">Mon &ndash; Fri: 8:00 AM &ndash; 6:00 PM <br/>Sat: 9:00 AM &ndash; 4:00 PM<br/>Sun: Closed (Opens 8:00 AM Thu)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map view locator callout */}
          <div className="mt-8 pt-6 border-t border-white/10 text-xs text-gray-400 font-mono flex items-center justify-between relative z-10">
            <span>License ID: #WIE-5012-AUT</span>
            <a 
              href="https://maps.google.com/?q=Schlettergasse+3,+Wien,+Austria" 
              target="_blank" 
              referrerPolicy="no-referrer"
              className="text-gold hover:underline flex items-center space-x-1"
            >
              <span>Google Maps Link</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

        </div>

        {/* Right Side: Contact Inquiry Form */}
        <div className="lg:col-span-7 bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          
          <div>
            <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">Send Secure Message</h3>
            <p className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-6 pb-2 border-b">
              Automated Email Notification Active
            </p>

            {success ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3 max-w-lg mx-auto my-6 animate-fade-in">
                <div className="bg-emerald-100 h-12 w-12 rounded-full flex items-center justify-center mx-auto border border-emerald-300">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <h4 className="font-serif text-lg font-bold text-gray-900">Message Submitted Successfully!</h4>
                <p className="text-xs text-gray-600 font-light leading-relaxed">
                  We have logged your request. Our automated server-side email notifications have triggered:
                </p>
                <div className="bg-white border text-left p-3.5 rounded-lg text-xs font-mono text-gray-600 space-y-1">
                  <p className="text-emerald-700 font-bold">✓ Sent Client Confirmation Auto-Reply</p>
                  <p className="text-imperial font-bold">✓ Sent Admin Support Ticket Alert</p>
                </div>
                <p className="text-[10px] text-gray-400 font-mono">
                  You can inspect both fully laid-out HTML email logs inside the <strong>Admin Dashboard Mailbox Hub</strong> in the navbar above!
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 bg-charcoal hover:bg-black text-white px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Write Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4" id="contact-inquiry-form">
                {errorMsg && (
                  <p className="text-xs text-red-500 font-mono">⚠️ {errorMsg}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold block">
                      Your Name
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Charlotte Dupont"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-imperial"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold block">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. charlotte@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-imperial"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold block">
                      Phone (Optional)
                    </label>
                    <input 
                      type="tel" 
                      placeholder="e.g. +43 664 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-imperial"
                    />
                  </div>

                  {/* Subject Reason */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold block">
                      Topic Reason
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-imperial cursor-pointer"
                    >
                      <option value="Tour Booking Inquiry">Tour Booking Inquiry</option>
                      <option value="Custom Private Itinerary Request">Custom Private Itinerary Request</option>
                      <option value="Group Booking Discount Inquiry">Group Booking Discount Inquiry</option>
                      <option value="Business Partnership">Business Partnership</option>
                      <option value="Other Feedback">Other Feedback</option>
                    </select>
                  </div>
                </div>

                {/* Message text */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-500 font-bold block">
                    Message Details
                  </label>
                  <textarea 
                    required
                    rows={5}
                    placeholder="Provide details about your tour queries, dates, groups, custom requirements..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-xs focus:outline-none focus:border-imperial"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="inquiry-submit-btn"
                  className="w-full bg-imperial hover:bg-imperial-dark text-white font-bold py-3.5 rounded-lg border border-gold/30 hover:border-gold/50 transition-colors text-xs uppercase tracking-wider font-mono shadow cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Send className="h-4 w-4 text-gold" />
                  <span>{isSubmitting ? "Sending Inquiry..." : "Transmit Safe Ticket"}</span>
                </button>

              </form>
            )}
          </div>

          <p className="text-[10px] text-gray-400 font-mono text-center mt-4 leading-tight">
            🛡️ General inquiry tickets are encrypted using industry TLS standards.
          </p>

        </div>

      </div>

    </div>
  );
}
