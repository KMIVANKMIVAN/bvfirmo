import { Test, TestingModule } from '@nestjs/testing';
import { AevsipagoService } from './aevsipago.service';

describe('AevsipagoService', () => {
  let service: AevsipagoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AevsipagoService],
    }).compile();

    service = module.get<AevsipagoService>(AevsipagoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
