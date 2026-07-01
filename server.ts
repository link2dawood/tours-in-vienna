import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { Tour, Booking, Review, BlogPost, ContactInquiry, EmailLog } from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

if (GEMINI_KEY && GEMINI_KEY !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: GEMINI_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Successfully initialized server-side Gemini AI client.");
  } catch (err) {
    console.error("Error initializing Gemini client:", err);
  }
} else {
  console.warn("GEMINI_API_KEY is not configured or holds a placeholder. AI Chatbot will fall back to smart local rule-based replies.");
}

// File Database Path
const DB_FILE = path.join(process.cwd(), "vienna_data.json");

// Define Seeds
const DEFAULT_TOURS: Tour[] = [
  {
    id: "vienna-classic",
    title: "Vienna Grand Imperial Walking Tour",
    tagline: "Step into the imperial history of the Habsburg dynasty",
    description: "Discover the captivating heart of Vienna with our local expert historians. Wander through narrow medieval alleys, stand in awe before the majestic Hofburg Palace, and hear the scandalous secrets of the Habsburg emperors.",
    longDescription: "Our signature walking tour is the perfect introduction to Vienna's imperial center. Led by state-licensed local historians, we cover over 800 years of dense history in an engaging, narrative style. We'll start at Stephansplatz under the towering gothic spire of St. Stephen's Cathedral. From there, we navigate the historic Graben and Kohlmarkt avenues to appreciate Viennese baroque architecture. We'll explore the expansive Hofburg Imperial Palace complex—the primary residence of the Habsburgs—including the outer courtyards and the Spanish Riding School. The tour concludes at Albertina Square, providing a profound overview of Vienna's artistic and political legacy. Perfect for first-time global travelers!",
    price: 35,
    duration: "3 Hours",
    category: "History & Culture",
    groupSize: "Max 15 people",
    rating: 4.9,
    reviewsCount: 42,
    startPoint: "St. Stephen's Cathedral Main Entrance (Stephansplatz 1, 1010 Wien)",
    highlights: ["Gothic St. Stephen's Cathedral", "Hofburg Imperial Palace Complex", "Spanish Riding School Courtyards", "Graben & Kohlmarkt historic lanes", "Imperial Crypt of the Capuchins", "Albertina & Opera District"],
    coordinates: { x: 420, y: 280, label: "Historic Center (Stephansplatz)" },
    image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "schonbrunn-palace",
    title: "Schönbrunn Palace & Gardens Explorer",
    tagline: "Skip-the-line access to Maria Theresa's glorious summer residence",
    description: "Walk in the footsteps of Emperor Franz Joseph and Empress Sisi. Avoid the massive crowds with our exclusive skip-the-line ticket and explore the gold-gilded baroque apartments and breathtaking hillside gardens.",
    longDescription: "Schönbrunn Palace is Austria's most visited landmark and a UNESCO World Heritage site. This tour grants you instant skip-the-line access, saving you hours of waiting. Our specialized guide will escort you through the Grand Tour of the palace, visiting 40 imperial apartments including Maria Theresa's luxurious quarters, the Hall of Mirrors (where a 6-year-old Mozart performed), and Emperor Franz Joseph's humble writing chamber. Following the palace interior, we step out into the sprawling Baroque gardens. We will climb to the majestic Gloriette monument on the hill for a sweeping panoramic photo of Vienna. Learn the triumphs, tragedies, and day-to-day realities of one of Europe's most influential royal families.",
    price: 65,
    duration: "4 Hours",
    category: "History & Culture",
    groupSize: "Max 10 people",
    rating: 4.8,
    reviewsCount: 38,
    startPoint: "Main Gate of Schönbrunn Palace (Schönbrunner Schloßstraße 47, 1130 Wien)",
    highlights: ["Guaranteed Skip-the-line entrance ticket", "Full Grand Tour of 40 Palace Rooms", "Gloriette Hill panoramic viewpoint", "Sisi's private garden walks", "Baroque Great Parterre", "Stories of Sisi & Franz Joseph"],
    coordinates: { x: 180, y: 450, label: "Schönbrunn Palace" },
    image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "vienna-woods",
    title: "Vienna Woods & Wachau Valley Wine Escape",
    tagline: "Day trip to Austria's most scenic castle and wine region",
    description: "Escape the city bustle for the rolling vineyards of the Wachau Valley. Enjoy premium tastings of Grüner Veltliner wines, visit the breathtaking Melk Abbey, and cruise along the historic Danube river.",
    longDescription: "Immerse yourself in the breathtaking landscapes surrounding Vienna. We journey through the historic Vienna Woods, stopping first at the majestic, fortress-like Melk Benedictine Abbey overlooking the Danube. Afterward, we embark on a premium sightseeing cruise down the winding Danube River (Wachau Valley), passing by medieval castles and dense pine forests. We then head into a scenic wine-growing village for an exclusive tasting of Austrian white wines (including famous local Grüner Veltliner and Riesling) at a traditional, family-owned Austrian tavern (Heuriger). Includes high-end air-conditioned private coach transport, a local wine expert, all tasting flights, and a rustic Austrian lunch platter.",
    price: 110,
    duration: "Full Day (8 Hours)",
    category: "Food & Wine",
    groupSize: "Max 8 people",
    rating: 4.9,
    reviewsCount: 29,
    startPoint: "Vienna State Opera Main Fountain (Opernring 2, 1010 Wien)",
    highlights: ["Premium round-trip coach transportation", "Scenic Wachau Valley Danube Cruise", "Melk Abbey entrance and guided tour", "Guided 4-glass organic wine tasting", "Traditional Austrian tavern lunch", "Breathtaking medieval ruins of Dürnstein"],
    coordinates: { x: 100, y: 150, label: "Wachau Valley & Woods" },
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "mozart-concert",
    title: "Mozart & Strauss Vienna Concert Evening",
    tagline: "An evening of classical Viennese waltz in a historic golden hall",
    description: "Experience the music where the Viennese waltz was born. Enjoy a magical evening listening to timeless masterworks of Wolfgang Amadeus Mozart and Johann Strauss performed by world-class instrumentalists.",
    longDescription: "Vienna is the undisputed world capital of classical music. Spend a gorgeous evening at the historic Kursalon Vienna, a majestic neo-renaissance concert hall where Johann Strauss himself used to direct his orchestra. You'll enjoy premium seating in a grand salon with immaculate acoustics. The Salonorchester Alt Wien will perform the most beloved melodies of Mozart and Strauss, accompanied by international opera singers and graceful ballet soloists. Sip on a glass of fine sparkling Austrian Grüner Veltliner wine during intermission and let yourself be swept away by the timeless romanticism of Vienna's musical golden age.",
    price: 49,
    duration: "2 Hours",
    category: "Music & Arts",
    groupSize: "Seated Concert Hall",
    rating: 4.7,
    reviewsCount: 51,
    startPoint: "Kursalon Vienna Main Foyer (Johannesgasse 33, 1010 Wien)",
    highlights: ["Premium Concert Entrance Ticket (Category B)", "Viennese waltzes, polkas, and operatic duets", "Symphonies of Mozart & Strauss", "Complimentary glass of sparkling Austrian Sekt", "Historic Neo-Renaissance Concert Hall"],
    coordinates: { x: 490, y: 340, label: "Kursalon Concert Hall" },
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "danube-cruise",
    title: "Danube River Evening Sunset Cruise",
    tagline: "Vienna's modern and historic skyline from the water with buffet",
    description: "Sip on a refreshing beverage and watch the lights of Vienna ignite. Cruise down the Danube Canal while indulging in fresh Wiener Schnitzel and traditional local delicacies.",
    longDescription: "As twilight blankets the city, hop aboard our premium, double-decker cruise vessel at Schwedenplatz. We will navigate the historic Danube Canal and transition into the main Danube River, showcasing the captivating contrast between Vienna's old imperial architecture and the glittering, modern skyscrapers of the UN Quarter. While cruising, satisfy your appetite with our hot Viennese Grand Buffet, featuring freshly prepared Wiener Schnitzel, pork roast with potato dumplings, apple strudel, and various seasonal salads. A live traditional accordionist will provide a nostalgic ambient soundtrack to your romantic cruise.",
    price: 55,
    duration: "3 Hours",
    category: "Nature & Sightseeing",
    groupSize: "Max 60 people",
    rating: 4.6,
    reviewsCount: 33,
    startPoint: "Schwedenplatz Boat Terminal, Pier 3 (Franz-Josefs-Kai 2, 1010 Wien)",
    highlights: ["3-hour atmospheric twilight boat cruise", "All-inclusive hot Viennese Grand Buffet", "Stunning sunset views of modern UN Quarter", "Accordion folk music live onboard", "Welcome Austrian drink included"],
    coordinates: { x: 550, y: 200, label: "Schwedenplatz Canal Dock" },
    image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "vienna-food",
    title: "Viennese Culinary Secrets Food Tour",
    tagline: "Taste your way through the Naschmarkt and legendary coffee houses",
    description: "Skip the tourist traps and discover the real culinary soul of Vienna. Taste rich alpine cheeses, savory local sausages, and learn the sacred etiquette of the Viennese coffee house.",
    longDescription: "Viennese cuisine is unique: it is the only national cuisine in the world named after a city! Join our hungry culinary guide on a tasting safari. We begin at the colorful Naschmarkt, Vienna's open-air sensory market. Here we will sample local mountain cheeses, dry-aged hams, and organic Austrian pickles. Next, we visit a secret, historic 'Würstelstand' (sausage stand) for premium cheese-stuffed Käsekrainer sausages. We'll conclude the tour at a traditional, high-ceilinged Viennese coffee house to learn the historical significance of the cafe culture, tasting a slice of legendary Sacher Torte paired with a perfectly brewed 'Melange' coffee. Bring a major appetite!",
    price: 75,
    duration: "3.5 Hours",
    category: "Food & Wine",
    groupSize: "Max 12 people",
    rating: 4.9,
    reviewsCount: 47,
    startPoint: "Naschmarkt Main Entrance, near Karlsplatz Metro Exit (Karlsplatz, 1010 Wien)",
    highlights: ["Passionate culinary expert guide", "10+ food & beverage tastings", "Curated alpine cheese & Austrian dry-cured ham flight", "Hot Käsekrainer sausage and local mustard tasting", "Sachertorte & traditional Melange coffee at a historical cafe", "Austrian chocolate workshop visit"],
    coordinates: { x: 380, y: 390, label: "Naschmarkt Food Haven" },
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80"
  }
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "rev-1",
    tourId: "vienna-classic",
    tourTitle: "Vienna Grand Imperial Walking Tour",
    userName: "Charlotte Dupont",
    rating: 5,
    comment: "This walking tour was the absolute highlight of our trip. Andreas, our guide, was so engaging and passionate. He brought the Hofburg stories to life with incredible humor and depth. Highly recommend doing this on your first day!",
    createdAt: "2026-06-25T14:22:00Z",
    userAvatar: "CD"
  },
  {
    id: "rev-2",
    tourId: "vienna-classic",
    tourTitle: "Vienna Grand Imperial Walking Tour",
    userName: "Markus Schmidt",
    rating: 5,
    comment: "I have lived in Germany for years and visited Vienna multiple times, but this tour taught me so much I never knew! Andreas is a master storyteller. Beautifully structured walking pace.",
    createdAt: "2026-06-28T10:15:00Z",
    userAvatar: "MS"
  },
  {
    id: "rev-3",
    tourId: "vienna-food",
    tourTitle: "Viennese Culinary Secrets Food Tour",
    userName: "James Miller",
    rating: 5,
    comment: "Excellent food tour. The Naschmarkt was overwhelming on our own, but with our guide Elena, we tasted the best local treats and met local stall owners. The Käsekrainer was mind-blowing, and finishing with coffee and Sacher Torte felt like pure heaven. Worth every cent!",
    createdAt: "2026-06-29T16:40:00Z",
    userAvatar: "JM"
  },
  {
    id: "rev-4",
    tourId: "schonbrunn-palace",
    tourTitle: "Schönbrunn Palace & Gardens Explorer",
    userName: "Sarah Jenkins",
    rating: 4,
    comment: "Skip the line is an understatement! The regular ticket queues were hours long, but we walked right in. The rooms are gorgeous, and the climb to the Gloriette gardens was wonderful, though it can be a bit steep if you are walking with elders. Fantastic guide.",
    createdAt: "2026-06-24T11:05:00Z",
    userAvatar: "SJ"
  },
  {
    id: "rev-5",
    tourId: "mozart-concert",
    tourTitle: "Mozart & Strauss Vienna Concert Evening",
    userName: "Alessandro Rossi",
    rating: 5,
    comment: "Magical evening. The acoustics of the Kursalon are incredibly crisp, and the musicians performed with so much energy. The classical dancers added such visual romance. The free glass of Sekt was a lovely touch!",
    createdAt: "2026-06-27T21:30:00Z",
    userAvatar: "AR"
  }
];

const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    title: "The Ultimate Guide to Vienna Coffee House Culture",
    excerpt: "Learn the rich history, local etiquette, and essential coffee drinks to order like a true Viennese local.",
    content: "Vienna's coffee house culture is so legendary that UNESCO has officially designated it as an 'Intangible Cultural Heritage'. But stepping into a historic Viennese cafe like Cafe Central, Cafe Sacher, or Cafe Landtmann can be intimidating for newcomers. First, understand the philosophy: a coffee house is a place 'where time and space are consumed, but only the coffee is found on the bill'. You are encouraged to buy a single coffee, read the newspapers for hours, and never be rushed by the waiters.\n\n### Essential Vienna Coffee Drinks:\n1. **Melange**: The undisputed king. Similar to a cappuccino, it consists of one espresso shot, steamed milk, and a crown of milk foam or whipped cream.\n2. **Einspänner**: A double espresso served in a glass, topped with a generous mountain of cold whipped cream, traditionally dusted with cocoa.\n3. **Kleiner/Großer Brauner**: A single or double espresso shot served with a miniature jug of fresh cream on the side so you can customize the color.\n4. **Verlängerter**: An espresso diluted with hot water to create a milder, longer drink.\n\n### Coffee House Etiquette:\n- **Don't rush**: When you finish your coffee, you can stay. The waiter (traditionally called 'Herr Ober') will serve you a glass of cold tap water with a spoon balanced across the rim. This water is meant to cleanse your palate between sips.\n- **Cash is King**: While many modern establishments accept credit cards, historic cafes still highly prefer cash. Always keep some coins for tipping!",
    date: "2026-06-15",
    author: "Elena Petrova",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    readTime: "5 min read",
    category: "Food & Culture",
    comments: [
      { id: "c-1", userName: "Emily Watson", comment: "This was incredibly helpful! I was so afraid of ordering wrong, but I tried the Melange at Cafe Central today and it was wonderful.", createdAt: "2026-06-18T09:15:00Z" }
    ]
  },
  {
    id: "blog-2",
    title: "How to See Vienna in 3 Days: A Perfect Itinerary",
    excerpt: "Maximize your trip with our step-by-step 72-hour itinerary covering imperial palaces, museums, and local taverns.",
    content: "Three days is the perfect duration to fall in love with Vienna. This step-by-step itinerary blends majestic Habsburg history, legendary art collections, and cozy local culinary hideouts.\n\n### Day 1: Imperial Core & Classical Splendor\n- **Morning**: Start at **Stephansplatz** and climb the South Tower of St. Stephen's Cathedral for spectacular views. Walk down the luxury Kohlmarkt and Graben streets.\n- **Lunch**: Enjoy a traditional Austrian Tafelspitz at Plachutta or grab a quick 'Trzesniewski' open-faced sandwich.\n- **Afternoon**: Explore the **Hofburg Imperial Palace**, including the Sisi Museum and Imperial Apartments. Catch the Lipizzaner stallions resting in their stables.\n- **Evening**: Dress up for a romantic Mozart and Strauss Classical Concert or catch an opera at the Vienna State Opera.\n\n### Day 2: Baroque Sensation & Sisi's Summer Home\n- **Morning**: Take the U4 subway line straight to **Schönbrunn Palace**. Dedicate 3-4 hours to touring the palace rooms and walking up to the Gloriette view.\n- **Lunch**: Try an imperial Strudel Show in the Schönbrunn bakery.\n- **Afternoon**: Visit the **Belvedere Palace** to stand face-to-face with Gustav Klimt's famous masterpiece, *The Kiss*.\n- **Evening**: Ride the historic Giant Ferris Wheel at the **Prater Amusement Park** for sunset views.\n\n### Day 3: Masterpieces, Markets & Wine\n- **Morning**: Walk through the vibrant stalls of the **Naschmarkt**, tasting local cheeses and dried fruits.\n- **Afternoon**: Discover modern art and architecture at the **Hundertwasserhaus** or tour the Museumsquartier (MQ).\n- **Evening**: Head out to the wine-growing suburb of **Grinzing** for a traditional dinner at a rustic 'Heuriger' tavern, sipping young white wine.",
    date: "2026-06-20",
    author: "Andreas Wagner",
    image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80",
    readTime: "8 min read",
    category: "Itineraries",
    comments: []
  },
  {
    id: "blog-3",
    title: "Secret Spots in Vienna Tourists Always Miss",
    excerpt: "Ditch the crowds and explore these hidden gothic courtyards, subterranean Roman ruins, and cozy neighborhood cafes.",
    content: "While Schönbrunn and the Opera House are stunning, Vienna's true magic often hides in plain sight. Here are four secret spots where you can escape the tourist herds and experience the authentic Viennese charm.\n\n### 1. The Gothic Courtyards of Blutgasse\nJust a two-minute walk behind St. Stephen's Cathedral lies the historic 'Blutgasse' (Blood Lane) district. Enter the heavy wooden doors of the inner courtyards. You will find beautiful cobblestones, cascading ivy, and 17th-century wooden galleries ('Pawlatschen') that make you feel like you stepped back into Mozart's era.\n\n### 2. The Roman Ruins at Michaelerplatz\nRight in front of the Hofburg Palace main dome, look down into the open-air excavation pit. Here lie the ancient stone foundations of a Roman legionary garrison (Vindobona) dating back nearly 2,000 years, alongside medieval foundations.\n\n### 3. Vienna's Municipal Vineyards on Nussberg\nMost tourists visit wine taverns in Grinzing, but the true locals hike up the **Nussberg Hill** during sunny weekends. Sit directly amidst the grapevines at a 'Buschenschank' (pop-up outdoor wine table), ordering a glass of cold Wiener Gemischter Satz and enjoying breathtaking views over the Danube River.\n\n### 4. The Setagaya Japanese Garden\nLocated in Döbling, this hidden 4,000-square-meter garden is an absolute oasis of tranquility, designed by Japanese landscaper Ken Nakajima. It features tranquil waterfalls, a tea house, stone lanterns, and dense groves of cherry blossoms.",
    date: "2026-06-24",
    author: "Elena Petrova",
    image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80",
    readTime: "6 min read",
    category: "Hidden Gems",
    comments: []
  }
];

// In-Memory Database State
let dbState = {
  tours: DEFAULT_TOURS,
  reviews: DEFAULT_REVIEWS,
  blogs: DEFAULT_BLOGS,
  bookings: [] as Booking[],
  inquiries: [] as ContactInquiry[],
  emails: [] as EmailLog[]
};

// Load Database from file if exists
function loadDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      // Merge with default values if certain tables are missing
      dbState = {
        tours: parsed.tours || DEFAULT_TOURS,
        reviews: parsed.reviews || DEFAULT_REVIEWS,
        blogs: parsed.blogs || DEFAULT_BLOGS,
        bookings: parsed.bookings || [],
        inquiries: parsed.inquiries || [],
        emails: parsed.emails || []
      };
      console.log("Vienna database successfully loaded from storage.");
    } catch (err) {
      console.error("Error reading database file, using defaults:", err);
    }
  } else {
    saveDB();
    console.log("Vienna database initialized with seed data.");
  }
}

// Save Database to file
function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

loadDB();

// Helper to log simulated email
function logSimulatedEmail(to: string, subject: string, body: string, type: EmailLog['type']) {
  const newEmail: EmailLog = {
    id: `EML-${Math.floor(100000 + Math.random() * 900000)}`,
    to,
    subject,
    body,
    sentAt: new Date().toISOString(),
    type
  };
  dbState.emails.unshift(newEmail);
  saveDB();
  return newEmail;
}

// API Routes

// 1. Tours
app.get("/api/tours", (req, res) => {
  res.json(dbState.tours);
});

app.get("/api/tours/:id", (req, res) => {
  const tour = dbState.tours.find(t => t.id === req.params.id);
  if (tour) {
    res.json(tour);
  } else {
    res.status(404).json({ error: "Tour not found" });
  }
});

// 2. Reviews
app.get("/api/reviews", (req, res) => {
  res.json(dbState.reviews);
});

app.post("/api/reviews", (req, res) => {
  const { tourId, userName, rating, comment } = req.body;
  if (!userName || !rating || !comment) {
    return res.status(400).json({ error: "Please fill out all review fields." });
  }

  const tour = dbState.tours.find(t => t.id === tourId);
  const tourTitle = tour ? tour.title : "General Agency Review";

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    tourId: tourId || "general",
    tourTitle,
    userName,
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString(),
    userAvatar: userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2) || "U"
  };

  dbState.reviews.unshift(newReview);

  // Recalculate tour average rating if it's tied to a specific tour
  if (tourId && tourId !== "general" && tour) {
    const tourReviews = dbState.reviews.filter(r => r.tourId === tourId);
    const avgRating = tourReviews.reduce((sum, r) => sum + r.rating, 0) / tourReviews.length;
    tour.rating = Number(avgRating.toFixed(1));
    tour.reviewsCount = tourReviews.length;
  }

  saveDB();
  res.status(201).json(newReview);
});

// 3. Bookings & Payments
app.get("/api/bookings", (req, res) => {
  res.json(dbState.bookings);
});

app.post("/api/bookings", (req, res) => {
  const { tourId, bookingDate, bookingTime, fullName, email, phone, guests, cardNumber, promoCode } = req.body;

  if (!tourId || !bookingDate || !bookingTime || !fullName || !email || !phone || !guests) {
    return res.status(400).json({ error: "Missing required booking details." });
  }

  const tour = dbState.tours.find(t => t.id === tourId);
  if (!tour) {
    return res.status(404).json({ error: "Selected tour does not exist." });
  }

  // Calculate price
  let basePrice = tour.price;
  let totalAmount = basePrice * Number(guests);

  // Simulated Coupon Discount
  let discountApplied = 0;
  if (promoCode && promoCode.toUpperCase() === "VIENNA15") {
    discountApplied = totalAmount * 0.15;
    totalAmount = Number((totalAmount - discountApplied).toFixed(2));
  } else if (promoCode && promoCode.toUpperCase() === "WELCOMETOWIEN") {
    discountApplied = totalAmount * 0.10;
    totalAmount = Number((totalAmount - discountApplied).toFixed(2));
  }

  const bookingId = `VIE-${Math.floor(100000 + Math.random() * 900000)}`;
  const cardLast4 = cardNumber ? cardNumber.slice(-4) : "4242";

  const newBooking: Booking = {
    id: bookingId,
    tourId,
    tourTitle: tour.title,
    tourPrice: tour.price,
    bookingDate,
    bookingTime,
    fullName,
    email,
    phone,
    guests: Number(guests),
    totalAmount,
    status: 'confirmed', // immediately auto-confirmed for premium feel
    createdAt: new Date().toISOString(),
    paymentStatus: 'paid', // integrated payment gateway simulation
    cardLast4,
    promoCode: promoCode || undefined
  };

  dbState.bookings.unshift(newBooking);
  saveDB();

  // Trigger simulated client email notification
  const clientEmailBody = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
      <div style="background-color: #8B1E3F; color: #ffffff; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px;">TOURS IN VIENNA</h1>
        <p style="margin: 4px 0 0 0; opacity: 0.8; font-size: 14px;">Your Premium Imperial Experience</p>
      </div>
      <div style="padding: 32px; background-color: #FCFBF7;">
        <h2 style="color: #8B1E3F; font-size: 20px; font-weight: 400; margin-top: 0;">Booking Confirmed!</h2>
        <p>Dear ${fullName},</p>
        <p>Thank you for choosing <strong>Tours in Vienna</strong>. We are thrilled to confirm your booking! Your payment has been processed successfully via our secure checkout gateway.</p>
        
        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin: 24px 0;">
          <h3 style="margin-top: 0; font-size: 16px; border-bottom: 1px solid #f3f4f6; padding-bottom: 8px; color: #8B1E3F;">Receipt / Ticket Details</h3>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Booking ID:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right;">${bookingId}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Tour Name:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right; color: #8B1E3F;">${tour.title}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Date & Time:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right;">${bookingDate} at ${bookingTime}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Guest Count:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right;">${guests} travelers</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280;">Payment Method:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right;">Card ending in *${cardLast4}</td>
            </tr>
            <tr style="border-top: 1px solid #f3f4f6;">
              <td style="padding: 12px 0 0 0; font-weight: bold; font-size: 16px; color: #1a1a1a;">Total Paid:</td>
              <td style="padding: 12px 0 0 0; font-weight: bold; font-size: 18px; text-align: right; color: #8B1E3F;">€${totalAmount.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <h3 style="font-size: 16px; font-weight: 500; margin-top: 24px; color: #1a1a1a;">Meeting Instructions:</h3>
        <p style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px; font-size: 14px; border-radius: 4px; color: #78350f;">
          <strong>Meeting Point:</strong> ${tour.startPoint}<br/>
          Please arrive <strong>10 minutes prior</strong> to the scheduled departure time. Your local guide will be wearing our official burgundy "Tours in Vienna" uniform and carrying an imperial badge.
        </p>
        
        <p style="margin-top: 24px;">If you need to make any changes or have questions, feel free to reply directly to this email or initiate a live chat support session on our website using your Booking ID.</p>
        <p>We look forward to introducing you to the magic of Vienna!</p>
        
        <p style="margin-bottom: 0;">Warm regards,<br/><strong>The Tours in Vienna Team</strong><br/>Schlettergasse 3/9/10, 1220 Wien</p>
      </div>
      <div style="background-color: #f3f4f6; color: #6b7280; padding: 16px; text-align: center; font-size: 12px; border-top: 1px solid #e5e7eb;">
        This is a simulated email confirmation representing our live booking system integration.<br/>
        &copy; 2026 Tours in Vienna. All rights reserved.
      </div>
    </div>
  `;

  // Trigger simulated admin email notification
  const adminEmailBody = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 24px;">
      <h2 style="color: #8B1E3F; border-bottom: 2px solid #8B1E3F; padding-bottom: 10px; margin-top: 0;">ALERT: New Tour Booking Received</h2>
      <p style="font-size: 15px;">Hey Admin, a new booking has been recorded on the Tours in Vienna website!</p>
      
      <div style="background-color: #f9f9f9; border-radius: 6px; padding: 16px; margin: 16px 0; font-size: 14px; line-height: 1.6;">
        <strong>Booking ID:</strong> ${bookingId}<br/>
        <strong>Customer:</strong> ${fullName}<br/>
        <strong>Email:</strong> ${email}<br/>
        <strong>Phone:</strong> ${phone}<br/>
        <strong>Tour Title:</strong> ${tour.title}<br/>
        <strong>Date & Time:</strong> ${bookingDate} at ${bookingTime}<br/>
        <strong>Guests:</strong> ${guests} people<br/>
        <strong>Total Amount:</strong> €${totalAmount.toFixed(2)} (Paid with *${cardLast4})<br/>
        <strong>Promo Code Applied:</strong> ${promoCode || "None"}<br/>
      </div>
      
      <p style="font-size: 13px; color: #666;">Actions to take:<br/>
      1. Assign a licensed guide for ${bookingDate}.<br/>
      2. Ensure meeting point materials are prepared.<br/>
      3. Booking added automatically to Analytics and Calendar dashboards.
      </p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
      <p style="font-size: 11px; text-align: center; color: #999;">Tours in Vienna Admin Dashboard &bull; Schlettergasse 3/9/10, 1220 Wien</p>
    </div>
  `;

  logSimulatedEmail(email, `Your Booking Ticket: ${tour.title} (VIE-${bookingId})`, clientEmailBody, 'client_booking');
  logSimulatedEmail("office@toursinvienna.at", `NEW BOOKING: ${fullName} - ${tour.title} (VIE-${bookingId})`, adminEmailBody, 'admin_booking');

  res.status(201).json({
    success: true,
    message: "Booking successfully secured!",
    booking: newBooking
  });
});

// 4. Contact / Inquiries
app.get("/api/inquiries", (req, res) => {
  res.json(dbState.inquiries);
});

app.post("/api/inquiries", (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Please fill out all contact fields." });
  }

  const newInquiry: ContactInquiry = {
    id: `INQ-${Math.floor(100000 + Math.random() * 900000)}`,
    name,
    email,
    subject,
    message,
    createdAt: new Date().toISOString(),
    status: 'unread'
  };

  dbState.inquiries.unshift(newInquiry);
  saveDB();

  // Simulated auto-reply to client
  const clientAutoReplyHTML = `
    <div style="font-family: sans-serif; max-width: 550px; margin: 0 auto; border: 1px solid #eaebed; border-radius: 6px; padding: 24px;">
      <div style="text-align: center; border-bottom: 1px solid #eaebed; padding-bottom: 16px;">
        <span style="font-size: 18px; font-weight: bold; color: #8B1E3F; letter-spacing: 1px;">TOURS IN VIENNA</span>
      </div>
      <p>Dear ${name},</p>
      <p>Thank you for reaching out to <strong>Tours in Vienna</strong>. We have received your inquiry regarding <strong>"${subject}"</strong>.</p>
      <p>Our dedicated local staff is currently reviewing your message and will respond with detailed information within 24 business hours. If your request is urgent, you can call us directly at <strong>+43 664 4126911</strong> or use our live chat support on the website.</p>
      
      <div style="background-color: #f7f7f9; padding: 12px; border-radius: 4px; font-style: italic; font-size: 14px; color: #555; margin: 16px 0;">
        "Lorem ipsum" of your message:<br/>
        "${message}"
      </div>
      
      <p>Thank you for your patience, and we look forward to greeting you soon in our beautiful imperial capital!</p>
      <p>Best regards,<br/><strong>Vienna Tours Support Team</strong></p>
    </div>
  `;

  // Simulated alert to admin
  const adminInquiryAlertHTML = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ccc; padding: 20px;">
      <h3 style="color: #D4AF37; margin-top:0;">URGENT: New Website Inquiry</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 4px; font-weight: bold; width: 100px;">Name:</td>
          <td style="padding: 4px;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 4px; font-weight: bold;">Email:</td>
          <td style="padding: 4px;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 4px; font-weight: bold;">Subject:</td>
          <td style="padding: 4px;">${subject}</td>
        </tr>
        <tr>
          <td style="padding: 4px; font-weight: bold; vertical-align: top;">Message:</td>
          <td style="padding: 4px; background: #fdfdfd; border: 1px solid #f0f0f0; border-radius: 4px;">${message}</td>
        </tr>
      </table>
      <p style="font-size:12px; color:#777; margin-top:20px;">Please respond to this inquiry from the admin workspace console.</p>
    </div>
  `;

  logSimulatedEmail(email, `We have received your message: ${subject}`, clientAutoReplyHTML, 'client_inquiry');
  logSimulatedEmail("office@toursinvienna.at", `NEW INQUIRY: [${subject}] from ${name}`, adminInquiryAlertHTML, 'admin_inquiry');

  res.status(201).json({
    success: true,
    message: "Inquiry registered and notification logs sent!",
    inquiry: newInquiry
  });
});

// 5. Blog comments
app.get("/api/blog", (req, res) => {
  res.json(dbState.blogs);
});

app.post("/api/blog/:id/comment", (req, res) => {
  const { userName, comment } = req.body;
  if (!userName || !comment) {
    return res.status(400).json({ error: "Name and comment fields are required." });
  }

  const blog = dbState.blogs.find(b => b.id === req.params.id);
  if (!blog) {
    return res.status(404).json({ error: "Blog post not found" });
  }

  const newComment = {
    id: `c-${Date.now()}`,
    userName,
    comment,
    createdAt: new Date().toISOString()
  };

  blog.comments.push(newComment);
  saveDB();

  res.status(201).json(newComment);
});

// 6. Emails list (for Admin Box)
app.get("/api/emails", (req, res) => {
  res.json(dbState.emails);
});

// 7. Chat endpoint using server-side Gemini AI API or high-quality rule fallback
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  const systemInstruction = `
    You are Franz, the dedicated AI Travel Concierge for "Tours in Vienna" (Tourismusbüro Wien).
    You speak in a warm, helpful, charming, and highly professional manner to global tourists.
    
    Agency details:
    - Business Name: Tours in Vienna
    - Address: Schlettergasse 3/9/10, 1220 Wien, Austria
    - Phone: +43 664 4126911
    - Status: Rated 5.0 on Google Reviews (5.01 average)
    - Office Hours: Mon-Fri 8am-6pm, Sat 9am-4pm, Sun Closed.
    
    Our Curated Tours & Experiences:
    1. "Vienna Grand Imperial Walking Tour": €35 per person, duration 3 hours, start Stephansplatz cathedral entrance.
    2. "Schönbrunn Palace & Gardens Explorer": €65 per person, includes skip-the-line group tickets, 4 hours.
    3. "Vienna Woods & Wachau Valley Wine Escape": €110 per person, full day (8h), coach transport, Danube cruise, wine tasting flight, tavern lunch.
    4. "Mozart & Strauss Vienna Concert Evening": €49, historical Kursalon concert, free Sekt sparkling wine, 2 hours.
    5. "Danube River Evening Sunset Cruise": €55, double-decker boat Schwedenplatz, Viennese buffet, sunset views, live accordion music.
    6. "Viennese Culinary Secrets Food Tour": €75, Naschmarkt market samples, Käsekrainer sausage, café cake & Melange coffee.

    General Guidance:
    - Answer tourist questions about Vienna's top landmarks (Hofburg, Schönbrunn, Sisi, Prater Ferris Wheel, Belvedere Palace with Gustav Klimt's Kiss artwork).
    - Give suggestions on local culinary secrets: Schnitzel, Tafelspitz, Apfelstrudel, Sacher Torte, and legendary café house etiquettes (like how coffee is always served with a spoon and cold water).
    - Keep responses elegant, polite, and concise (under 3 or 4 short paragraphs).
    - Seamlessly prompt the customer to book their tickets directly on our website! Mention we have coupons like "VIENNA15" (15% off) or "WELCOMETOWIEN" (10% off).
    - Do NOT ever invent or use other contact details or other pricing. Keep all information 100% correct.
  `;

  // If Gemini client is ready, let's call it!
  if (ai) {
    try {
      // Re-map history from { sender: 'user' | 'assistant', text: string } to Gemini structure
      const formattedContents = [];
      if (history && Array.isArray(history)) {
        for (const chatTurn of history) {
          formattedContents.push({
            role: chatTurn.sender === "user" ? "user" : "model",
            parts: [{ text: chatTurn.text }]
          });
        }
      }
      formattedContents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text || "I am processing your inquiry and will be delighted to guide you shortly. How can Franz assist your Vienna itinerary further?";
      return res.json({ text: reply });

    } catch (err: any) {
      console.error("Gemini Generation Error:", err);
      // Fallback if Gemini rate-limited or failed
    }
  }

  // Smart Rule-based local fallback in case Gemini API is not configured or fails
  const lowercaseMsg = message.toLowerCase();
  let reply = "";

  if (lowercaseMsg.includes("hello") || lowercaseMsg.includes("hi") || lowercaseMsg.includes("hey")) {
    reply = "Guten Tag! Welcome to Vienna. I am Franz, your virtual imperial concierge from **Tours in Vienna**. How may I assist your travel or tour booking today?";
  } else if (lowercaseMsg.includes("price") || lowercaseMsg.includes("cost") || lowercaseMsg.includes("how much")) {
    reply = "We offer experiences for every budget! Our prices range from **€35** for the historic Walking Tour up to **€110** for the all-inclusive full-day Wachau Wine Country Escape. You can check individual rates, reviews, and book instantly on our Tour Directory. Enter code **VIENNA15** at checkout for a fabulous 15% discount!";
  } else if (lowercaseMsg.includes("palace") || lowercaseMsg.includes("schönbrunn") || lowercaseMsg.includes("sisi")) {
    reply = "Ah, the imperial grandeur! Our **Schönbrunn Palace & Gardens Explorer** is an absolute must-see. It's priced at €65 and includes guaranteed skip-the-line entrance tickets, a guided tour of the 40 imperial apartments, and a walk up the Gloriette gardens with Franz. The tour lasts 4 hours. Would you like me to help you book tickets?";
  } else if (lowercaseMsg.includes("food") || lowercaseMsg.includes("eat") || lowercaseMsg.includes("schnitzel") || lowercaseMsg.includes("coffee") || lowercaseMsg.includes("wine")) {
    reply = "Viennese food is pure art! I highly recommend our **Viennese Culinary Secrets Food Tour** (€75) which visits the Naschmarkt for cheese/ham tastings and finishes at a classic coffee house for Melange and Sacher Torte. If you love wine, our full-day **Wachau Valley Wine Escape** (€110) features premium tastings at an authentic Austrian wine tavern (Heuriger).";
  } else if (lowercaseMsg.includes("concert") || lowercaseMsg.includes("music") || lowercaseMsg.includes("mozart") || lowercaseMsg.includes("strauss")) {
    reply = "Vienna is the capital of classical music! Our **Mozart & Strauss Vienna Concert Evening** (€49) takes place in the golden Neo-Renaissance halls of the historic Kursalon Vienna. It includes Category B seating, beautiful waltzes, polkas, opera singers, and a complimentary glass of sparkling Sekt wine. Truly a magical romantic evening!";
  } else if (lowercaseMsg.includes("discount") || lowercaseMsg.includes("coupon") || lowercaseMsg.includes("promo")) {
    reply = "How wonderful! We have two special promotions active: use coupon code **VIENNA15** during payment for a **15% discount**, or **WELCOMETOWIEN** for a **10% discount** on any imperial tour booking on our site!";
  } else if (lowercaseMsg.includes("contact") || lowercaseMsg.includes("address") || lowercaseMsg.includes("phone") || lowercaseMsg.includes("email") || lowercaseMsg.includes("location")) {
    reply = "Our head office is located at **Schlettergasse 3/9/10, 1220 Wien, Austria**. You can phone our friendly desk at **+43 664 4126911** or email us at **office@toursinvienna.at**. We are open Mon-Fri 8am-6pm and Saturday 9am-4pm. You can also send us an inquiry directly through our Contact form!";
  } else {
    reply = "That is a wonderful question about Vienna! As your virtual concierge, I highly recommend exploring our tailored tours: we have walking tours (€35), Schönbrunn palace skip-the-line tours (€65), river sunset cruises with a Viennese buffet (€55), food coffee house walks (€75), and romantic classical waltz concerts (€49). You can book online instantly with secure payments and 100% money-back guarantee. Is there a particular experience you'd like to reserve?";
  }

  setTimeout(() => {
    res.json({ text: reply });
  }, 400);
});

// 8. Analytics Data
app.get("/api/analytics", (req, res) => {
  const totalBookings = dbState.bookings.length;
  const totalRevenue = dbState.bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalReviews = dbState.reviews.length;
  const averageRating = Number((dbState.reviews.reduce((sum, r) => sum + r.rating, 0) / (totalReviews || 1)).toFixed(2));
  const totalInquiries = dbState.inquiries.length;

  // Calculate top selling tours
  const tourSales: Record<string, number> = {};
  DEFAULT_TOURS.forEach(t => { tourSales[t.title] = 0; });
  dbState.bookings.forEach(b => {
    tourSales[b.tourTitle] = (tourSales[b.tourTitle] || 0) + b.guests;
  });

  const topTours = Object.entries(tourSales).map(([name, sales]) => ({ name, sales })).sort((a, b) => b.sales - a.sales);

  // Hardcoded simulated visits to calculate a realistic conversion rate
  const simulatedVisits = 1450 + totalBookings * 12;
  const conversionRate = Number(((totalBookings / simulatedVisits) * 100).toFixed(2));

  // Simulated booking history chart data
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const bookingChart = monthNames.map((month, i) => {
    // Generate organic-looking curve with peak in summer (Vienna travel season)
    const baseRev = [1200, 1800, 2400, 3900, 5200, 6800, 7200][i];
    const realBookingsThisMonth = dbState.bookings.filter(b => {
      const bMonth = new Date(b.createdAt).getMonth();
      return bMonth === (i + 5) % 12; // align to realistic summer logs
    });
    const extraRev = realBookingsThisMonth.reduce((sum, b) => sum + b.totalAmount, 0);
    return {
      month,
      Revenue: baseRev + extraRev,
      Bookings: Math.round((baseRev + extraRev) / 60)
    };
  });

  // Action logs representing live telemetry activities for admin audit logs
  const actionLogs = [];
  
  // Convert real bookings into log events
  dbState.bookings.slice(0, 10).forEach(b => {
    actionLogs.push({
      id: b.id,
      timestamp: b.createdAt,
      message: `Confirmed Booking ${b.id} for "${b.fullName}" (${b.guests} travelers on ${b.tourTitle})`,
      tag: "booking",
      amount: b.totalAmount
    });
  });

  // Convert real reviews into log events
  dbState.reviews.slice(0, 10).forEach(r => {
    actionLogs.push({
      id: r.id,
      timestamp: r.createdAt,
      message: `New User Review by "${r.userName}" on "${r.tourTitle}" (${r.rating}★)`,
      tag: "review",
      amount: 0
    });
  });

  // Convert real inquiries into log events
  dbState.inquiries.slice(0, 10).forEach(inq => {
    actionLogs.push({
      id: inq.id,
      timestamp: inq.createdAt,
      message: `Inquiry Submitted by "${inq.name}" on: "${inq.subject}"`,
      tag: "inquiry",
      amount: 0
    });
  });

  // Sort logs by time descending
  actionLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  res.json({
    metrics: {
      totalBookings,
      totalRevenue,
      totalReviews,
      averageRating,
      totalInquiries,
      conversionRate,
      simulatedVisits
    },
    topTours,
    bookingChart,
    actionLogs: actionLogs.slice(0, 15) // limit to 15 entries
  });
});

// Vite Middleware & SPA Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Tours in Vienna fullstack server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
