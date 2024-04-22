import { Test, TestingModule } from '@nestjs/testing';
import { AevauthController } from './aevauth.controller';
import { AevauthService } from './aevauth.service';

describe('AevauthController', () => {
  let controller: AevauthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AevauthController],
      providers: [AevauthService],
    }).compile();

    controller = module.get<AevauthController>(AevauthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
