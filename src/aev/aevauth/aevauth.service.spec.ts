import { Test, TestingModule } from '@nestjs/testing';
import { AevauthService } from './aevauth.service';

describe('AevauthService', () => {
  let service: AevauthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AevauthService],
    }).compile();

    service = module.get<AevauthService>(AevauthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
