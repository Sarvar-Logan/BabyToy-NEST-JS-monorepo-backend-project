import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';
import { graphqlUploadExpress} from "graphql-upload"
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // pipe validation
  app.useGlobalInterceptors(new LoggingInterceptor());  // intercepter for logging 
  app.enableCors({origin: true, credentials: true});
  app.use(graphqlUploadExpress({maxFileSize: 15000000, maxFile: 10}))
  app.use("/uploads", express.static("./uploads"))
  await app.listen(process.env.PORT_API ?? 3005);
}
bootstrap();
