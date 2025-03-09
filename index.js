// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bookRoutes = require("./routes/book.js");
const userRoutes = require("./routes/user.js");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: [
    "http://localhost:8000",
    "http://localhost:4000",
    "http://localhost:3000",
    "https://book-worm-frontend-react.vercel.app/",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_STRING, {});

mongoose.connection.once("open", () =>
  console.log("Now Connected to MongoDB Atlas.")
);

app.use("/users", userRoutes);
app.use("/books", bookRoutes);

if (require.main === module) {
  app.listen(process.env.PORT || 4008, () => {
    console.log(`API is now online on port ${process.env.PORT || 4008}`);
  });
}

module.exports = { app, mongoose };
