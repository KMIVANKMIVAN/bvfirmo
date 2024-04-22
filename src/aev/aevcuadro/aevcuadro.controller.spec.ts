import { Test, TestingModule } from '@nestjs/testing';
import { AevcuadroController } from './aevcuadro.controller';
import { AevcuadroService } from './aevcuadro.service';

describe('AevcuadroController', () => {
  let controller: AevcuadroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AevcuadroController],
      providers: [AevcuadroService],
    }).compile();

    controller = module.get<AevcuadroController>(AevcuadroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
