import { Test, TestingModule } from '@nestjs/testing';
import { AevsipagoController } from './aevsipago.controller';
import { AevsipagoService } from './aevsipago.service';

describe('AevsipagoController', () => {
  let controller: AevsipagoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AevsipagoController],
      providers: [AevsipagoService],
    }).compile();

    controller = module.get<AevsipagoController>(AevsipagoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
