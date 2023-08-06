const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();

const authRouter = require("./routes/AuthRoutes");
const quizRouter = require("./routes/quiz");
const courseRouter = require("./routes/course");
const instructorRouter = require("./routes/instructor");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
const favoritesRouter = require("./routes/favorites");

const port = 3000;

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log(err));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/products", productRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/course", courseRouter);
app.use("/api/instructor", instructorRouter);
app.use("/api/user", userRouter);
app.use("/api/favorites", favoritesRouter);

app.use("/user", authRouter);

app.listen(process.env.PORT || port, () =>
  console.log(`Example app listening on port ${process.env.PORT}`)
);
