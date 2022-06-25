/* eslint-disable no-console */
import { Request, Router } from 'express';
import expressWs from 'express-ws';
import { WebSocket } from 'ws';

// TODO: Implement room logic later
// const roomList = new Map<string, Map<string, WebSocket>>();

// TODO: Need a middleware to check all ws info before connection to ws
const getPlayRoutes = (): expressWs.Router => {
  const playRoute = Router();

  playRoute.ws('/:id', (ws: WebSocket, req: Request) => {
    const roomId = req.params.id;

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
