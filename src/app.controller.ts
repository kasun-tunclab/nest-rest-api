import { Controller, Get } from '@nestjs/common';
import {AppService, VersionInfo} from './app.service';

@Controller("v1")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/ping")
  ping(): string {
    return 'I am alive!';
  }

  @Get('/version')
  version(): VersionInfo {
    return this.appService.getVersion();
  }

  // add health checks using  https://docs.nestjs.com/recipes/terminus
}
