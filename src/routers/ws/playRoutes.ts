/* eslint-disable no-console */
import { Request, Response, Router } from 'express';
import expressWs from 'express-ws';
import { WebSocket } from 'ws';
import { v4 as uuid } from 'uuid';

// Message format - Multiple message types will extend this type
interface Message {
  id: string;
  message: any;
}

interface Player {
  id: string;
  connection: WebSocket;
}

const roomList = new Map<string, Array<Player>>();

const getPlayRoutes = (): expressWs.Router => {
  const playRoute = Router();

  // Generate new roomId or return existed roomId
  playRoute.post('/', (req: Request, res: Response) => {
    let id;
    roomList.forEach((roomInfo, roomId) => {
      if (roomInfo.length < 4) {
        id = roomId;
      }
    });

    if (!id) {
      id = uuid();
      roomList.set(id, []);
    }

    res.status(200).send({ id });
  });

  // Setup ws events when connected
  playRoute.ws('/:id', (ws: WebSocket, req: Request) => {
    const roomId = req.params.id;

    if (!roomId) {
      console.log('Ws connection failed: Room id not provided');
      return;
    }

    ws.on('message', (data) => {
      const { id: playerId, message }: Message = JSON.parse(data.toString());
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

export default getPlayRoutes;
