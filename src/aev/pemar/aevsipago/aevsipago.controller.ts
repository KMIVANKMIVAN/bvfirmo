import { Controller } from '@nestjs/common';
import { AevsipagoService } from './aevsipago.service';

@Controller('aevsipago')
export class AevsipagoController {
  constructor(private readonly aevsipagoService: AevsipagoService) {}
}
