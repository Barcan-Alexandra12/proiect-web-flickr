const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = 3001;

app.use(cors());


app.get("/photos", async (req, res) => {
  const tag = req.query.tag || "nature";
  const url = `https://api.flickr.com/services/feeds/photos_public.gne?tags=${tag}&format=json&nojsoncallback=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Eroare la preluarea fotografiilor" });
  }
});


app.get("/api/tweets", async (req, res) => {
  const searchTerm = req.query.q || "nature";
  
 
  const mockTweets = Array.from({ length: 20 }).map((_, index) => ({
    id: `${index}`,
    text: `Un tweet generat automat despre "${searchTerm}". 🌍 Părere #${index + 1}`
  }));


  res.json({ data: mockTweets });
});

app.listen(PORT, () => {
  console.log(`Serverul rulează cu succes pe http://localhost:${PORT}`);
});