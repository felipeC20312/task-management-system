import {registerAs} from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(String(process.env.PORT), 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
}));
