const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

router.get("/", async (req, res) => {
  const students = await Student.find();

  let groups = {};

  for (let i = 1; i <= 7; i++) {
    groups[i] = [];
  }

  students.forEach(s => {
    groups[s.group].push(s.nim);
  });

  res.json(groups);
});

module.exports = router;
