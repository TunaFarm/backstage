/* eslint-disable no-console */
import { Request, Response, Router } from 'express';
import expressWs from 'express-ws';
import { WebSocket } from 'ws';
import { v4 as uuid } from 'uuid';

// TODO: Implement room logic later
const roomList = new Map<string, Map<string, WebSocket>>();

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
      roomList.set(id, new Map<string, WebSocket>());
    }

    res.status(200).send({ id });
  });

  // Setup ws events when connected
  playRoute.ws('/:id', (ws: WebSocket, req: Request) => {
    const roomId = req.params.id;

    console.log(req.headers);

    if (!roomId) {
      console.log('Ws Connection Failed: Room Id not provided');
      return;
    }

    ws.on('message', (msg: string) => {
      console.log(msg);
    });

    ws.on('close', () => {});
  });

  return playRoute;
};

export default getPlayRoutes;
