import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { VerifyMailService } from 'src/verify-mail/verify-mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService,VerifyMailService],  //ovo nemoj da zaboravis da ukljucis, zbog toga puca program
  // ako u user service koristis neki drugi servis, ovde u module mora da se doda
  exports: [UsersService] 
})
export class UsersModule {}
