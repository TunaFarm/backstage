import { Request, Response, NextFunction } from 'express';

const express = require('express');
const router = express.Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({
        success: true
    })
});

module.exports = router;
