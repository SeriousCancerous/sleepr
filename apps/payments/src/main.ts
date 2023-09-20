import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  app.connectMicroservice({
    tansport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('PORT')
    }
  })
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
}
bootstrap();
