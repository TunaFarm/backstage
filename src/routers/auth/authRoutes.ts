import { Request, Response, Router } from 'express';
import expressWs from 'express-ws';
import { createNonce, generateCode, verifySignature } from './auth';
import {
  GenerateCodeResponse,
  GetNonceResponse,
  VerifySignatureResponse,
} from './types';

const getAuthRoutes = (): expressWs.Router => {
  const authRoute = Router();

  authRoute.get('/nonce', (req: Request, res: Response<GetNonceResponse>) => {
    const nonce = createNonce();
    res.json({
      success: true,
      data: {
        nonce,
      },
    });
  });

  authRoute.post(
    '/verify',
    (req: Request, res: Response<VerifySignatureResponse>) => {
      const { walletAddress, message, signature } = req.body;
      const accessToken = verifySignature(walletAddress, message, signature);
      res.json({
        success: true,
        data: {
          accessToken,
        },
      });
    },
  );

  authRoute.get(
    '/code',
    (req: Request, res: Response<GenerateCodeResponse>) => {
      const { deviceCode, userCode, verficationUrl } = generateCode();
      res.json({
        success: true,
        data: {
          deviceCode,
          userCode,
          verficationUrl,
        },
      });
    },
  );

  return authRoute;
};

export default getAuthRoutes;
