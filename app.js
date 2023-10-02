const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const fs = require("fs");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
//
app.use(cors());

const data = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, `utf-8`));

// let neptune = {};

// data.forEach((element) => {
//   element.name.toLowerCase() === "Neptune".toLowerCase()
//     ? (neptune = element)
//     : (neptune = neptune);
// });

// console.log("neptune", neptune);
// console.log("neptune.name", neptune.name);

// console.log("data", typeof data);

// app.get("/api/v1/", (req, res) => {
//   console.log("req.body", req.params);
//   //
//   res.status(200).json({ status: "success", message: "message", data: data });
// });

app.get("/api/v1/:name", (req, res) => {
  //
  const name = req.params.name.toLowerCase();

  let planet = {};

  data.forEach((element) => {
    element.name.toLowerCase() === name
      ? (planet = element)
      : (planet = planet);
  });

  res.status(200).json({ status: "success", message: "message", data: planet });
});

app.listen(5000, () => {
  console.log("Server listening...");
});
