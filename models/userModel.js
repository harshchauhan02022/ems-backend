// models/userModel.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const moment = require('moment');

const UserModel = {
  getAllUsers: (callback) => {
    db.query('SELECT * FROM users', callback);
  },

  getUserById: (userId, callback) => {
    db.query('SELECT * FROM users WHERE id = ?', [userId], callback);
  },

  createUser: (userData, callback) => {
    const { name, email, password } = userData;

    bcrypt.hash(password, 10, (hashError, hashedPassword) => {
      if (hashError) {
        return callback(hashError, null);
      }

      db.query('INSERT INTO users(name, email, password) VALUES (?, ?,?)', [name, email, hashedPassword], (error, results) => {

        if (error) {
          return callback(error, null);
        };
        return callback(null, { id: results.inse });
      });
    });
  },

  loginUser: (email, password, callback) => {

    db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
      if (error) {
        return callback(error, null);
      }

      if (results.length === 0) {
        return callback(null, null);
      }

      const user = results[0];

      bcrypt.compare(password, user.password, (bcryptError, isMatch) => {
        if (bcryptError) {
          return callback(bcryptError, null);
        }

        if (!isMatch) {
          return callback(null, null);
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, 'yourSecretKey', { expiresIn: '1h' });

        const { password, ...userData } = user;
        return callback(null, { user: userData, token });
      });
    });
  },

  getUserByEmail: (email, callback) => {
    db.query('SELECT id, email  FROM users WHERE email = ?', [email], (error, results) => {
      if (error) {
        return callback(error, null);
      }

      if (results.length === 0) {

        return callback(null, null);
      }

      const user = results[0];
      return callback(null, user);
    });
  },

  updateResetToken: (userId, resetToken, resetTokenExpiry, callback) => {
    db.query('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?', [resetToken, resetTokenExpiry, userId], (error, results) => {
      if (error) {
        return callback(error, null);
      }

      return callback(null, results);
    });
  },

  verifyOldPassword: (userId, oldPassword, callback) => {
    db.query('SELECT password FROM users WHERE id = ?', [userId], (error, results) => {
      if (error) {
        return callback(error);
      }
      console.log(">>>>>>>>>> mohit results", results[0]);
      if (results.length === 0) {
        return callback(null, false); // User not found
      }

      const hashedPassword = results[0].password;

      bcrypt.compare(oldPassword, hashedPassword, (compareError, isMatch) => {
        if (compareError) {
          return callback(compareError);
        }
        console.log(">>>>>>>>>> isMatch", isMatch);
        callback(null, isMatch);
      });
    });
  },

  changePassword: (userId, newPassword, callback) => {
    const hashedPassword = bcrypt.hashSync(newPassword, 10); // Hash the new password

    const query = 'UPDATE users SET password = ? WHERE id = ?';
    db.query(query, [hashedPassword, userId], (error, results) => {
      callback(error, results);
    });
  },
};


module.exports = UserModel;
