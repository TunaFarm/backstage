import { Request, Response, NextFunction } from 'express';
import * as ws from 'ws';

const express = require('express');
const router = express.Router();

const roomList = new Map<string, Set<ws>>();

router.ws('/:id', function(ws: ws, req: Request) {
    const roomID = req.params.id as string;

    let room = new Set<ws>();
    if (roomList.has(roomID)) {
        room = roomList.get(roomID) as Set<ws>;
    } else {
        roomList.set(roomID,room);
    }
    room.add(ws);

    console.log('Connect', roomID,room.size);

    ws.on('message', function(msg: string) {
        for(let wsc of room.values()){
            if (ws == wsc) {
                continue;
            }
            wsc.send(msg);
        }
    });

    ws.on('close', function () {
        room.delete(ws)
        console.log('Leave', roomID, room.size)
    });
});

module.exports = router;
