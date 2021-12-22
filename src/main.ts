import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from "fs";

function readAndSetVersionEnvVars() {
  const versionString = fs.readFileSync('./version.txt').toString();
  const vi = versionString.split('::');
  process.env['VERSION'] = vi[0];
  process.env['CREATED_DATE'] = vi[1];
}

async function bootstrap() {

  readAndSetVersionEnvVars();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
