
const {
    createUser,
    userExist
} = require('../Controllers/UserAccessControllers');

const express = require('express');

const app = express();


app.post('/create', createUser);

app.post('/login', userExist);

module.exports = app;