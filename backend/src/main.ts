import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: process.env.SESSION_COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.SECURE_SESSION_COOKIE !== 'false' },
    }),
  ); // TODO implement another session store, default leaks memory: https://docs.nestjs.com/techniques/session
  // https://github.com/expressjs/session#compatible-session-stores
  await app.listen(process.env.REVIEWTIME_API_PORT);
}
bootstrap();
