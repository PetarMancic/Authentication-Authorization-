import { Injectable,UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Users/user.entity';
import { UsersService } from 'src/Users/user.service';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { NotVerifiedException } from 'src/not-verified.exception';
@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService:JwtService
      ) {}
  

async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({where:{ username}}); //napisati findOne metodu i onda impportujemo samo user Service
    if (!user || !(await bcrypt.compare(pass, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
    }
    if(user.verified==false)
    {
        throw new NotVerifiedException();
    }
    const payload = { 
      ID: user.id, 
      name: user.name, 
      surname: user.surname, 
      nickname:user.nickname,
      email:user.email,
      username: user.username, 
      role: user.role
  };

  const accessToken = await this.jwtService.signAsync(payload);

  // Loguj access_token da vidiš šta se desava
  console.log('Generated Access Token:', accessToken);

  return {
      access_token: accessToken,
  };
  }
}