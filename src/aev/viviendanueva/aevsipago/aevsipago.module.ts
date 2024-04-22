import { Module } from '@nestjs/common';
import { AevsipagoService } from './aevsipago.service';
import { AevsipagoController } from './aevsipago.controller';
import { DatabaseSipagoModule } from '../../../basededatos/databasesipago.module';

@Module({
  imports: [DatabaseSipagoModule],
  controllers: [AevsipagoController],
  providers: [AevsipagoService],
})
export class AevsipagoModule {}
