import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Connection } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class AevsipagoService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly connection: Connection,
    private configService: ConfigService,
  ) {}

  namePc = this.configService.get<string>('NAMEPC');
  fechaInicio = this.configService.get<string>('FECHAINICIO');
  documentosPath = `/home/${this.namePc}/Documentos/`;

  async buscarProyetoViviendaNueva(codigoproyecto: string) {
    try {
      const query = `
      SELECT * FROM (
        SELECT * FROM datoscontrato
        WHERE proy_cod LIKE ? OR cont_des LIKE ?
        UNION
        SELECT * FROM contratosigepro
        WHERE proy_cod LIKE ? OR cont_des LIKE ?
        ) AS resultados
        LIMIT 4;
        `;
      const [usuario] = await this.connection.execute(query, [
        `%${codigoproyecto}%`,
        `%${codigoproyecto}%`, // Duplicar el parámetro para el segundo LIKE
        `%${codigoproyecto}%`, // Duplicar el parámetro para el segundo LIKE
        `%${codigoproyecto}%`, // Duplicar el parámetro para el segundo LIKE
      ]);

      if (!usuario || !usuario[0]) {
        throw new BadRequestException({
          statusCode: 404,
          error: `Vivienda Nueva ${codigoproyecto} NO Existe`,
          message: `Vivienda Nueva ${codigoproyecto} no fue encontrado`,
        });
      }
      return usuario;
    } catch (error) {
      console.log(error);

      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (buscarProyetoViviendaNueva): ${error}`,
          message: `Error del Servidor en (buscarProyetoViviendaNueva): ${error}`,
        });
      }
    }
  }

  async primeraConsultadeVN(codigoproyecto: string) {
    try {
      const query = `
      SELECT 
            *,
            d.id AS iddesem,
            DATE_FORMAT(d.fecha_generado, '%d/%m/%Y') AS fechagenerado,
            DATE_FORMAT(d.fecha_banco, '%d/%m/%Y') AS fechabanco,
            d.monto_desembolsado,
            tp.detalle,
            tc.titular,
            tc.cuentatitular,
            CASE 
                WHEN (d.fecha_banco IS NULL OR d.fecha_banco = '') THEN 0
                ELSE 1
            END AS buttonAEV,
            CASE 
                WHEN (d.fecha_busa IS NULL OR d.fecha_busa = '')  THEN 0
                ELSE 1
            END AS buttonBUSA
        FROM desembolsos d
        INNER JOIN etapas e ON d.estado = e.id
        LEFT JOIN tipoplanillas tp ON d.tipo_planilla = tp.id
        LEFT JOIN titularcuenta tc ON d.idcuenta = tc.id 
        WHERE d.estado = 6
            AND d.cont_cod = ?
            AND d.fecha_insert >= '${this.fechaInicio}'
        `;
      const [usuario] = await this.connection.execute(query, [
        `${codigoproyecto}`,
      ]);

      if (!usuario || !usuario[0]) {
        throw new BadRequestException({
          statusCode: 404,
          error: `Vivienda Nueva ${codigoproyecto} NO Existe`,
          message: `Vivienda Nueva ${codigoproyecto} no fue encontrado`,
        });
      }
      return usuario;
    } catch (error) {
      console.log(error);

      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (buscarProyetoViviendaNueva): ${error}`,
          message: `Error del Servidor en (buscarProyetoViviendaNueva): ${error}`,
        });
      }
    }
  }

  async obtenerTiposRespaldos() {
    try {
      const query = `
        SELECT
        *
        FROM
        tipo_respaldo
        `;
      const [usuario] = await this.connection.execute(query);
      if (!usuario || !usuario[0]) {
        throw new BadRequestException({
          statusCode: 404,
          error: `No se encontraron datos en TIPO RESPALDO NO Existe`,
          message: `No se encontraron datos en TIPO RESPALDO`,
        });
      }
      return usuario;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (obtenerTiposRespaldos): ${error}`,
          message: `Error del Servidor en (obtenerTiposRespaldos): ${error}`,
        });
      }
    }
  }

  async guardarRespaldoDesembolsoPDF(file: Buffer, datos: any) {
    try {
      const pathFinal = this.documentosPath + '/' + datos.desembolsos_id;

      /* if (!fs.existsSync(pathFinal)) {
        throw new BadRequestException({
          statusCode: 404,
          error: `El documento con ID: ${datos.desembolsos_id} NO SE CARGO, No se podra cargar los Anexos`,
          message: `El documento con ID: ${datos.desembolsos_id}`,
        });
      } */

      const { tiporespaldo_id, ...restoDeDatos } = datos;

      const fechaActual = new Date();

      const desfracmentandoRespaldoDesembolso = {
        ...restoDeDatos,
        fecha_insert: fechaActual,
        tiporespaldo_id: tiporespaldo_id,
      };

      const campos = [
        'desembolsos_id',
        'archivo',
        'id_user',
        'fecha_insert',
        'referencia',
        'tiporespaldo_id',
      ];

      const valores = campos.map((campo) => {
        if (desfracmentandoRespaldoDesembolso[campo] !== undefined) {
          return desfracmentandoRespaldoDesembolso[campo];
        } else {
          return null;
        }
      });

      const tipoRespaldo = await this.connection.query(
        `SELECT sigla FROM tipo_respaldo WHERE id = ?`,
        [tiporespaldo_id],
      );

      if (!tipoRespaldo || !tipoRespaldo[0] || !tipoRespaldo[0][0].sigla) {
        throw new BadRequestException({
          statusCode: 404,
          error: `Tipo de respaldo con ID: ${tiporespaldo_id} NO Existe`,
          message: `Tipo de respaldo con ID: ${tiporespaldo_id}`,
        });
      }

      const query = `INSERT INTO respaldo_desembolsos (${campos.join(', ')}) VALUES (${valores.map(() => '?').join(', ')})`;
      await this.connection.execute(query, valores);

      const [rows] = await this.connection.query(
        'SELECT * FROM respaldo_desembolsos WHERE id = LAST_INSERT_ID()',
      );

      const campoArchivo = `${rows[0].id}-${tipoRespaldo[0][0].sigla}`;

      console.log(campoArchivo);

      const queryActualizar = `UPDATE respaldo_desembolsos SET archivo = ? , tiporespaldo_id = ? WHERE id = ?`;
      const parametrosActualizar = [campoArchivo, tiporespaldo_id, rows[0].id];

      await this.connection.execute(queryActualizar, parametrosActualizar);

      const nombreArchivo =
        campoArchivo + '-' + this.obtenerFechaYHoraActual() + '.pdf';

      const filePath = path.join(this.documentosPath, nombreArchivo);

      // Guardar el archivo en la ruta especificada
      fs.writeFileSync(filePath, file);

      // Retornar la ruta del archivo guardado
      return filePath;
    } catch (error) {
      console.log(error);

      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (guardarRespaldoDesembolsoPDF): ${error}`,
          message: `Error del Servidor en (guardarRespaldoDesembolsoPDF): ${error}`,
        });
      }
    }
  }

  //metodos
  obtenerFechaYHoraActual(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    return `${year}-${month}-${day}`;
  }
}
