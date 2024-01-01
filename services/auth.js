
const bcrypt = require("bcrypt");
require('dotenv').config();

const { query } = require("./db");
const jwt = require("jsonwebtoken");

var message, success;

const register = async (data) => {
 const { name, email, phone, password } = data;

 try {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await query(
   "INSERT INTO users(name, email, phone, password) VALUES(?, ?, ?, ?)",
   [name, email, phone, hashedPassword]
  );

  if (result.affectedRows) {
   message = "User has been registered successfully!";
   success = "success";
  } else {
   message = "Failed: Unable to register user, try again!";
   success = "error";
  }

  return { message, success };
 } catch (error) {
  console.error("Error during user registration:", error.message);
  return { message: "An error occurred during user registration", success: "error" };
 }
};

async function login(data) {
 const { email, password } = data;

 try {
  const user = await getUserByEmail(email);
  // console.log(">>>>>>> user", user);
  if (user.length === 0) {
   return "Invalid user email!";
  }

  console.log(">>>>>>> user[0].password", user[0].password, '--------', password);
  const isPasswordValid = await bcrypt.compare(password, user[0].password);
  console.log(">>>>>>> isPasswordValid", isPasswordValid);
  if (!isPasswordValid) {
   return "Invalid user password!";
  }

  const accessToken = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "15m" }); // payload

  const obj = {
   message: "Login Successfully!",
   success: "success",
   token: accessToken,
  };

  return { obj };
 } catch (error) {
  console.error("Login Error:", error.message);
  return "An error occurred during login.";
 }
}

async function getUserByEmail(email) {
 const response = await query(
  "SELECT email, password FROM users WHERE email = ?",
  [email]
 );

 return response;
}

module.exports = { register, login };
