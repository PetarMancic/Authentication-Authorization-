import { Injectable,UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Users/user.entity';
import { UsersService } from 'src/Users/user.service';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService:JwtService
      ) {}
  

async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({where:{ email}}); //napisati findOne metodu i onda impportujemo samo user Service
    if (!user || !(await bcrypt.compare(pass, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
    }
    // const { password, ...result } = user;
    // // TODO: Generate a JWT and return it here
    // // instead of the user object
    // return result;
    const payload = { ID: user.id, username: user.email, ime:user.ime,prezime: user.prezime, role:user.role}; //sub=subject jer je tako po jwt standardima 
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}