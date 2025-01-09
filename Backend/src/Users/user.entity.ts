import { Role } from 'src/auth/role/role.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ime: string;

  @Column()
  prezime: string;

  @Column()
  nadimak: string;

  
  @Column({ unique: true })
  email: string;

  @Column()
  password:string;

  @Column()
  role:string // moze da ima vise uloga

}
