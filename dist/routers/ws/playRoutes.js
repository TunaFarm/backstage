"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const roomList = new Map();
router.ws('/:id', function (ws, req) {
    const roomID = req.params.id;
    let room = new Set();
    if (roomList.has(roomID)) {
        room = roomList.get(roomID);
    }
    else {
        roomList.set(roomID, room);
    }
    room.add(ws);
    console.log('Connect', roomID, room.size);
    ws.on('message', function (msg) {
        for (let wsc of room.values()) {
            if (ws == wsc) {
                continue;
            }
            wsc.send(msg);
        }
    });
    ws.on('close', function () {
        room.delete(ws);
        console.log('Leave', roomID, room.size);
    });
});
module.exports = router;
