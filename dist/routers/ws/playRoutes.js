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
            if (roomInfo.size < 4) {
                id = roomId;
            }
        });
        if (!id) {
            id = (0, uuid_1.v4)();
            roomList.set(id, new Map());
        }
        res.status(200).json({ roomId: id });
    });
    // Setup ws events when connected
    playRoute.ws('/:id/:player', (ws, req) => {
        const roomId = req.params.id;
        const playerId = req.params.player;
        const currentRoom = roomId ? roomList.get(roomId) : null;
        if (!roomId || !currentRoom) {
            console.log('ROOM_NOT_FOUND');
            ws.send(JSON.stringify({
                'error': 'ROOM_NOT_FOUND'
            }));
            ws.close();
            return;
        }
        const player = {
            id: playerId,
            connection: ws
        };
        currentRoom.set(playerId, player);
        ws.on('message', (data) => {
            const message = JSON.parse(data.toString());
            currentRoom.forEach((rplayer) => {
                if (rplayer.id === player.id) {
                    return;
                }
                rplayer.connection.send(JSON.stringify({ player: player.id, messsage: message }));
            });
        });
        ws.on('close', () => {
            const currentRoom = roomList.get(roomId);
            currentRoom.delete(player.id);
            if (currentRoom.size) {
                roomList.set(roomId, currentRoom);
            }
            else {
                roomList.delete(roomId);
            }
            ws.close();
        });
    });
    return playRoute;
};
exports.default = getPlayRoutes;
