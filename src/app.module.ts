import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';

import { AevauthModule } from './aev/aevauth/aevauth.module';
import { AevusuariosModule } from './aev/aevusuarios/aevusuarios.module';
import { AevconsultasexternasModule } from './aev/aevconsultasexternas/aevconsultasexternas.module';
import { AevcuadroModule } from './aev/aevcuadro/aevcuadro.module';
import { AevsipagoModule } from './aev/viviendanueva/aevsipago/aevsipago.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development'],
      isGlobal: true,
    }),
    AevusuariosModule,
    AevauthModule,
    AevconsultasexternasModule,
    AevcuadroModule,
    AevsipagoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
