import { Body, Controller, Get, Param } from '@nestjs/common';
import { VerifyMailService } from './verify-mail.service';
import { UsersService } from 'src/Users/user.service';
import { RealIP } from 'nestjs-real-ip';


@Controller('verify-mail')
export class VerifyMailController {
  constructor(
    private readonly mailService: VerifyMailService,
    private readonly UserService: UsersService,
  ) {}

  @Get('send-welcome-email')
  async sendWelcomeEmail(@Body() email: string) {
    await this.mailService.sendWelcomeEmail(email); //ovu fju poziva fja za registrovanje novog usera, tj create
    return 'Welcome email sent!';
  }

  @Get('verifyUser/:email') // Ruta za klik na dugme u emailu
  async verifyUser(@Param('email') email: string) {
    const isVerified = await this.UserService.verifyUser(email); // Ovaj servis se sada koristi
    if (isVerified) {
      return 'User verified successfully!';
    }
    return 'Verification failed or user not found!';
  }


  @Get('my-ip')
  getMyIp(): string {
    const address= this.mailService.getLocalIPv4();
      console.log(address);
    return address;
  }

}
