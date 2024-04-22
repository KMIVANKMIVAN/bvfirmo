import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AevsipagoService } from './aevsipago.service';
@Controller('aevsipago')
export class AevsipagoController {
  constructor(private readonly aevsipagoService: AevsipagoService) {}

  @Get('documentpdf/buscarproyectovn/:codigoproyecto')
  buscarProyetoViviendaNueva(@Param('codigoproyecto') codigoproyecto: string) {
    return this.aevsipagoService.buscarProyetoViviendaNueva(codigoproyecto);
  }

  @Get('compleja/:contcod')
  primeraConsultadeVN(@Param('contcod') contcod: string) {
    return this.aevsipagoService.primeraConsultadeVN(contcod);
  }

  @Get('tiporespaldo')
  obtenerTiposRespaldos() {
    return this.aevsipagoService.obtenerTiposRespaldos();
  }

  @Post('guardarrespaldodesembolsopdf')
  @UseInterceptors(FileInterceptor('file')) // Usa FileInterceptor
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() datos: any) {
    // Usa UploadedFile
    return this.aevsipagoService.guardarRespaldoDesembolsoPDF(
      file.buffer,
      datos,
    ); // Pasa file.buffer al servicio
  }
}
