import { StandardResponse } from '../../../types/response';

export interface DeviceFlowCodes {
  deviceCode: string;
  userCode: string;
  verficationUrl: string;
}

export interface GetNonceResponse extends StandardResponse<{ nonce: string }> {}

export interface VerifySignatureResponse
  extends StandardResponse<{ accessToken: string }> {}

export interface GenerateCodeResponse
  extends StandardResponse<DeviceFlowCodes> {}
