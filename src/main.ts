import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for production
  if (process.env.NODE_ENV === 'production') {
    app.enableCors();
  }

  await app.listen(3000, '0.0.0.0');
  console.log(
    `Application is running in ${process.env.NODE_ENV || 'development'} mode`,
  );
}
bootstrap();
