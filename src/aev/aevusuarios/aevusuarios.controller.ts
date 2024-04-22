import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  // UseGuards,
} from '@nestjs/common';
import { AevusuariosService } from './aevusuarios.service';

@Controller('aevusuarios')
export class AevusuariosController {
  constructor(private readonly aevusuariosService: AevusuariosService) {}

  @Get()
  getHello(): string {
    return 'Hola';
  }

  //
  @Post('/:nivel')
  crearUsuario(@Param('nivel') nivel: number, @Body() datosUsuario: any) {
    return this.aevusuariosService.crearUsuario(nivel, datosUsuario);
  }

  @Get()
  traerTodosUsuarios() {
    return this.aevusuariosService.traerTodosUsuarios();
  }

  @Get('nombreusuario/:nombreusuario')
  porNombreUsuario(@Param('nombreusuario') nombreusuario: string) {
    return this.aevusuariosService.porNombreUsuario(nombreusuario);
  }

  @Get(':id')
  porIdUsuario(@Param('id') id: number) {
    return this.aevusuariosService.porIdUsuario(id);
  }

  @Patch(':id')
  actualizarUsuario(
    @Param('id') id: number,
    @Body() actualizarDatosUsuario: any,
  ) {
    return this.aevusuariosService.actualizarUsuario(
      +id,
      actualizarDatosUsuario,
    );
  }

  //buscar por nombre de usuario y departemento
  @Get('/bnud/:nombreusuario/:idoficina')
  buscarNombreUsuarioDepartemento(
    @Param('nombreusuario') nombreusuario: string,
    @Param('idoficina') idoficina: number,
  ) {
    return this.aevusuariosService.buscarNombreUsuarioDepartemento(
      nombreusuario,
      idoficina,
    );
  }

  //buscar por nombres de usuario o carnet
  @Get('/bnc/:nombresusuariocarnet')
  buscarNombreUsuarioCarnet(
    @Param('nombresusuariocarnet') nombreusuariocarnet: string,
  ) {
    return this.aevusuariosService.buscarNombresUsuarioCarnet(
      nombreusuariocarnet,
    );
  }

  //reiniciar la contrasenia a la por defecto
  @Patch('rcpd/:id')
  reiniciarContraseniaPorDefecto(@Param('id') id: number) {
    return this.aevusuariosService.reiniciarContraseniaPorDefecto(+id);
  }

  @Delete(':id')
  eliminarUsuario(@Param('id') id: number) {
    return this.aevusuariosService.eliminarUsuario(+id);
  }
}
