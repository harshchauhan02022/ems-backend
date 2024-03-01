// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Define routes
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.post("/register", UserController.createUser);
router.post('/login', UserController.loginUser);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/change-password', UserController.changePassword);

module.exports = router;
