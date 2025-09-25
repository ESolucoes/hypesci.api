// api/index.ts
import 'reflect-metadata';
import serverless from 'serverless-http';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module'; // ⬅️ importa da SRC (não de dist)

let handler: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();
  // @ts-ignore
  return serverless(app.getHttpAdapter().getInstance());
}

export default async (req: any, res: any) => {
  if (!handler) handler = await bootstrap();
  return handler(req, res);
};
