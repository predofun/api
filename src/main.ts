import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENVIRONMENT } from './common/configs/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(ENVIRONMENT.APP.PORT || 3000);
}
bootstrap();
