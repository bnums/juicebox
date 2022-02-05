const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');

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

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  // read the tagname from the params
  const { tagName } = req.params;

  try {
    // use our method to get posts by tag name from the db
    const tagPosts = await getPostsByTagName(tagName);
    res.send({posts: tagPosts})
    // send out an object to the client { posts: // the posts }
  } catch ({ name, message }) {
    // forward the name and message to the error handler
    next({name, message})
  }
});


module.exports = tagsRouter
