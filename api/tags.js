const express = require('express');
const tagsRouter = express.Router();
const { getAllTags } = require('../db');

tagsRouter.use((res, req, next) => {
  console.log("A request is being made to /tags")
  next();
});

tagsRouter.get('/', async (req, res, next) => {
  const tags = await getAllTags();
  res.send({
    "tags": [tags]
  });
});


module.exports = tagsRouter
