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

app.use("/", router);

app.get('/', (req, res) => {
  res.json({ message: "hello how are you!" });
});

app.listen(port, () => {
  console.log(`Example http://localhost:${port}`);
});
