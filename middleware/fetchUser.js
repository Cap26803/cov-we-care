function isAuthenticated(req, res, next) {
  try {
    const userId = req.header("user");

    if (!userId) return res.status(400).send("Unauthorized Access");

    req.user = userId;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

function isAdmin(req, res, next) {
  try {
    const adminId = req.header("admin");

    if (!adminId || adminId === "") {
      throw new Error("Unauthorized Access");
    }

    req.admin = adminId;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
}

module.exports = {
  isAdmin,
  isAuthenticated,
};
