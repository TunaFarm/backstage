import express from 'express'

const userRoutes = require('./routers/userRoutes');
const app = express();

app.use('/api/user', userRoutes);

app.use((req, res, next) => {
    return res.status(404).send();
});

module.exports = app;
