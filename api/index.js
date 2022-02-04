const express = require('express');
const apiRouter = express.Router();
const usersRouter = require('./users');
const postsRouter = require('./posts');
const tagsRouter = require('./tags');
const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
require('dotenv').config();
const { JWT_SECRET } = process.env;



// set `req.user` if possible
apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) { // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});

apiRouter.use(async (req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }
  next();
});


// api/routes
apiRouter.use('/users', usersRouter);
apiRouter.use('/posts', postsRouter);
apiRouter.use('/tags', tagsRouter);

// error handler
apiRouter.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message
  });
});


module.exports = apiRouter;