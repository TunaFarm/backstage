/* eslint-disable no-console */
import {Request, Response, Router} from 'express';
import expressWs from 'express-ws';
import {WebSocket} from 'ws';
import {v4 as uuid} from 'uuid';

// Message format - Multiple message types will extend this type
interface Message {
    message: any;
}

interface Player {
    id: string;
    connection: WebSocket;
}

const roomList = new Map<string, Map<string, Player>>();

const getPlayRoutes = (): expressWs.Router => {
    const playRoute = Router();

    // Generate new roomId or return existed roomId
    playRoute.post('/', (req: Request, res: Response) => {
        let id;
        roomList.forEach((roomInfo, roomId) => {
            if (roomInfo.size < 4) {
                id = roomId;
            }
        });

        if (!id) {
            id = uuid();
            roomList.set(id, new Map<string, Player>());
        }

        res.status(200).json({roomId: id});
    });

    // Setup ws events when connected
    playRoute.ws('/:id/:player', (ws: WebSocket, req: Request) => {
        const roomId = req.params.id;
        const playerId = req.params.player;
        const currentRoom = roomId ? roomList.get(roomId) : null;

        if (!roomId || !currentRoom) {
            console.log('ROOM_NOT_FOUND')
            ws.send(JSON.stringify({
                'error': 'ROOM_NOT_FOUND'
            }));
            ws.close();
            return;
        }

        const player: Player = {
            id: playerId,
            connection: ws
        }
        currentRoom.set(playerId, player);

        //
        currentRoom.forEach((rplayer) => {
            if (rplayer.id === player.id) {
                return;
            }
            player.connection.send(JSON.stringify(
                {
                    method: 'SUBSCRIBE',
                    player: rplayer.id
                }
            ));
            rplayer.connection.send(JSON.stringify(
                {
                    method: 'SUBSCRIBE',
                    player: player.id
                }
            ));
        });
        //

        ws.on('message', (data) => {
            const message = JSON.parse(data.toString());

            currentRoom.forEach((rplayer) => {
                if (rplayer.id === player.id) {
                    return;
                }
                rplayer.connection.send(JSON.stringify(
                    {
                        method: 'MESSAGE',
                        player: player.id, message: message
                    }
                ));
            });
        });

        ws.on('close', () => {
            const currentRoom = roomList.get(roomId) as Map<string, Player>;
            currentRoom.delete(player.id);

            if (currentRoom.size) {
                roomList.set(roomId, currentRoom);

                currentRoom.forEach((rplayer) => {
                    rplayer.connection.send(JSON.stringify(
                        {
                            method: 'UNSUBSCRIBE',
                            player: player.id
                        }
                    ));
                });
            } else {
                roomList.delete(roomId)
            }

            ws.close();
        });
    });

    return playRoute;
};

export default getPlayRoutes;
