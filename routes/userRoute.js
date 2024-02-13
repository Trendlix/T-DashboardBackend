const express = require("express");
const { register, login, logoutAll } = require("../controllers/userController");

const router = express.Router();

router.post("/signup", register);
router.post("/signin", login);
router.patch("/logout", logoutAll);

module.exports = router;
