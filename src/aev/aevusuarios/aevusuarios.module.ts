import { Module } from '@nestjs/common';
import { AevusuariosService } from './aevusuarios.service';
import { AevusuariosController } from './aevusuarios.controller';
import { DatabaseSipagoModule } from '../../basededatos/databasesipago.module';

@Module({
  imports: [DatabaseSipagoModule],
  controllers: [AevusuariosController],
  providers: [AevusuariosService],
  exports: [AevusuariosService],
})
export class AevusuariosModule {}
