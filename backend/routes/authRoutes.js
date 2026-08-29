const express = require("express");
const controller = require("../controllers/authController");
const { login } = require("../controllers/loginController");

const router = express.Router();
router.post("/register", controller.register);
router.post("/login", login);

module.exports = router;
