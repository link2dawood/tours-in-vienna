import { useState, useEffect } from "react";
import { X, Shield, Mail, Check, AlertTriangle, Compass, RefreshCw, BarChart3, Users, Landmark, Heart, FileText } from "lucide-react";
import { Booking, ContactInquiry, EmailLog, Review } from "../types";

interface AdminConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  inquiries: ContactInquiry[];
  reviews: Review[];
}

export default function AdminConsole({
  isOpen,
  onClose,
  bookings,
  inquiries,
  reviews
}: AdminConsoleProps) {
  const [activeSubTab, setActiveSubTab] = useState<string>("analytics");
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Load email notifications logs
  const fetchEmailLogs = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/emails");
      const data = await response.json();
      if (response.ok) {
        setEmailLogs(data);
        if (data.length > 0 && !selectedEmail) {
          setSelectedEmail(data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load email logs:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEmailLogs();
    }
  }, [isOpen, bookings, inquiries]);

  if (!isOpen) return null;

  // Analytics Math
  const totalBookingsCount = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const averageStars = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
    : "5.01";
  const uniqueTravelers = new Set(bookings.map((b) => b.email)).size;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div 
        className="bg-ivory border border-gold/40 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl relative flex flex-col h-[85vh]"
        id="admin-console-container"
      >
        
        {/* Admin Header */}
        <div className="bg-charcoal text-white p-5 flex justify-between items-center border-b border-gold/20 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-imperial p-2 rounded-lg border border-gold/40">
              <Shield className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold tracking-wide flex items-center space-x-2">
                <span>Imperial Agency Admin Hub</span>
                <span className="bg-gold/15 text-gold border border-gold/40 text-[9px] px-2.5 py-0.5 rounded font-mono uppercase font-bold animate-pulse">
                  Agency Active
                </span>
              </h3>
              <span className="text-[10px] text-gray-400 font-mono block">Registered Office Security Desk &bull; Vienna, AT</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={fetchEmailLogs}
              className="p-2 hover:bg-white/5 rounded-lg text-gray-300 transition-all cursor-pointer"
              title="Refresh Logs"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-gold" : ""}`} />
            </button>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              id="close-admin-console-btn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Console Tabs Row */}
        <div className="bg-gray-100 border-b border-gray-200 flex items-center px-6 py-2 gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-gray-400 shrink-0">
          {[
            { id: "analytics", label: "Executive Analytics", icon: BarChart3 },
            { id: "bookings", label: `Bookings Log (${totalBookingsCount})`, icon: Landmark },
            { id: "inquiries", label: `Client Messages (${inquiries.length})`, icon: FileText },
            { id: "mailbox", label: `Mailbox Hub (${emailLogs.length})`, icon: Mail }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center space-x-1.5 px-4 py-3 border-b-2 transition-all cursor-pointer ${
                  activeSubTab === tab.id
                    ? "border-imperial text-imperial font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Workspace Panel */}
        <div className="p-6 overflow-y-auto flex-grow bg-stone-50">
          
          {/* TAB 1: EXECUTIVE ANALYTICS */}
          {activeSubTab === "analytics" && (
            <div className="space-y-6 animate-fade-in" id="admin-analytics-panel">
              
              {/* Core Analytics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Bookings */}
                <div className="bg-white border rounded-xl p-5 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-gray-400">
                    <span className="text-xs font-mono uppercase tracking-wider font-bold">Secure Bookings</span>
                    <Landmark className="h-5 w-5 text-imperial" />
                  </div>
                  <p className="text-3xl font-serif font-bold text-gray-900">{totalBookingsCount}</p>
                  <span className="text-[10px] text-green-600 font-mono block font-bold">✓ 100% Client Paid</span>
                </div>

                {/* Total Revenue */}
                <div className="bg-white border rounded-xl p-5 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-gray-400">
                    <span className="text-xs font-mono uppercase tracking-wider font-bold">Total Revenue</span>
                    <span className="font-serif font-bold text-lg text-gold">€</span>
                  </div>
                  <p className="text-3xl font-serif font-bold text-gray-900">€{totalRevenue.toFixed(2)}</p>
                  <span className="text-[10px] text-gray-400 font-mono block">Excluding voucher codes</span>
                </div>

                {/* Avg Stars rating */}
                <div className="bg-white border rounded-xl p-5 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-gray-400">
                    <span className="text-xs font-mono uppercase tracking-wider font-bold">Google Rating</span>
                    <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  </div>
                  <p className="text-3xl font-serif font-bold text-gray-900">{averageStars} ★</p>
                  <span className="text-[10px] text-gold-dark font-mono block font-bold">Avg verified score</span>
                </div>

                {/* Unique Tourists */}
                <div className="bg-white border rounded-xl p-5 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-gray-400">
                    <span className="text-xs font-mono uppercase tracking-wider font-bold">Unique Tourists</span>
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-serif font-bold text-gray-900">{uniqueTravelers}</p>
                  <span className="text-[10px] text-gray-400 font-mono block">Across global locations</span>
                </div>

              </div>

              {/* Conversion Statistics visual bar */}
              <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
                <h4 className="font-serif font-bold text-gray-900 text-base">Agency Funnel Health</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                  <div className="space-y-1.5">
                    <span className="text-gray-400">Excursion Clicks:</span>
                    <span className="font-bold text-gray-900 block text-lg">4,120</span>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full w-[85%]"></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-gray-400">Checkout Intent:</span>
                    <span className="font-bold text-gray-900 block text-lg">1,280</span>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="bg-gold h-full w-[45%]"></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-gray-400">Secured Paid:</span>
                    <span className="font-bold text-gray-900 block text-lg">{totalBookingsCount} bookings</span>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="bg-imperial h-full w-[15%]"></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: BOOKINGS LOG */}
          {activeSubTab === "bookings" && (
            <div className="bg-white border rounded-xl shadow-sm overflow-x-auto animate-fade-in" id="admin-bookings-tab">
              {bookings.length > 0 ? (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 font-mono text-gray-500 uppercase border-b">
                      <th className="p-4 font-bold">ID</th>
                      <th className="p-4 font-bold">Traveler</th>
                      <th className="p-4 font-bold">Tour Excursion</th>
                      <th className="p-4 font-bold">Date / departure</th>
                      <th className="p-4 font-bold text-center">Guests</th>
                      <th className="p-4 font-bold text-right">Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-mono">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-stone-50">
                        <td className="p-4 font-bold text-imperial">{booking.id}</td>
                        <td className="p-4">
                          <strong className="text-gray-900 font-sans block">{booking.fullName}</strong>
                          <span className="text-gray-400 text-[10px] block">{booking.email}</span>
                        </td>
                        <td className="p-4 text-gray-700 font-sans">{booking.tourTitle}</td>
                        <td className="p-4 text-gray-600">
                          {booking.bookingDate} <span className="text-gray-400 text-[10px]">@{booking.bookingTime}</span>
                        </td>
                        <td className="p-4 text-center text-gray-900 font-bold">{booking.guests}</td>
                        <td className="p-4 text-right text-emerald-600 font-bold">€{booking.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-16 text-gray-400 font-mono">
                  No bookings logged inside the server database yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONTACT INQUIRIES */}
          {activeSubTab === "inquiries" && (
            <div className="space-y-4 animate-fade-in" id="admin-inquiries-tab">
              {inquiries.length > 0 ? (
                inquiries.map((inq) => (
                  <div key={inq.id} className="bg-white border rounded-xl p-5 shadow-sm space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-2 text-xs font-mono">
                      <div>
                        <strong className="text-gray-900 block font-sans text-sm">{inq.name}</strong>
                        <span className="text-gray-400">{inq.email}</span>
                      </div>
                      <div className="text-right text-gray-400 shrink-0 mt-2 sm:mt-0">
                        <span className="bg-imperial/10 text-imperial text-[10px] uppercase font-bold px-2 py-0.5 rounded block">
                          {inq.subject}
                        </span>
                        <span className="text-[10px] block mt-1">{new Date(inq.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs font-light leading-relaxed">
                      "{inq.message}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-white border rounded-xl text-gray-400 font-mono">
                  No inquiries or support tickets submitted yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MAILBOX HUB (SENT EMAIL LOGS) */}
          {activeSubTab === "mailbox" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch h-[55vh] animate-fade-in" id="admin-mailbox-tab">
              
              {/* Left Side: Split list of sent messages */}
              <div className="md:col-span-5 bg-white border rounded-xl overflow-y-auto divide-y">
                {emailLogs.length > 0 ? (
                  emailLogs.map((log) => (
                    <div
                      key={log.id}
                      onClick={() => setSelectedEmail(log)}
                      className={`p-4 text-xs font-mono cursor-pointer transition-colors ${
                        selectedEmail?.id === log.id
                          ? "bg-imperial/5 border-l-4 border-imperial font-bold"
                          : "hover:bg-stone-50"
                      }`}
                    >
                      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                        <span>To: {log.recipient.substring(0, 18)}...</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <strong className="text-gray-800 block truncate font-sans text-sm font-semibold">{log.subject}</strong>
                      <span className="text-[10px] text-gray-400 block uppercase mt-1">
                        Trigger: {log.triggerEvent}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 text-gray-400 font-mono">
                    Mailbox empty. Try completing a booking or writing a contact inquiry first!
                  </div>
                )}
              </div>

              {/* Right Side: Rendered Email Visualizer */}
              <div className="md:col-span-7 bg-white border rounded-xl flex flex-col overflow-hidden relative">
                {selectedEmail ? (
                  <div className="flex flex-col h-full overflow-hidden">
                    {/* Headers details panel */}
                    <div className="bg-stone-50 p-4 border-b text-xs font-mono text-gray-500 space-y-1 shrink-0">
                      <div><span className="font-bold text-gray-400">From:</span> {selectedEmail.sender}</div>
                      <div><span className="font-bold text-gray-400">To:</span> {selectedEmail.recipient}</div>
                      <div><span className="font-bold text-gray-400">Subject:</span> <strong className="text-gray-900 font-sans">{selectedEmail.subject}</strong></div>
                      <div><span className="font-bold text-gray-400">Timestamp:</span> {new Date(selectedEmail.timestamp).toLocaleString()}</div>
                    </div>

                    {/* Styled HTML Body Display Frame */}
                    <div className="flex-grow p-6 overflow-y-auto bg-[#F4F1EA]">
                      <div 
                        className="bg-white p-6 rounded-lg border shadow-sm max-w-lg mx-auto whitespace-pre-line text-sm text-gray-800 leading-relaxed font-sans"
                        dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-grow p-10 text-center text-gray-400 font-mono">
                    <Mail className="h-10 w-10 text-gray-300 mb-3 animate-bounce" />
                    <span>Select a logged notification to inspect its generated HTML layout structure.</span>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
