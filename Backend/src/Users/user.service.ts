import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  //crud operacija create, read, update, delete
  async createUser(
    ime: string,
    prezime: string,
    nadimak: string,
    email: string,
    password: string,
    role:string
  ): Promise<User> {
    const saltRounds = 10; // Broj iteracija za generisanje soli
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = this.usersRepository.create({
      ime,
      prezime,
      nadimak,
      email,
      password: hashedPassword, // Čuvaj samo heširanu lozinku
      role

    });

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
      user.ime = _ime;
      user.prezime = _prezime;
      user.nadimak = _nadimak;

      return this.usersRepository.save(user);
    }

    return null;
  }

  async vratiPrezime(id: number): Promise<String> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (user) 
      {return user.prezime;}

    return null;
  }
}
