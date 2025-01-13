import { Role } from 'src/auth/role/role.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  nickname: string;

  
  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password:string;

  @Column()
  role:string; // moze da ima vise uloga

  @Column({ default: false })
  verified:boolean;

}
