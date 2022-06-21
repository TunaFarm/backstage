"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
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
