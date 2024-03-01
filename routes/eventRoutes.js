// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const EventController = require('../controllers/EventController');

// Define routes
router.get("/", EventController.getAllEvents);
router.get("/:id", EventController.getEventById);
router.get("/user-id/:user_Id", EventController.getEventsByUserId);
router.post("/register", EventController.createEvent);
router.post('/change-date', EventController.changedate);




module.exports = router;
