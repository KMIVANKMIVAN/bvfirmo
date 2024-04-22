import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { aevjwtConstants } from './aev-constants';
import { Request } from 'express';

@Injectable()
export class AevAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException({
          statusCode: 401,
          error: `No Existe El Token`,
          message: `No Existe El Token no se mando el token`,
        });
      }
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: aevjwtConstants.secret,
        });
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = payload;
      } catch {
        throw new UnauthorizedException({
          statusCode: 401,
          error: `No se pudo verificar El Token`,
          message: `No se pudo verificar El Token que se mando`,
        });
      }
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (canActivate): ${error}`,
          message: `Error del Servidor en (canActivate): ${error}`,
        });
      }
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
