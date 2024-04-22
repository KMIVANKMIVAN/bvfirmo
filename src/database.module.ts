// database.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createConnection } from 'mysql2/promise';

@Module({
  imports: [ConfigModule], // Importa ConfigModule si lo estás utilizando aquí
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        return await createConnection({
          host: configService.get<string>('IPBASEDEDATOS'), // O configService.get<string>('IPBASEDEDATOS')
          user: configService.get<string>('USERBASEDEDATOS'),
          port: configService.get<number>('PUERTODEDATOS'),
          password: configService.get<string>('DATABASESIPAGOPASSWORD'),
          database: configService.get<string>('DATABASESIPAGO'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DATABASE_CONNECTION'], // Exporta la conexión para que otros módulos puedan importarla
})
export class DatabaseModule {}
