import express from "express";

const app = express();
const port = process.env.WEBHOOK_PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Weboooks running on port ${port}`);
});
