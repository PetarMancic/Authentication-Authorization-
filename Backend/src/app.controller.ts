import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }
  
  @Get('user/:id')
  async getUser(@Param('id') id: number) {
    return this.appService.getUserById(id);
  }


  @Post('create-user')
  async createUser(@Body() body: { ime: string, prezime: string, nadimak: string }) {
    return this.appService.createUser(body.ime, body.prezime, body.nadimak);
  }


  
}
