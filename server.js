const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());
app.use("/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  res.send("Auth server is running!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
