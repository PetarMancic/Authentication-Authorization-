import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './Users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Worlddd Petar!';
  }
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(
    ime: string,
    prezime: string,
    nadimak: string,
  ): Promise<User> {
    const user = new User();
    user.ime = ime;
    user.prezime = prezime;
    user.nadimak = nadimak;

    return await this.userRepository.save(user);
  }

  async getUserById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } }); // Pronalaženje korisnika po ID
  }
}
