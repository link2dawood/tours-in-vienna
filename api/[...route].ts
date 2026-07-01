import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import path from 'path';
import fs from 'fs';

const DB_FILE = path.join(process.cwd(), 'vienna_data.json');
const distPath = path.join(process.cwd(), 'dist');

// Function that handles requests  
const handler = async (req: VercelRequest, res: VercelResponse) => {
  const app = express();
  app.use(express.json());

  // Load database
  let database: any = {};
  if (fs.existsSync(DB_FILE)) {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    database = JSON.parse(data);
  }

  // API Routes
  app.get("/api/tours", (req, res) => {
    res.json(database.tours || []);
  });

  app.get("/api/tours/:id", (req, res) => {
    const tour = (database.tours || []).find((t: any) => t.id === req.params.id);
    res.json(tour || { error: "Tour not found" });
  });

  app.get("/api/reviews", (req, res) => {
    res.json(database.reviews || []);
  });

  app.post("/api/reviews", (req, res) => {
    const newReview = req.body;
    if (!database.reviews) database.reviews = [];
    database.reviews.push(newReview);
    fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2));
    res.json({ success: true, review: newReview });
  });

  app.get("/api/bookings", (req, res) => {
    res.json(database.bookings || []);
  });

  app.post("/api/bookings", (req, res) => {
    const newBooking = req.body;
    if (!database.bookings) database.bookings = [];
    database.bookings.push(newBooking);
    fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2));
    res.json({ success: true, booking: newBooking });
  });

  app.get("/api/inquiries", (req, res) => {
    res.json(database.inquiries || []);
  });

  app.post("/api/inquiries", (req, res) => {
    const newInquiry = req.body;
    if (!database.inquiries) database.inquiries = [];
    database.inquiries.push(newInquiry);
    fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2));
    res.json({ success: true, inquiry: newInquiry });
  });

  app.get("/api/blog", (req, res) => {
    res.json(database.blogs || []);
  });

  app.post("/api/blog/:id/comment", (req, res) => {
    const blogId = req.params.id;
    const blog = (database.blogs || []).find((b: any) => b.id === blogId);
    if (blog) {
      if (!blog.comments) blog.comments = [];
      blog.comments.push(req.body);
      fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2));
      res.json({ success: true, blog });
    } else {
      res.json({ error: "Blog not found" });
    }
  });

  app.get("/api/emails", (req, res) => {
    res.json(database.emailLogs || []);
  });

  app.get("/api/analytics", (req, res) => {
    res.json({
      totalTours: (database.tours || []).length,
      totalBookings: (database.bookings || []).length,
      totalReviews: (database.reviews || []).length,
      totalInquiries: (database.inquiries || []).length,
    });
  });

  // Serve static files
  if (req.url.startsWith("/api")) {
    app(req, res);
  } else {
    // Serve React app
    const filePath = path.join(distPath, req.url === "/" ? "index.html" : req.url);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const contentType = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
      }[ext] || 'application/octet-stream';
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', ext === '.html' ? 'no-cache' : 'public, max-age=3600');
      return res.send(fs.readFileSync(filePath));
    } else {
      // SPA: serve index.html for non-existent routes
      res.setHeader('Content-Type', 'text/html');
      return res.send(fs.readFileSync(path.join(distPath, 'index.html')));
    }
  }
};

export default handler;
