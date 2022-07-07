import crypto from 'crypto';
import { sign } from 'jsonwebtoken';
import Bech32Address from '../../utils/bech32';
import { PubKeySecp256k1 } from '../../utils/secp256k1';
import { getUnixTime } from '../../utils/time';
import { DeviceFlowCodes } from './types';

export const createNonce = (): string => {
  const timestamp = Date.now();
  const seed = process.env.NONCE_SEED;

  const nonce = crypto
    .createHash('sha256')
    .update(`${timestamp}${seed}`)
    .digest('base64');

  return nonce;
};

// TODO: Save this access token to database
const generateAccessToken = (walletAddress: string): string => {
  const tokenInfo = {
    walletAddress,
    iat: getUnixTime(),
    exp: getUnixTime() + 3600,
  };

  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    throw new Error('JWT_SECRET is not defined');
  }

  const token = sign(tokenInfo, secretKey, { algorithm: 'HS256' });

  return token;
};

// Minimal verification of the signature, prone to errors :P
export const verifySignature = (
  walletAddress: string,
  message: string,
  signature: string,
): string => {
  const prefix = 'aura';
  Bech32Address.validate(walletAddress, prefix);

  const publicKey = new PubKeySecp256k1(
    Bech32Address.fromBech32(walletAddress).address,
  );

  if (
    publicKey.verify(
      Buffer.from(message, 'base64'),
      Buffer.from(signature, 'base64'),
    )
  ) {
    return generateAccessToken(walletAddress);
  }

  throw new Error('Invalid signature');
};

// TODO: Save codes into database, in a temporary table
export const generateCode = (): DeviceFlowCodes => {
  const genBytes = (n: number): string => crypto.randomBytes(n).toString();

  const deviceCode = `${genBytes(4)}-${genBytes(4)}-${genBytes(4)}`;
  const userCode = crypto.randomBytes(6).toString();

  const webUrl = process.env.WEB_UI_URL;
  if (!webUrl) {
    throw new Error('WEB_UI_URL is not set');
  }

  const verficationUrl = `${webUrl}/verify?userCode=${userCode}`;

  return {
    deviceCode,
    userCode,
    verficationUrl,
  };
};
