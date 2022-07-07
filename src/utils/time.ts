export const MINUTE_TO_SECOND = 60;
export const SECOND_TO_MS = 1000;

export const getUnixTime = (): number => Math.floor(Date.now() / 1000);

// eslint-disable-next-line arrow-body-style
export const sleep = async (ms: number): Promise<void> => {
  /* eslint-disable no-promise-executor-return */
  return new Promise((resolve) => setTimeout(resolve, ms));
};
