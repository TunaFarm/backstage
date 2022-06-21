import express from 'express'


const app = express();
const appWS = require('express-ws')(app);

const userRoutes = require('./routers/userRoutes');
const wsPlayRouters = require('./routers/ws/playRoutes');

app.get('/', function (req, res, next) {
    res.status(200).send('Spellcasters');
});

app.use('/api/user', userRoutes);

app.use("/ws/play", wsPlayRouters);

app.use((req, res, next) => {
    return res.status(404).send();
});

module.exports = app;
