import { useState } from "react";
import { X, Bell, BellOff, Info, Sparkles, Navigation, Calendar } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: "promo" | "weather" | "system";
  timestamp: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationAllowed: (allowed: boolean) => void;
  isAllowed: boolean;
}

export default function NotificationCenter({
  isOpen,
  onClose,
  onNotificationAllowed,
  isAllowed
}: NotificationCenterProps) {
  const [permissionState, setPermissionState] = useState<"default" | "granted" | "denied">(
    isAllowed ? "granted" : "default"
  );

  const notificationsHistory: Notification[] = [
    {
      id: "nt-1",
      title: "🎫 Imperial Palace Flash Sale!",
      body: "Unveil Schönbrunn's secret gardens today. Take 15% off our guided palatial walking tour using discount code VIENNA15.",
      type: "promo",
      timestamp: "Just now"
    },
    {
      id: "nt-2",
      title: "☀️ Perfect Weather Outlook",
      body: "Clear, starlit skies predicted over Vienna tonight! Absolute prime conditions for our evening Danube Canal Sightseeing Cruise.",
      type: "weather",
      timestamp: "1 hour ago"
    },
    {
      id: "nt-3",
      title: "🚩 Tour Start Advisory",
      body: "Vienna Classic Walk starting in 30 mins! Our licensed guide is already at Stephansplatz South Spire. Look for the burgundy banner.",
      type: "system",
      timestamp: "3 hours ago"
    }
  ];

  const requestPermission = () => {
    // Simulate native browser permission request dialog
    const simulatedResponse = window.confirm(
      "toursinvienna.at wants to:\nShow push notifications for flash sales, live tour departure advisory, and local weather updates."
    );

    if (simulatedResponse) {
      setPermissionState("granted");
      onNotificationAllowed(true);
    } else {
      setPermissionState("denied");
      onNotificationAllowed(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[340px] bg-white border-l border-gray-200 shadow-2xl flex flex-col justify-between animate-slide-in">
      
      {/* Header */}
      <div className="bg-charcoal text-white p-5 flex justify-between items-center border-b border-gold/20 shrink-0">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-gold animate-bounce" />
          <h3 className="font-serif text-base font-semibold">Travel Notification Center</h3>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body panel container */}
      <div className="flex-grow p-5 overflow-y-auto space-y-6 bg-stone-50">
        
        {/* Permission Request panel block */}
        <div className="bg-white border rounded-xl p-4 shadow-sm text-center space-y-3">
          <div className="bg-imperial/5 h-12 w-12 rounded-full flex items-center justify-center mx-auto border border-gold/10">
            {permissionState === "granted" ? (
              <Bell className="h-6 w-6 text-gold" />
            ) : (
              <BellOff className="h-6 w-6 text-gray-400" />
            )}
          </div>
          
          <div>
            <h4 className="font-serif text-sm font-bold text-gray-900">Push Notifications Status</h4>
            <p className="text-[10px] text-gray-500 font-mono mt-1 leading-normal">
              {permissionState === "granted" 
                ? "✓ Push subscriptions active. You will receive real-time weather and departure advisories."
                : permissionState === "denied"
                ? "❌ Push subscriptions blocked. Enable inside browser settings to resume."
                : "Secure real-time flash sales and tour guides departure coordinates on your desktop."}
            </p>
          </div>

          {permissionState === "default" && (
            <button
              onClick={requestPermission}
              className="w-full bg-imperial hover:bg-imperial-dark text-white text-[10px] font-semibold font-mono uppercase tracking-wider py-2 rounded-lg border border-gold/20 transition-colors cursor-pointer"
            >
              Enable Desktop Alerts
            </button>
          )}

          {permissionState === "granted" && (
            <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded">
              ✓ Subscriptions Live
            </span>
          )}
        </div>

        {/* Notifications list feed */}
        <div className="space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block border-b pb-1 font-bold">
            Alert Logs Feed ({notificationsHistory.length})
          </span>

          <div className="space-y-3">
            {notificationsHistory.map((item) => (
              <div 
                key={item.id}
                className="bg-white border rounded-xl p-4 shadow-sm space-y-2 relative overflow-hidden"
              >
                {/* Decorative left strip */}
                <div className={`absolute inset-y-0 left-0 w-1.5 ${
                  item.type === "promo" ? "bg-gold" : item.type === "weather" ? "bg-blue-400" : "bg-imperial"
                }`}></div>

                <div className="flex justify-between items-center pl-2 text-[10px] font-mono text-gray-400">
                  <span className="flex items-center space-x-1 uppercase font-bold text-gray-500">
                    {item.type === "promo" && <Sparkles className="h-3 w-3 text-gold" />}
                    {item.type === "weather" && <Calendar className="h-3 w-3 text-blue-400" />}
                    {item.type === "system" && <Navigation className="h-3 w-3 text-imperial" />}
                    <span>{item.type}</span>
                  </span>
                  <span>{item.timestamp}</span>
                </div>

                <div className="pl-2 space-y-1">
                  <h5 className="font-sans text-xs font-bold text-gray-900">{item.title}</h5>
                  <p className="text-[11px] text-gray-500 font-light leading-normal">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer disclaimer */}
      <div className="bg-stone-100 p-4 border-t text-center text-[9px] text-gray-400 font-mono uppercase tracking-wider shrink-0">
        Alert systems monitored &bull; v2.2-stable
      </div>

    </div>
  );
}
