import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    //swagger
    const config = new DocumentBuilder()
    .setTitle('sandPro-swagger')
    .setDescription('API description')
    .setVersion('1.0.0')
    .addCookieAuth('jwt', { type: 'http', in: 'cookie' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();