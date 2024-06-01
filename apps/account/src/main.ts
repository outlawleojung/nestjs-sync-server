import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import expressBasicAuth from 'express-basic-auth';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import {
  ENV_SWAGGER_PASSWORD,
  ENV_SWAGGER_USER,
} from '@lib/common/constants/env-keys.const';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env[ENV_SWAGGER_USER]]: process.env[ENV_SWAGGER_PASSWORD],
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('로그인 서버 API')
    .setDescription('[로그인 및 계정 관련 개발을 위한 API 문서')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port: number = parseInt(process.env.ACCOUNT_SERVER_PORT, 10);
  await app.listen(port | 3030);
  console.info(
    `Account application started on port : ${port} - ${process.env.NODE_ENV}`,
  );
}
bootstrap();
