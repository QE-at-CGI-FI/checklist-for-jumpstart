import express from "express";

export const app = express();
const port = 3000;

app.get("/hello", (_req, res) => {
  res.json({ randomNumber: Math.floor(Math.random() * 1001) });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
