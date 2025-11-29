import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
}));
