// models/eventModel.js
const db = require('../config/db');

const eventModel = {
 getAllEvents: (callback) => {
  db.query('SELECT * FROM events', callback);
 },
 getEventById: (eventId, callback) => {
  db.query('SELECT * FROM events WHERE id = ?', [eventId], callback);
 },

 getEventsByUserId: (userId, callback) => {
  db.query('SELECT * FROM events WHERE user_id = ?', [userId], callback);
},
 // Create a new event
 createEvent: (userData, callback) => {
  const { user_id, title, description, event_date } = userData;

  db.query('INSERT INTO events (user_id, title, description, event_date) VALUES (?, ?, ?, ?)',
   [user_id, title, description, event_date], (error, results) => {
    if (error) {
     return callback(error, null);
    }
    return callback(null, { id: results.insertId });
   });
 },

 verifyOlddate: (userId, olddate, callback) => {
  db.query('SELECT event_date FROM events WHERE user_id = ? AND event_date = ?', [userId, olddate], (error, results) => {
   if (error) {
    return callback(error, null);
   }

   if (results.length === 0) {
    return callback(null, false);
   }

   return callback(null, true);
  });
 },
 changedate: (userId, newdate, callback) => {
  db.query('UPDATE events SET event_date = ? WHERE user_id = ?', [newdate, userId], (error, results) => {
   if (error) {
    return callback(error, null);
   }

   return callback(null, results);
  });
 },
};

module.exports = eventModel;
