const express = require('express');
const { login, signup } = require('../Controller/user.controller');

const usersRoute = express.Router();

usersRoute.post("/signup", signup);
usersRoute.post("/login", login);

module.exports = usersRoute;