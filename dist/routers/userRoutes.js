"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
router.post('/', (req, res, next) => {
    res.json({
        success: true
    });
});
module.exports = router;
