const express = require("express");
const { register, login, logoutAll, getAllUsers, deleteUser } = require("../controllers/userController");
const { checkAdmin, accessUser } = require("../middlewares/middleware")
const router = express.Router();

router.post("/signin", login);
router.post("/signup", checkAdmin ,register);
router.patch("/logout", accessUser, logoutAll);
router.get("/users", checkAdmin, getAllUsers)
router.delete("/users/:userId", checkAdmin, deleteUser);

module.exports = router;
