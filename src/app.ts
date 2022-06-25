import express, { Request, Response } from 'express';
import expressWs from 'express-ws';

import getUserRoutes from './routers/userRoutes';
import getPlayRoute from './routers/ws/playRoutes';

require('dotenv').config();

const { app } = expressWs(express(), undefined, {
  wsOptions: { clientTracking: true },
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Spellcasters');
});

app.use('/api/user', getUserRoutes());

// Need to initilize express-ws before import
app.use('/ws/play', getPlayRoute());

app.use((req: Request, res: Response) => res.status(404).send());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on port ${process.env.PORT}`);
});
