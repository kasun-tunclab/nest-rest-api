import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("v1")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/ping")
  ping(): string {
    return this.appService.getHello();
  }

  // add health checks using  https://docs.nestjs.com/recipes/terminus
}
