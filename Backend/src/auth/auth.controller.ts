import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
          private readonly jwtService:JwtService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password, signInDto.rememberMe);
  }


  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log(req.user)
    return req.user;
   
  }

  @UseGuards(AuthGuard)
  @Get('prezime')
  getPrezime(@Request() req) {
    console.log(req.user?.prezime)
    return req.user?.prezime;
   
  }


//ovde mozda treba useGuard da se iskoristi 
  @Post('validate-token')
  async validateToken(@Body('token') token: string) {
   return this.authService.validateToken(token);
  }
  
  




}
