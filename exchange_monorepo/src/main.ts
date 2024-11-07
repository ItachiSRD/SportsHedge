import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { config } from './core/config';
import { GlobalExceptionFilter } from './core/filters/exception.filter';
import { ResponseInterceptor } from './core/interceptor/response.interceptor';
import { UpdateOrdersService } from './modules/update-orders/update-orders.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.setGlobalPrefix(config.server.basePath);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[]) => {
        throw validationErrors;
      },
    }),
  );

  app.useLogger(app.get(Logger));

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const swaggerConf = new DocumentBuilder()
    .setTitle('Exchange monorepo')
    .setDescription(
      'This is the exchange monorepo for sportshedge, where OES, OMS and User service will be placed',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConf);

  SwaggerModule.setup('api', app, document);

  const updateOrderService = app.get(UpdateOrdersService);
  // Graceful shutdown
  // TODO: Most apps send SIGTERM, it's not graceful, revisit
  process.on('SIGINT', async () => {
    console.log('Stopping Server');
    await updateOrderService.stop(); // ensure, no async function is running without await, else, it will terminate all running processes, also close db connection
    await app.close();
    process.exit(0);
  });

  process.on('uncaughtException', (ex) => {
    console.log('Uncaught exception happened, ex: ', ex);
  });

  process.on('unhandledRejection', (ex) => {
    console.log('Unhandled rejection happened, ex: ', ex);
  });

  await app.listen(config.server.port);
}
bootstrap();
