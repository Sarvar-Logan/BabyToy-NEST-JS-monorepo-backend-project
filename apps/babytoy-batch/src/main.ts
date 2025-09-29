import { NestFactory } from '@nestjs/core';
import { BabytoyBatchModule } from './babytoy-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(BabytoyBatchModule);
  await app.listen(process.env.PORT_BATCH ?? 3006);
}
bootstrap();
