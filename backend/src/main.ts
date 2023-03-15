import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { writeFileSync } from 'fs';

import { WorkerService } from 'nestjs-graphile-worker';

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
  app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true });

  if (process.env.CREATE_OPENAPI_FILE === 'true') {
    await createOpenapiFile(app);
  }

  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));

  app.get(WorkerService).run();

  await app.listen(process.env.REVIEWTIME_API_PORT);
}

async function createOpenapiFile(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('ReviewTime')
    .setDescription('The ReviewTime main API')
    .setVersion(process.env.npm_package_version)
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) =>
      methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  writeFileSync('openapi.json', JSON.stringify(document, undefined, 2), {
    encoding: 'utf8',
  });
}

bootstrap();
