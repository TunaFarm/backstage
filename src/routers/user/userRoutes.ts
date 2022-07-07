import { Request, Response, Router } from 'express';
import expressWs from 'express-ws';

const getUserRoutes = (): expressWs.Router => {
  const userRoute = Router();

  userRoute.post('/', (req: Request, res: Response) => {
    res.json({
      success: true,
    });
  });

  return userRoute;
};
export default getUserRoutes;
