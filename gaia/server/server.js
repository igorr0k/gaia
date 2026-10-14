import express from "express";
import cors from "cors";

const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port} your mum`);
});

// TODO: fetch `https://api.nasa.gov/neo/rest/v1/neo/browse?page=1&size=20&api_key=${API_KEY}`
