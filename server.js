const express = require('express');

const UsersRouter = require('./users/usersRouter.js');
const AuthRouter = require('./auth/authRouter.js')

const server = express();

server.use(express.json());
server.use('/auth', AuthRouter);
server.use('/api/users', UsersRouter);

module.exports = server;