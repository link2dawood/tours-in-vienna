import { useState, useRef, useEffect, FormEvent } from "react";
import { MessageSquare, X, Send, Sparkles, AlertCircle, Compass } from "lucide-react";
import { ChatMessage } from "../types";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      sender: "assistant",
      text: "Grüß Gott! I am Franz, your virtual Vienna AI Concierge. Ask me anything about Maria Theresa's palaces, tram loops, hidden coffee houses, concert schedules, or booking any of our local tours. How may I guide you today?",
      createdAt: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    setErrorMsg("");
    
    // Append client message
    const userMsgId = Math.random().toString();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text,
      createdAt: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, newUserMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            parts: [{ text: m.text }]
          }))
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Franz had trouble connecting.");
      }

      // Append Franz reply
      const franzMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "assistant",
        text: data.reply,
        createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, franzMsg]);
    } catch (err: any) {
      setErrorMsg("Franz experienced a timeout. Please retry.");
      // Append a recovery system message
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "assistant",
          text: "My apologies! I am having trouble fetching our imperial records right now. But don't worry! Try applying coupon VIENNA15 inside the checkout panel for an instant 15% discount, or call our direct hotline at +43 664 4126911!",
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="franz-chat-widget">
      
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          id="franz-chat-trigger"
          className="bg-imperial text-white p-4 rounded-full shadow-2xl hover:bg-imperial-dark transition-all duration-300 flex items-center justify-center border-2 border-gold/40 hover:border-gold animate-bounce cursor-pointer group"
          title="Franz: AI Concierge Desk"
        >
          <div className="relative">
            <MessageSquare className="h-6 w-6 text-gold group-hover:scale-105 transition-transform" />
            <span className="absolute -top-1 -right-1 bg-green-500 h-3 w-3 rounded-full border-2 border-imperial animate-ping"></span>
          </div>
        </button>
      )}

      {/* Expanded Chat Dialogue Dialog Box */}
      {isOpen && (
        <div 
          className="bg-white border border-gold/30 rounded-2xl w-[350px] sm:w-[380px] h-[500px] shadow-2xl overflow-hidden flex flex-col animate-scale-up"
          id="franz-chat-box"
        >
          {/* Header */}
          <div className="bg-charcoal text-white p-4 flex justify-between items-center border-b border-gold/20">
            <div className="flex items-center space-x-3">
              {/* Mustache / Hat Concierge Avatar */}
              <div className="bg-imperial h-10 w-10 rounded-full border border-gold/40 flex items-center justify-center text-xl shadow-inner relative shrink-0">
                👨‍✈️
                <span className="absolute bottom-0 right-0 bg-green-500 h-2.5 w-2.5 rounded-full border border-charcoal"></span>
              </div>
              <div>
                <span className="font-serif text-sm font-semibold tracking-wide text-white block">Franz</span>
                <span className="text-[9px] uppercase tracking-wider text-gold font-mono block -mt-0.5">Vienna AI Concierge</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              id="close-franz-chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Active alerts warnings */}
          {errorMsg && (
            <div className="bg-red-50 p-2 text-[10px] text-red-600 font-mono text-center flex items-center justify-center space-x-1 border-b">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Messages Feed */}
          <div 
            ref={scrollRef}
            className="flex-grow p-4 overflow-y-auto space-y-4 bg-stone-50"
            id="franz-messages-feed"
          >
            {messages.map((m) => {
              const isFranz = m.sender === "assistant";
              return (
                <div 
                  key={m.id} 
                  className={`flex ${isFranz ? "justify-start" : "justify-end"} items-end space-x-2`}
                >
                  {isFranz && (
                    <span className="text-sm shrink-0 bg-gray-200 h-6 w-6 rounded-full flex items-center justify-center">
                      👨‍✈️
                    </span>
                  )}
                  <div 
                    className={`max-w-[78%] px-3 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isFranz 
                        ? "bg-white text-gray-800 border rounded-bl-none" 
                        : "bg-imperial text-white rounded-br-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    <span className={`text-[8px] font-mono block mt-1 text-right ${isFranz ? "text-gray-400" : "text-white/60"}`}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start items-center space-x-2">
                <span className="text-sm shrink-0 bg-gray-200 h-6 w-6 rounded-full flex items-center justify-center">
                  👨‍✈️
                </span>
                <div className="bg-white border rounded-2xl rounded-bl-none px-3 py-2.5 shadow-sm text-xs text-gray-400 flex items-center space-x-1.5 font-mono">
                  <Compass className="h-3 w-3 animate-spin text-gold" />
                  <span>Franz is reading imperial archives...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick prompt helpers shortcuts */}
          <div className="bg-white border-t p-2 flex gap-1.5 overflow-x-auto shrink-0 font-mono scrollbar-none">
            {[
              "Schönbrunn Ticket",
              "Coffee Protocol",
              "Discount Code?",
              "Vienna Woods Guide"
            ].map((shortcut) => (
              <button
                key={shortcut}
                onClick={() => setInputText(shortcut)}
                className="bg-stone-100 hover:bg-stone-200 text-[9px] px-2 py-1.5 rounded-full text-gray-600 whitespace-nowrap cursor-pointer transition-colors"
              >
                {shortcut}
              </button>
            ))}
          </div>

          {/* Form input */}
          <form 
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t flex space-x-2 shrink-0 items-center"
            id="franz-input-form"
          >
            <input 
              type="text" 
              placeholder="Ask Franz about tours, tram loops..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-imperial"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="bg-imperial text-white p-2.5 rounded-xl border border-gold/20 hover:bg-imperial-dark hover:border-gold transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="h-4 w-4 text-gold" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
