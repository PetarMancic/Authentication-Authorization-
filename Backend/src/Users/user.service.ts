import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { error } from 'console';
import { throwError } from 'rxjs';
import { VerifyMailService } from 'src/verify-mail/verify-mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private verifyMailService:VerifyMailService
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  //crud operacija create, read, update, delete
  async createUser(
    name: string = "",
    surname: string = "",
    nickname: string = "",
    email: string = "",
    username:string="",
    password: string = "",
    role:string = "",
    verified:boolean
  ): Promise<User> {
    const saltRounds = 10; // Broj iteracija za generisanje soli
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if(!email || !username )
    {
      error("Email and password is required!");
    }

    const user = this.usersRepository.create({
      name,
      surname,
      nickname,
      email,
      username,
      password: hashedPassword, // Čuvaj samo heširanu lozinku
      role:"user", // ovde napisati logiku na osnovu cega ce se dodeljivati razlicit role
      //npr na osnovu emaila, useri uvek gmail, a admini en.rs nprr..
      verified:false


    });
    if(user)
    {
      this.verifyMailService.sendWelcomeEmail(user.email); //na ovaj mail ce 
    }

    return this.usersRepository.save(user);
  }

  async readUser(id: number) {
    const user =  await this.usersRepository.findOne({where:{id}}); // posto je findOne iz typeOrm asinhorna fja i vraca promise 
    console.log("user ima vrednosti ", user);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  
    // Proverite da li korisnik ima prava pristupa
    // if (currentUser.roles.includes('admin') || currentUser.id === user.id) {
    //   return user;
    // } else {
    //   throw new Error('Unauthorized access');
    // }
  }
  

  async updateUser(
    id: number,
    _ime: string,
    _prezime: string,
    _nadimak: string,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      user.name = _ime;
      user.surname = _prezime;
      user.nickname = _nadimak;

      return this.usersRepository.save(user);
    }

    return null;
  }

  async verifyUser(email:string):Promise<boolean>
  {
    const user=await this.usersRepository.findOne({where:{email}});
    if(!user)
    {
      throw new NotFoundException(`User with email: ${email} not found`);
    }
    user.verified=true;
    this.usersRepository.save(user);

    return true;
  }

  async vratiPrezime(id: number): Promise<String> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (user) 
      {return user.surname;}

    return null;
  }
}
