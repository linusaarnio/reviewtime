import { randomFillSync } from 'crypto';

export const createState = () => {
  const randomBytes = Buffer.alloc(16);
  randomFillSync(randomBytes);
  return randomBytes.toString('hex');
};
