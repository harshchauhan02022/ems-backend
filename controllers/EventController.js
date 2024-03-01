const eventModel = require('../models/eventModel');

const EventController = {
  getAllEvents: (req, res) => {
    eventModel.getAllEvents((err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(200).json({ eventList: result });
    });
  },

  getEventById: (req, res) => {
    const eventId = req.params.id;
    eventModel.getEventById(eventId, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(results[0]);
    });
  },
  getEventsByUserId: (req, res) => {
    const userId = req.params.user_id;
    eventModel.getEventsByUserId(userId, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(results);
    });
  },


  createEvent: (req, res) => {
    const eventData = req.body;
    // console.log(">>>>>>>>>>>>>>eventData:", eventData);

    eventModel.createEvent(eventData, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      res.status(200).json({ status: true, message: "Event registered successfully." });
    });
  },

  changedate: (req, res) => {
    const { userId, olddate, newdate, confirmNewdate } = req.body;

    if (newdate !== confirmNewdate) {
      return res.status(400).json({ error: 'New date and confirm new date do not match' });
    }

    eventModel.verifyOlddate(userId, olddate, (verifyError, isMatch) => {
      if (verifyError) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Old date is incorrect' });
      }

      eventModel.changedate(userId, newdate, (changeError, results) => {
        if (changeError) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.affectedRows === 0) {
          return res.status(401).json({ error: 'User not found or date not updated' });
        }

        res.status(200).json({ message: 'Date updated successfully' });
      });
    });
  },
};

module.exports = EventController;
