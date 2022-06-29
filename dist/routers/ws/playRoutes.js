"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const express_1 = require("express");
const uuid_1 = require("uuid");
const roomList = new Map();
const getPlayRoutes = () => {
    const playRoute = (0, express_1.Router)();
    // Generate new roomId or return existed roomId
    playRoute.post('/', (req, res) => {
        let id;
        roomList.forEach((roomInfo, roomId) => {
            if (roomInfo.length < 4) {
                id = roomId;
            }
        });
        if (!id) {
            id = (0, uuid_1.v4)();
            roomList.set(id, []);
        }
        res.status(200).send({ id });
    });
    // Setup ws events when connected
    playRoute.ws('/:id', (ws, req) => {
        const roomId = req.params.id;
        if (!roomId) {
            console.log('Ws connection failed: Room id not provided');
            return;
        }
        ws.on('message', (data) => {
            const { id: playerId, message } = JSON.parse(data.toString());
            const currentRoom = roomList.get(roomId);
            if (!currentRoom) {
                ws.send('Ws connection failed: Room not found');
                return;
            }
            currentRoom.forEach(({ id, connection }) => {
                if (id === playerId) {
                    return;
                }
                connection.send(`Player ${playerId} send message: ${message}`);
            });
        });
        ws.on('close', () => {
            ws.close();
        });
    });
    return playRoute;
};
exports.default = getPlayRoutes;
