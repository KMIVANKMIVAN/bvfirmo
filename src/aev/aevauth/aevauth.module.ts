import { Module } from '@nestjs/common';
import { AevauthService } from './aevauth.service';
import { AevauthController } from './aevauth.controller';

import { AevusuariosModule } from '../aevusuarios/aevusuarios.module';

import { JwtModule } from '@nestjs/jwt';
import { aevjwtConstants } from './aev-constants';

@Module({
  imports: [
    AevusuariosModule,
    JwtModule.register({
      global: true,
      secret: aevjwtConstants.secret,
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AevauthController],
  providers: [AevauthService],
})
export class AevauthModule {}
