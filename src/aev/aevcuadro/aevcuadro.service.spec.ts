import { Test, TestingModule } from '@nestjs/testing';
import { AevcuadroService } from './aevcuadro.service';

describe('AevcuadroService', () => {
  let service: AevcuadroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AevcuadroService],
    }).compile();

    service = module.get<AevcuadroService>(AevcuadroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
