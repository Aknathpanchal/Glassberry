const express = require("express");
const connection = require("./db");
const cors = require("cors");
require("dotenv").config();

//Routes
const taskRouter = require("./routes/task.routes");
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/shree", taskRouter);

app.get("/", (req, res) => {
  return res.send("Homepage");
});

const port = process.env.PORT || 8080;

app.listen(port, async () => {
  try {
    await connection;
    console.log("Connected to DB successfully");
  } catch {
    console.log("Failed to connect DB");
  }
  console.log(`Server running on localhost:${port}`);
});
