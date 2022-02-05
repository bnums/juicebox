const express = require('express');
const postsRouter = express.Router();
const { getAllPosts, createPost, getPostById, updatePost } = require('../db');
const { requireUser } = require('./utils');

//Web token stuff
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET } = process.env;


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

postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/)
  const postData = {};

  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    // add authorId, title, content to postData object
    postData.authorId = req.user.id;
    postData.title = title;
    postData.content = content;

    // this will create the post and the tags for us
    const post = await createPost(postData);
  
    // if the post comes back, res.send({ post });
    // otherwise, next an appropriate error object 
    if(!post) {
      next()
    } else {
      res.send({post});
    };
   
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  if (title) {
    updateFields.title = title;
  }

  if (content) {
    updateFields.content = content;
  }

  try {
    const originalPost = await getPostById(postId);

    if (originalPost.author.id === req.user.id) {
      const updatedPost = await updatePost(postId, updateFields);
      res.send({ post: updatedPost })
    } else {
      next({
        name: 'UnauthorizedUserError',
        message: 'You cannot update a post that is not yours'
      })
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});


module.exports = postsRouter
