import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(parseInt(process.env.PORT as string));
}
bootstrap();
