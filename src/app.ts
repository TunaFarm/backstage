import express from 'express'

const userRoutes = require('./routers/userRoutes');
const app = express();

app.get('/', function(req, res, next) {
    res.status(200).send('Spellcasters');
});

app.use('/api/user', userRoutes);

app.use((req, res, next) => {
    return res.status(404).send();
});

module.exports = app;
