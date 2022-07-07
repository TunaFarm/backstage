/* eslint-disable no-console */
import express, { Request, Response } from 'express';
import expressWs from 'express-ws';
import getAuthRoutes from './routers/auth/authRoutes';
import getUserRoutes from './routers/user/userRoutes';
import getPlayRoutes from './routers/ws/playRoutes';

require('dotenv').config();

const { app } = expressWs(express(), undefined, {
  wsOptions: { clientTracking: true },
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Spellcasters');
});

app.use('/api/user', getUserRoutes());

app.use('/api/auth', getAuthRoutes());

app.use('/ws/play', getPlayRoutes());

app.use((req: Request, res: Response) => res.status(404).send());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on port ${process.env.PORT}`);
});
