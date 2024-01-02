require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 7000;

const router = require("./routes")
app.use(express.json());
app.use(express.urlencoded({
  extended: true
})
);

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Replace '*' with the specific origin(s) you want to allow
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use("/", router);

app.get('/', (req, res) => {
  res.json({ message: "hello how are you!" });
});

app.listen(port, () => {
  console.log(`Example http://localhost:${port}`);
});
