import { HttpException, HttpStatus } from '@nestjs/common';

export class NotVerifiedException extends HttpException {
  constructor(message = 'User is not verified') {
    super(message, HttpStatus.FORBIDDEN); // Postavlja HTTP status na 403 Forbidden
  }
}
