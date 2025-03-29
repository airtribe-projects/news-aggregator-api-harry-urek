const express = require('express');
const { json, urlencoded } = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const preferencesRoutes = require('./routes/preferencesRoutes');
const { authenticateToken } = require('./middlewares/authMiddleware');


const app = express();


app.use([json(), urlencoded({ extended: true })]);

app.use("/users/preferences", authenticateToken, preferencesRoutes);
app.use("/users", userRoutes);


module.exports = app;

/*

NewsAPI - 100 requests/day (this one has a native Node.js library that is unmaintained since 2018. So it's better to consume the APIs directly)

NewsCatcher News API

GNews API - 100 requests/day

NewsAPI.ai - 2000 requests/month

*/


// server.js
// models
// middleware
// routes
// controllers
// services
// config
// utils
//     .env

/*
Implement User Registration

Implement the POST /register endpoint.

Use bcrypt to hash user passwords before saving them.

Implement User Login

Implement the POST /login endpoint.

Use bcrypt to compare the password provided by the user with the hashed password stored.

Generate a JWT token on successful login and return it to the user.

*/