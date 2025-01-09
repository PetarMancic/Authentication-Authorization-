import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './Users/user.controller';
import { UsersService } from './Users/user.service'; 

import { User } from './Users/user.entity'; // Pretpostavljamo da imamo entitet User
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UsersModule } from './Users/user.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/role/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432, // ili port na kojem je vaša baza
      username: 'postgres', // Vaš PostgreSQL username
      password: 'Lampanasto123!', // Vaš PostgreSQL password
      database: 'postgres', // Ime vaše baze podataka
      entities: [User], // Lista entiteta
      synchronize: true, // Ovo automatski kreira tabele na osnovu entiteta
      autoLoadEntities:true,
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule, // Ovaj deo omogućava pristup entitetima
    UsersModule
  ],
  controllers: [AppController,],
  providers: [AppService,
   
   
  ],
})
export class AppModule {}
