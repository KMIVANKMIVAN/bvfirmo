import { Test, TestingModule } from '@nestjs/testing';
import { AevconsultasexternasService } from './aevconsultasexternas.service';

describe('AevconsultasexternasService', () => {
  let service: AevconsultasexternasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AevconsultasexternasService],
    }).compile();

    service = module.get<AevconsultasexternasService>(AevconsultasexternasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
