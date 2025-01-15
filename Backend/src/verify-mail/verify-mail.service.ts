import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/Users/user.service';
import * as os from 'os';


@Injectable()
export class VerifyMailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(to: string) {
    
    const ad=this.getLocalIPv4();
    console.log(ad);
    //const verifyUser = `http://localhost:3000/verify-mail/verifyUser/${to}`; // URL za klik na dugme u emailu
    const verifyUser= `http://${ad}:3000/verify-mail/verifyUser/${to}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            text-align: center;
            padding: 20px;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }
          .email-header {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .email-body {
            font-size: 16px;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color:rgb(46, 167, 66);
            border-radius: 5px;
            text-decoration: none;
          }
          .button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">Welcome to Our Service!</div>
          <div class="email-body">
            Dear User,<br><br>
            Thank you for joining our service. We're thrilled to have you on board.<br>
            To get started, please click the button below to verify your email.
          </div>
          <a href="${verifyUser}" class="button">Verify Email</a>
        </div>
      </body>
      </html>
    `;

    await this.mailerService.sendMail({
      to, //kome saljemo
      subject: 'Welcome to Our Service!', //naslov
      html: htmlContent, //html stranica
    });
  }



  

  getLocalIPv4(): string {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
      for (const iface of networkInterfaces[interfaceName] || []) {
        // Proverite da li je IPv4 i nije interni (127.0.0.1)
        if (iface.family === 'IPv4' && !iface.internal && iface.address.startsWith('192.168.')) {
          return iface.address;
        }
      }
    }
    return '127.0.0.1'; // Fallback ako se ništa ne nađe
  }

}
