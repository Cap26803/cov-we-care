const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const dataRouter = require("./routes/data");
const adminRouter = require("./routes/admin");

const app = express();

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");

app.use(expressLayouts);
app.use(express.static("public"));

// Routes
app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/api/data", dataRouter);
app.use("/admin", adminRouter);

app.all("*", (req, res) => {
  res.status(200).render("pages/Error");
});

// Listening At Port
app.listen(PORT, () => {
  console.log(`Listening at ${process.env.HOSTED_URL}:${PORT}`);
});
