import { Module } from '@nestjs/common';
import { AevcuadroService } from './aevcuadro.service';
import { AevcuadroController } from './aevcuadro.controller';
import { DatabaseCuadroModule } from '../../basededatos/databasecuadro.module';
import { DatabaseSipagoModule } from '../../basededatos/databasesipago.module';

@Module({
  imports: [DatabaseCuadroModule, DatabaseSipagoModule],
  controllers: [AevcuadroController],
  providers: [AevcuadroService],
})
export class AevcuadroModule {}
