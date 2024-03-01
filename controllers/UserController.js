const Joi = require('joi');
const crypto = require('crypto');

const UserModel = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');

const UserController = {
  getAllUsers: (req, res) => {
    // get all users
    const users = UserModel.getAllUsers((err, result) => {
      if (err) {
        return res.status(500).json({ error: "internul server error" })
      }

      return res.status(200).json({ userlist: result })

    });
    // console.log(">>>>>>>............ users", users);
  },

  getUserById: (req, res) => {
    const userId = req.params.id;
    UserModel.getUserById(userId, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(results[0]);
    });
  },

  createUser: (req, res) => {
    const userData = req.body;

    const registerUserSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required()
    })

    const { error } = registerUserSchema.validate(userData);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    UserModel.createUser(userData, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      res.status(200).json({ status: true, message: "User register successfully." });
    });
  },

  loginUser: (req, res) => {
    const { email, password } = req.body;

    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required()
    });

    const { error } = loginSchema.validate({ email, password }); // Pass an object containing email and password
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    UserModel.loginUser(email, password, (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      res.json({ message: 'Login successful', user });
    });
  },


  forgotPassword: (req, res) => {
    const { email } = req.body;


    UserModel.getUserByEmail(email, (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (!user) {
        return res.status(404).json({ error: 'Inveled email address!' });
      }

      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000;

      // const x = Math.floor((Math.random() * 99999999) + 1);

      UserModel.updateResetToken(user.id, resetToken, resetTokenExpiry, async (updateError, updateResults) => {
        try {
          if (updateError) {
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          const resetLink = `http://localhost:8000/reset-password?token=${resetToken}`;
          await sendEmail(email, resetLink, "Reset Password Link");

          res.json({ message: 'Password reset link sent to your email' });
        }
        catch (error) {
          console.log("Error while sending email", error);
        }
      });
    });
  },

  changePassword: (req, res) => {
    const { userId, oldPassword, newPassword, confirmNewPassword } = req.body;

    const changePasswordSchema = Joi.object({
      userId: Joi.string().required(),
      oldPassword: Joi.string().min(6).required(),
      newPassword: Joi.string().min(6).required(),
      confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required()
    });
    
    const { error } = changePasswordSchema.validate({ userId, oldPassword, newPassword, confirmNewPassword });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    // console.log(">>>>>>> mohit body params", userId, oldPassword, newPassword, confirmNewPassword);
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'New password and confirm new password do not match' });
    }

    UserModel.verifyOldPassword(userId, oldPassword, (verifyError, isMatch) => {
      if (verifyError) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      console.log(">>>>>>>>>> isMatch contoller", isMatch);
      if (!isMatch) {
        return res.status(401).json({ error: 'Old password is incorrect' });
      }

      // Change the password
      UserModel.changePassword(userId, newPassword, (changeError, results) => {
        if (changeError) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log(">>>>>>> results update", results);
        if (results.affectedRows === 0) {
          return res.status(401).json({ error: 'User not found or password not updated' });
        }

        res.status(200).json({ message: 'Password updated successfully' });
      });
    });
  },
};



module.exports = UserController;
