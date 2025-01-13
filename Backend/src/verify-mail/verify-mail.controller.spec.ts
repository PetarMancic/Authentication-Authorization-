import { Test, TestingModule } from '@nestjs/testing';
import { VerifyMailController } from './verify-mail.controller';

describe('VerifyMailController', () => {
  let controller: VerifyMailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerifyMailController],
    }).compile();

    controller = module.get<VerifyMailController>(VerifyMailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
