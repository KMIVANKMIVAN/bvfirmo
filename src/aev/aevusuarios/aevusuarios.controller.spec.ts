import { Test, TestingModule } from '@nestjs/testing';
import { AevusuariosController } from './aevusuarios.controller';
import { AevusuariosService } from './aevusuarios.service';

describe('AevusuariosController', () => {
  let controller: AevusuariosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AevusuariosController],
      providers: [AevusuariosService],
    }).compile();

    controller = module.get<AevusuariosController>(AevusuariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
