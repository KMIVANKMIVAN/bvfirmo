import { Controller, Get, Param } from '@nestjs/common';
import { AevcuadroService } from './aevcuadro.service';

@Controller('aevcuadro')
export class AevcuadroController {
  constructor(private readonly aevcuadroService: AevcuadroService) {}

  @Get('proyectos/:codigodeproyecto/:iduser')
  buscarProyectosContcodIdUser(
    @Param('codigodeproyecto') codigodeproyecto: string,
    @Param('iduser') iduser: number,
  ) {
    return this.aevcuadroService.buscarProyectosContcodIdUser(
      codigodeproyecto,
      iduser,
    );
  }
}
