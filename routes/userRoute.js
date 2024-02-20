const express = require("express");
const { register, login, logoutAll } = require("../controllers/userController");
const { checkAdmin, accessUser } = require("../middlewares/middleware")
const router = express.Router();

router.post("/signin", login);
router.post("/signup", checkAdmin ,register);
router.patch("/logout", accessUser, logoutAll);


module.exports = router;
