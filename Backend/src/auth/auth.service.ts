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
  

async signIn(username: string, pass: string, rememberMe:boolean=false): Promise<any> {
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

  console.log(username,pass,rememberMe);
  console.log(" remember ima vrednost", rememberMe);
  const expiresIn= rememberMe?  '24h':'60sec';

  const accessToken = await this.jwtService.signAsync(payload, {expiresIn});

  // Loguj access_token da vidiš šta se desava
  console.log('Generated Access Token:', accessToken);

  return {
      access_token: accessToken,
      expiresIn
  };
  }
  
  async validateToken(token: string): Promise<object> {
    try {
      // Pokušavamo da validiramo token
      const decoded = await this.jwtService.verifyAsync(token);
      console.log('Token decoded:', decoded); // Log za proveru dekodiranog sadržaja
      return {isValid:true}; // Token je validan
    } catch (error) {
      console.error('Token validation failed:', error.message); // Log greške
      return {isValid:false}; // Token nije validan
    }
  }

}