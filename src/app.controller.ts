import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      name: 'My API',
      version: '1.0.0',
      status: 'running',
    };
  }
}
