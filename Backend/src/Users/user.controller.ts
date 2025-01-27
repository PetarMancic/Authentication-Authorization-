import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { Roles } from 'src/auth/role/roles.decorator';
import { Role } from 'src/auth/role/role.enum';

import { RolesGuard } from 'src/auth/role/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('createUser')
  create(@Body() user: User): Promise<User> {
    return this.usersService.createUser(
      user.name,
      user.surname,
      user.nickname,
      user.email,
      user.username,
      user.password,
      user.role,
      user.verified,
    );
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // @Get('getUser/:id')
  // //probno
  // @UseGuards(AuthGuard)
  // async readUser(@Param('id') id: number, @Request() req) {
  //   return this.usersService.readUser(id, req.user);
  // }

  //probno
  @UseGuards(AuthGuard, RolesGuard) // ovo znaci da mora da se koristi token
  @Roles(Role.User) // samo user moze da pristupa
  @Get('getUser/:id')
  async readUser(@Param('id') id: number) {
    return this.usersService.readUser(id);
  }

  @Post('verifyUser/:email')
  async verifyUser(@Param('id') email:string)
  {
    return this.usersService.verifyUser(email);
  }

  @UseGuards(AuthGuard)
  @Get('prezime')
  getPrezime(@Request() req) {
    return req.user.prezime;
  }

  @Get('prezime1/:id')
  async getPrizime(@Param('id') id: number) {
    return this.usersService.readUser(id);
  }
}
