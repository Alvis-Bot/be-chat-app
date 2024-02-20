import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { CrosConfig } from './common/config/cros.config';
import { SwaggerConfig } from './common/config/swagger.config';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import helmet from 'helmet';
import { WebsocketAdapter } from './gateway/gateway.adapter';
import * as cookieParser from 'cookie-parser';
import {JwtService} from "@nestjs/jwt";
async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);
  const adapter = new WebsocketAdapter(app);
  app.useWebSocketAdapter(adapter);
  const configService: ConfigService = app.get(ConfigService);
  const logger: Logger = new Logger('bootstrap');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  })
  if (configService.get<string>('NODE_ENV') === 'dev') {
    SwaggerConfig.init(app);
  }


  app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(configService.get<number>('PORT'), (): void => {
    logger.log(
      `Listening at http://localhost:${configService.get<number>('PORT')}`,
    );
    logger.log(
      `Running in environment ${configService.get<string>('NODE_ENV')}`,
    );
  });
}
bootstrap().then(() => Logger.log('Server started'));
