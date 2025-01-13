import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './Users/user.controller';
import { UsersService } from './Users/user.service'; 

import { MailerModule } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';

import { User } from './Users/user.entity'; // Pretpostavljamo da imamo entitet User
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UsersModule } from './Users/user.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/role/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { VerifyMailService } from './verify-mail/verify-mail.service';
import { VerifyMailController } from './verify-mail/verify-mail.controller';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

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
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule, // Ovaj deo omogućava pristup entitetima
    UsersModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // Mailosaur SMTP server
        port: 587, // Port za slanje e-mailova
        secure: false, // Ne koristi TLS, koristi STARTTLS
        auth: {
          user: 'petarmancic@gmail.com', // Tvoj Mailosaur korisnički identifikator (pre email-a)
          pass: 'imydmgkmndkuhyyu', // Tvoja Mailosaur lozinka
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@mailosaur.net>', // Adresa sa koje ćeš slati e-mailove
      },
      template: {
        dir: path.join(process.cwd(), 'dist/templates'), // Direktorijum za šablone
        adapter: new HandlebarsAdapter(), // Adapter za Handlebars
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController, VerifyMailController],
  providers: [AppService, VerifyMailService],
})
export class AppModule {}
