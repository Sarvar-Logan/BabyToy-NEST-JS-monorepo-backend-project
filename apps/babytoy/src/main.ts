import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';
import { graphqlUploadExpress } from "graphql-upload"
import * as express from 'express';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // pipe validation
  app.useGlobalInterceptors(new LoggingInterceptor());  // intercepter for logging 
  app.enableCors({ origin: true, credentials: true });
  app.use(graphqlUploadExpress({ maxFileSize: 15000000, maxFile: 10 }));
  app.use("/uploads", express.static("./uploads"));

  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(process.env.PORT_API ?? 3005);
}
bootstrap();







/** 
 GLOBAL INTEGRATSIALAR  
 1. main.ts   ===>  pipe(validation),  Intercetor(logging), uploader, WEB_SOCKET
 2. app.module.ts   ===>  env, graphQl (gloablErrorHandling = no try catch), databasa, component.module(Hamma loyiha modul ichida)
 3. components.module.ts  ===>  hamma modullar import boladi
 
 


 STANDARTS 
 1. monorepo
 2. Hamma modoullar componentsda (member, porudct ...)
 3. database connection
 4. graphql integration(1ta api)
 5. libs [types, dto, enums, interceptor, config.ts]
    schema ...
 6. member.module davom etadi(authication, authorization)
 7. test qilinadi.
 8. GLOBAL INTEGRATSIAYALR HAMMASI YAKUNLANADI(validaton, errorhandling, imageuploader, logging)
 9. davom etadi ...
**/