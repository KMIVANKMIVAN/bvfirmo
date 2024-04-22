import { Module } from '@nestjs/common';
import { AevsipagoService } from './aevsipago.service';
import { AevsipagoController } from './aevsipago.controller';

@Module({
  controllers: [AevsipagoController],
  providers: [AevsipagoService],
})
export class AevsipagoModule {}
