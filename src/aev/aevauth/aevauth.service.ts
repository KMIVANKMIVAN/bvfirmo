import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { AevusuariosService } from '../aevusuarios/aevusuarios.service';

@Injectable()
export class AevauthService {
  constructor(
    private aevusuariosService: AevusuariosService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string): Promise<any> {
    try {
      const user = await this.aevusuariosService.porNombreUsuario(username);
      if (!user) {
        throw new BadRequestException({
          error: `El Usuario ${username} NO Existe`,
          message: `Usuario ${username} no fue encontrado`,
        });
      }
      if (user.habilitado === 0) {
        throw new BadRequestException({
          statusCode: 401,
          error: `Usuario ${username} NO ESTA HABILITADO`,
          message: `Usuario ${username} NO ESTA HABILITADO`,
        });
      }
      const secretKey = '2, 4, 6, 7, 9, 15, 20, 23, 25, 30';
      const sha256Hash = crypto.createHmac('sha256', secretKey);

      sha256Hash.update(password);

      const hashedData = sha256Hash.digest('hex');

      if (hashedData !== user.password) {
        throw new BadRequestException({
          statusCode: 400,
          error: `Contraseña del Usuario ${username} NO ES CORRECTA`,
          message: `Usuario con nombre de usuario ${username} no ingresó la contraseña correcta`,
        });
      }

      const payload = {
        sub: user.id,
        username: user.username,
        nivel: user.nivel,
        prioridad: user.prioridad,
        id_oficina: user.idOficina,
      };
      return {
        access_token_aev: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (signIn): ${error}`,
          message: `Error del Servidor en (signIn): ${error}`,
        });
      }
    }
  }
}
