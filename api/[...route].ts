import type { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';
import fs from 'fs';

const DB_FILE = path.join(process.cwd(), 'vienna_data.json');
const distPath = path.join(process.cwd(), 'dist');

// Load database helper
function loadDatabase() {
  if (fs.existsSync(DB_FILE)) {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  }
  return {};
}

// Save database helper
function saveDatabase(database: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2));
}

const handler = async (req: VercelRequest, res: VercelResponse) => {
  const pathname = new URL(req.url || '', 'http://localhost').pathname;
  
  // API routes
  if (pathname.startsWith('/api/')) {
    const database = loadDatabase();
    
    if (pathname === '/api/tours' && req.method === 'GET') {
      return res.json(database.tours || []);
    }
    
    if (pathname.match(/^\/api\/tours\/[^/]+$/) && req.method === 'GET') {
      const id = pathname.split('/').pop();
      const tour = (database.tours || []).find((t: any) => t.id === id);
      return res.json(tour || { error: 'Tour not found' });
    }
    
    if (pathname === '/api/reviews' && req.method === 'GET') {
      return res.json(database.reviews || []);
    }
    
    if (pathname === '/api/reviews' && req.method === 'POST') {
      if (!database.reviews) database.reviews = [];
      database.reviews.push(req.body);
      saveDatabase(database);
      return res.json({ success: true, review: req.body });
    }
    
    if (pathname === '/api/bookings' && req.method === 'GET') {
      return res.json(database.bookings || []);
    }
    
    if (pathname === '/api/bookings' && req.method === 'POST') {
      if (!database.bookings) database.bookings = [];
      database.bookings.push(req.body);
      saveDatabase(database);
      return res.json({ success: true, booking: req.body });
    }
    
    if (pathname === '/api/inquiries' && req.method === 'GET') {
      return res.json(database.inquiries || []);
    }
    
    if (pathname === '/api/inquiries' && req.method === 'POST') {
      if (!database.inquiries) database.inquiries = [];
      database.inquiries.push(req.body);
      saveDatabase(database);
      return res.json({ success: true, inquiry: req.body });
    }
    
    if (pathname === '/api/blog' && req.method === 'GET') {
      return res.json(database.blogs || []);
    }
    
    if (pathname.match(/^\/api\/blog\/[^/]+\/comment$/) && req.method === 'POST') {
      const blogId = pathname.split('/')[3];
      const blog = (database.blogs || []).find((b: any) => b.id === blogId);
      if (blog) {
        if (!blog.comments) blog.comments = [];
        blog.comments.push(req.body);
        saveDatabase(database);
        return res.json({ success: true, blog });
      }
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    if (pathname === '/api/emails' && req.method === 'GET') {
      return res.json(database.emailLogs || []);
    }
    
    if (pathname === '/api/analytics' && req.method === 'GET') {
      return res.json({
        totalTours: (database.tours || []).length,
        totalBookings: (database.bookings || []).length,
        totalReviews: (database.reviews || []).length,
        totalInquiries: (database.inquiries || []).length,
      });
    }
    
    return res.status(404).json({ error: 'Not found' });
  }
  
  // Serve static files for React app
  const filePath = path.join(distPath, pathname === '/' ? 'index.html' : pathname);
  
  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const contentTypes: Record<string, string> = {
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
      };
      
      res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
      if (ext !== '.html') {
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }
      return res.send(fs.readFileSync(filePath));
    }
  } catch (e) {
    // Fallback to index.html for SPA routing
  }
  
  // SPA fallback: serve index.html for all other routes
  res.setHeader('Content-Type', 'text/html');
  return res.send(fs.readFileSync(path.join(distPath, 'index.html')));
};

export default handler;
