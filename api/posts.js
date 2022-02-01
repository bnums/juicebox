const express = require('express');
const postsRouter = express.Router();
const { getAllPosts } = require('../db');

postsRouter.use((res, req, next) => {
  console.log("A request is being made to /posts")
  next();
});

postsRouter.get('/', async (req, res, next) => {
  const posts = await getAllPosts();
  res.send({
    "posts": [posts]
  });
});


module.exports = postsRouter
