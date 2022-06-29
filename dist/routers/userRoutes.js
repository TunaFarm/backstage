"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getUserRoutes = () => {
    const userRoute = (0, express_1.Router)();
    userRoute.post('/', (req, res) => {
        res.json({
            success: true,
        });
    });
    return userRoute;
};
exports.default = getUserRoutes;
