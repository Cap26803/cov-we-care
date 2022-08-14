const { getDoc, doc } = require("firebase/firestore");
const { registerUser } = require("../authentication/auth");
const { saveUser } = require("../models/db");
const { db } = require("../models/firebase");

const router = require("express").Router();

router.get("/", (req, res) => {
  try {
    res.render("pages/UserPage");
  } catch (e) {
    console.log("Error Logging In");
    res.redirect("/signIn");
    // res.send('Error')
  }
});

router.get("/new", (req, res) => {
  res.render("pages/Register");
});

router.get("/:id", async (req, res) => {
  try {
    if (req.params.id === "null" || req.params.id === "undefined") return;

    const user = await getDoc(doc(db, "users", req.params.id));

    if (!user.exists()) res.status(400).json({ msg: "Unauthorized Access" });

    res.status(200).json({
      success: true,
      user: user.data(),
    });
  } catch (e) {
    console.log(e);
    res.redirect("/signIn");
    // res.send('Error')
  }
});

router.post("/new", async (req, res) => {
  try {
    const { uname, email, password } = req.body;

    const newUser = await registerUser(email, password);

    if (newUser.success) {
      newUser.user.displayName = uname;
      await saveUser(newUser.user);
      res.json({ token: newUser.user.accessToken, userId: newUser.user.uid });
    } else {
      throw new Error("Error Creating User");
    }
  } catch (e) {
    console.error(e);
    res.redirect("/");
  }
});

module.exports = router;
