import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("subshare.db");
const JWT_SECRET = process.env.JWT_SECRET || "subshare-secret-key";
const CHARIOW_API_KEY = process.env.CHARIOW_API_KEY || "sk_cip3xc30_6c10e3b723293fd1c76a0c1891200b68";
const CHARIOW_STORE_ID = process.env.CHARIOW_STORE_ID || "store_9ixgbrnro795";
const CHARIOW_BASE_URL = "https://api.chariow.com/v1";

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    total_price REAL NOT NULL,
    slots_total INTEGER NOT NULL,
    slots_available INTEGER NOT NULL,
    description TEXT,
    logo_url TEXT,
    owner_id INTEGER NOT NULL,
    chariow_product_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS group_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscription_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, active, expired
    chariow_order_id TEXT,
    payment_status TEXT DEFAULT 'unpaid', -- unpaid, paid, failed
    next_renewal_date DATETIME,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscription_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    target_user_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (target_user_id) REFERENCES users(id),
    FOREIGN KEY (author_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subscription_id INTEGER NOT NULL,
    chariow_order_id TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
  );
`);

// Helper to add columns if they don't exist (for existing DBs)
try {
  db.exec("ALTER TABLE subscriptions ADD COLUMN chariow_product_id TEXT;");
} catch (e) {}
try {
  db.exec("ALTER TABLE group_members ADD COLUMN chariow_order_id TEXT;");
  db.exec("ALTER TABLE group_members ADD COLUMN payment_status TEXT DEFAULT 'unpaid';");
  db.exec("ALTER TABLE group_members ADD COLUMN next_renewal_date DATETIME;");
} catch (e) {}

// Chariow Service Helpers
const chariowRequest = async (endpoint: string, options: any = {}) => {
  const url = `${CHARIOW_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${CHARIOW_API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    console.error("Chariow API Error:", data);
    throw new Error(data.message || "Chariow API Error");
  }
  return data;
};

const chariowService = {
  createProduct: async (name: string, description: string, amount: number) => {
    return chariowRequest("/products", {
      method: "POST",
      body: JSON.stringify({
        store_id: CHARIOW_STORE_ID,
        name,
        description,
        amount: Math.round(amount * 100), // Convert to cents
        currency: "EUR",
        type: "digital"
      }),
    });
  },
  createOrder: async (productId: string, customerEmail: string, metadata: any = {}) => {
    return chariowRequest("/orders", {
      method: "POST",
      body: JSON.stringify({
        store_id: CHARIOW_STORE_ID,
        product_id: productId,
        customer_email: customerEmail,
        metadata,
        redirect_url: `${process.env.APP_URL}/dashboard/subscriptions?success=true`,
        cancel_url: `${process.env.APP_URL}/dashboard/subscriptions?cancel=true`
      }),
    });
  },
  getOrder: async (orderId: string) => {
    return chariowRequest(`/orders/${orderId}`);
  }
};

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: "Forbidden" });
      req.user = user;
      next();
    });
  };

  // --- API Routes ---

  // Auth
  app.post("/api/auth/register", async (req, res) => {
    const { email, password, name } = req.body;
    console.log(`Register attempt: ${email}`);
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)");
      const result = stmt.run(email, hashedPassword, name);
      const user = { id: result.lastInsertRowid, email, name };
      const token = jwt.sign(user, JWT_SECRET);
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
      console.log(`Register success: ${email}`);
      res.json({ user });
    } catch (e: any) {
      console.error(`Register error for ${email}:`, e.message);
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt: ${email}`);
    try {
      const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        console.log(`Login failed: ${email} (invalid credentials)`);
        return res.status(401).json({ error: "Identifiants invalides" });
      }
      const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET);
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
      console.log(`Login success: ${email}`);
      res.json({ user: { id: user.id, email: user.email, name: user.name } });
    } catch (e: any) {
      console.error(`Login error for ${email}:`, e.message);
      res.status(500).json({ error: "Erreur serveur lors de la connexion" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true });
  });

  app.get("/api/auth/me", authenticateToken, (req: any, res) => {
    res.json({ user: req.user });
  });

  // Subscriptions
  app.get("/api/subscriptions", (req, res) => {
    const subs = db.prepare(`
      SELECT s.*, u.name as owner_name 
      FROM subscriptions s 
      JOIN users u ON s.owner_id = u.id
    `).all();
    res.json(subs);
  });

  app.get("/api/subscriptions/:id", (req, res) => {
    const sub = db.prepare(`
      SELECT s.*, u.name as owner_name 
      FROM subscriptions s 
      JOIN users u ON s.owner_id = u.id 
      WHERE s.id = ?
    `).get(req.params.id);
    if (!sub) return res.status(404).json({ error: "Not found" });
    res.json(sub);
  });

  app.post("/api/subscriptions", authenticateToken, async (req: any, res) => {
    const { name, category, total_price, slots_total, description, logo_url } = req.body;
    const pricePerPlace = total_price / slots_total;

    try {
      // 1. Create product in Chariow
      const product = await chariowService.createProduct(
        name,
        description || `Abonnement partagé pour ${name}`,
        pricePerPlace
      );

      // 2. Save to DB
      const stmt = db.prepare(`
        INSERT INTO subscriptions (name, category, total_price, slots_total, slots_available, description, logo_url, owner_id, chariow_product_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(name, category, total_price, slots_total, slots_total, description, logo_url, req.user.id, product.data.id);
      res.json({ id: result.lastInsertRowid });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Groups & Members
  app.post("/api/subscriptions/:id/join", authenticateToken, async (req: any, res) => {
    const sub_id = req.params.id;
    const user_id = req.user.id;
    
    // Check if already a member
    const existing = db.prepare("SELECT * FROM group_members WHERE subscription_id = ? AND user_id = ?").get(sub_id, user_id);
    if (existing) return res.status(400).json({ error: "Déjà rejoint ou en attente" });

    const sub: any = db.prepare("SELECT * FROM subscriptions WHERE id = ?").get(sub_id);
    if (!sub || sub.slots_available <= 0) return res.status(400).json({ error: "Plus de places disponibles" });

    try {
      // 1. Create order in Chariow
      const order = await chariowService.createOrder(sub.chariow_product_id, req.user.email, {
        subscription_id: sub_id,
        user_id: user_id
      });

      // 2. Save member as pending
      db.prepare(`
        INSERT INTO group_members (subscription_id, user_id, chariow_order_id, status, payment_status) 
        VALUES (?, ?, ?, 'pending', 'unpaid')
      `).run(sub_id, user_id, order.data.id);

      res.json({ checkout_url: order.data.checkout_url });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Webhooks
  app.post("/api/webhooks/chariow", async (req, res) => {
    const event = req.body;
    console.log("Chariow Webhook Event:", event.type);

    if (event.type === "payment.success") {
      const orderId = event.data.order_id;
      const member: any = db.prepare("SELECT * FROM group_members WHERE chariow_order_id = ?").get(orderId);
      
      if (member) {
        // Update member status
        const nextRenewal = new Date();
        nextRenewal.setDate(nextRenewal.getDate() + 30);

        db.prepare(`
          UPDATE group_members 
          SET status = 'active', payment_status = 'paid', next_renewal_date = ? 
          WHERE id = ?
        `).run(nextRenewal.toISOString(), member.id);

        // Decrease available slots
        db.prepare("UPDATE subscriptions SET slots_available = slots_available - 1 WHERE id = ?").run(member.subscription_id);

        // Log payment
        db.prepare(`
          INSERT INTO payments (user_id, subscription_id, chariow_order_id, amount, status)
          VALUES (?, ?, ?, ?, 'success')
        `).run(member.user_id, member.subscription_id, orderId, event.data.amount / 100);
      }
    }

    res.json({ received: true });
  });

  app.get("/api/payments/history", authenticateToken, (req: any, res) => {
    const history = db.prepare(`
      SELECT p.*, s.name as subscription_name 
      FROM payments p 
      JOIN subscriptions s ON p.subscription_id = s.id 
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `).all(req.user.id);
    res.json(history);
  });

  app.get("/api/my-subscriptions", authenticateToken, (req: any, res) => {
    const joined = db.prepare(`
      SELECT s.*, gm.status as member_status, gm.payment_status, gm.next_renewal_date, u.name as owner_name
      FROM group_members gm
      JOIN subscriptions s ON gm.subscription_id = s.id
      JOIN users u ON s.owner_id = u.id
      WHERE gm.user_id = ?
    `).all(req.user.id);
    res.json(joined);
  });

  app.get("/api/my-groups", authenticateToken, (req: any, res) => {
    const groups = db.prepare(`
      SELECT s.*, (SELECT COUNT(*) FROM group_members WHERE subscription_id = s.id AND status = 'active') as active_members
      FROM subscriptions s
      WHERE s.owner_id = ?
    `).all(req.user.id);
    res.json(groups);
  });

  // --- Socket.io ---
  io.on("connection", (socket) => {
    socket.on("join-room", (subId) => {
      socket.join(`sub-${subId}`);
    });

    socket.on("send-message", (data) => {
      const { subId, userId, content } = data;
      db.prepare("INSERT INTO messages (subscription_id, sender_id, content) VALUES (?, ?, ?)").run(subId, userId, content);
      io.to(`sub-${subId}`).emit("new-message", { ...data, created_at: new Date() });
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  // --- Renewal Checker ---
  setInterval(() => {
    const now = new Date().toISOString();
    const expiredMembers = db.prepare(`
      SELECT gm.*, s.chariow_product_id, u.email 
      FROM group_members gm
      JOIN subscriptions s ON gm.subscription_id = s.id
      JOIN users u ON gm.user_id = u.id
      WHERE gm.status = 'active' AND gm.next_renewal_date < ?
    `).all(now);

    for (const member of expiredMembers as any[]) {
      console.log(`Renewing subscription for user ${member.user_id} on sub ${member.subscription_id}`);
      // In a real app, we'd create a new order and send an email
      // For this demo, we'll mark as 'pending_renewal'
      db.prepare("UPDATE group_members SET status = 'pending_renewal', payment_status = 'unpaid' WHERE id = ?").run(member.id);
      
      // Mocking email notification
      console.log(`Email sent to ${member.email}: Votre abonnement SubShare arrive à échéance. Veuillez le renouveler.`);
    }
  }, 1000 * 60 * 60); // Check every hour

  httpServer.listen(3000, "0.0.0.0", () => {
    console.log("Server running on http://localhost:3000");
  });
}

startServer();
