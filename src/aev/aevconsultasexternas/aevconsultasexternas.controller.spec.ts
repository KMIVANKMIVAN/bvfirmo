import { Test, TestingModule } from '@nestjs/testing';
import { AevconsultasexternasController } from './aevconsultasexternas.controller';
import { AevconsultasexternasService } from './aevconsultasexternas.service';

describe('AevconsultasexternasController', () => {
  let controller: AevconsultasexternasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AevconsultasexternasController],
      providers: [AevconsultasexternasService],
    }).compile();

    controller = module.get<AevconsultasexternasController>(AevconsultasexternasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
