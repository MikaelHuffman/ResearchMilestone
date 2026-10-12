require("dotenv").config();

const cors = require("cors");
const express = require("express");
const pool = require("./db");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is working" });
});

app.get("/api/research-items", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM research_items ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Could not get research items" });
    }
});

app.post("/api/research-items", async (req, res) => {
  const { title, url, notes } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO research_items (title, url, notes)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, url || null, notes || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Could not save research item" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});