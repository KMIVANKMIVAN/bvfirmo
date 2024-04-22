import { Test, TestingModule } from '@nestjs/testing';
import { AevusuariosService } from './aevusuarios.service';

describe('AevusuariosService', () => {
  let service: AevusuariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AevusuariosService],
    }).compile();

    service = module.get<AevusuariosService>(AevusuariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
