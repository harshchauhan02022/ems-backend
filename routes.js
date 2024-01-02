const express = require('express');
const router = express.Router();

const { getmanagements, insertmanagements, updatemanagements, deletemanagements } = require('./services/managementsystem');
const { register, login } = require('./services/auth');

router.post("/user/register", async function (req, res, next) {
  console.log("........harsh",req.body);
  try {
    const registerObj = req.body;
    const user = await register(registerObj);
    res.json(user);
  } catch (err) {
    console.error(' errer  register new user:', err.message);
    next(err);
  }
});

router.post("/user/login", async function (req, res, next) {
  try {
    const loginObj = req.body;
    const user = await login(loginObj);
    res.json(user);
  } catch (err) {
    console.error(' errer  login new user:', err.message);
    next(err);
  }
});

router.get("/get", async function (req, res, next) {
  try {
    const system = await getmanagements();
    res.json(system);
  } catch (err) {
    console.error(`Error getting management data:`, err.message);
    next(err);
  }
});

router.post("/add", async function (req, res, next) {
  try {
    // Assuming insertmanagements requires some data from the request body
    console.log(">>>>>>> req.body", req.body);
    const system = await insertmanagements(req.body);
    res.json(system);
  } catch (err) {
    console.error(`Error adding data:`, err.message);
    next(err);
  }
});

router.put("/edit:id", async function (req, res, next) {
  try {
    const system = await updatemanagements(req.params.id, req.body);
    res.json(system);
  } catch (err) {
    console.error(`Error update data:`, err.message);
    next(err);
  }
});

router.delete("/delete/:id", async function (req, res, next) {
  console.log(">>>>>>>>>>>>>>>> delete harsh", req.params)
  try {
    const system = await deletemanagements(req.params.id);
    res.json(system);
  } catch (err) {
    console.error(`Error deleting data:`, err.message);
    next(err);
  }
});

module.exports = router;
