import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getVersion(): VersionInfo {
    return {
      version: process.env['VERSION'],
      createdAt: process.env['CREATED_DATE']
    };
  }
}

export interface VersionInfo {
  version: string;
  createdAt: string;
}