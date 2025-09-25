// api/index.ts
import 'reflect-metadata';
import serverless from 'serverless-http';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

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
  try {
    if (!handler) handler = await bootstrap();
    return handler(req, res);
  } catch (err: any) {
    console.error('SERVERLESS BOOT ERROR:', err?.stack || err?.message || err);
    // devolve algo legível pro log
    res.statusCode = 500;
    res.end('Boot error');
  }
};
