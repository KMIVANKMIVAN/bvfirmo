import { Controller } from '@nestjs/common';
import { AevconsultasexternasService } from './aevconsultasexternas.service';

@Controller('aevconsultasexternas')
export class AevconsultasexternasController {
  constructor(private readonly aevconsultasexternasService: AevconsultasexternasService) {}
}
