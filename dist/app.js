"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_ws_1 = __importDefault(require("express-ws"));
const userRoutes_1 = __importDefault(require("./routers/userRoutes"));
const playRoutes_1 = __importDefault(require("./routers/ws/playRoutes"));
require('dotenv').config();
const { app } = (0, express_ws_1.default)((0, express_1.default)(), undefined, {
    wsOptions: { clientTracking: true },
});
app.get('/', (req, res) => {
    res.status(200).send('Spellcasters');
});
app.use('/api/user', (0, userRoutes_1.default)());
// Need to initilize express-ws before import
app.use('/ws/play', (0, playRoutes_1.default)());
app.use((req, res) => res.status(404).send());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Running on port ${process.env.PORT}`);
});
