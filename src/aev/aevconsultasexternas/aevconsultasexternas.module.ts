import { Module } from '@nestjs/common';
import { AevconsultasexternasService } from './aevconsultasexternas.service';
import { AevconsultasexternasController } from './aevconsultasexternas.controller';

@Module({
  controllers: [AevconsultasexternasController],
  providers: [AevconsultasexternasService],
})
export class AevconsultasexternasModule {}
