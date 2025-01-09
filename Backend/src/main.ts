import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Omogućite CORS
  app.enableCors({
    origin: 'http://localhost:3001', // Dozvolite samo React aplikaciji da pristupi API-ju
    credentials: true,              // Ako koristite kolačiće ili autentifikaciju
  });

  // await app.listen(3000); 

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
