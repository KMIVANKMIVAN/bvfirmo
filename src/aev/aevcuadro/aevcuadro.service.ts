import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Connection } from 'mysql2/promise';

@Injectable()
export class AevcuadroService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly connection: Connection,
  ) {}

  async buscarProyectosContcodIdUser(codigodeproyecto: string, iduser: number) {
    try {
      const idDepartamentoUsuario = await this.buscarUsuarioPorId(iduser);
      let sql: string;
      if (
        idDepartamentoUsuario[0].id === 10 ||
        idDepartamentoUsuario[0].id === 11
      ) {
        sql = `
        SELECT p.id, p.num, p.proyecto_nombre, p.idTipo, t.tipo, p.departamento, d.departamento  
        FROM cuadro.proyectosexcel p,
        cuadro.tipo t,
        cuadro.departamentos d 
        WHERE p.idTipo = t.idTipo
        and p.departamento = d.id
        and num LIKE '%${codigodeproyecto}%'
        and activo = 1
        `;
      } else {
        sql = `
        SELECT p.id, p.num, p.proyecto_nombre, p.idTipo, t.tipo, p.departamento, d.departamento  
        FROM cuadro.proyectosexcel p,
        cuadro.tipo t,
        cuadro.departamentos d 
        WHERE p.idTipo = t.idTipo
        and p.departamento = d.id
        and num LIKE '%${codigodeproyecto}%'
        AND p.departamento = '${idDepartamentoUsuario[0].id}'
        and activo = 1

        `;
      }
      const [usuarios] = await this.connection.execute(sql, [
        `%${codigodeproyecto}%`,
      ]);

      if (!usuarios || !usuarios[0]) {
        throw new BadRequestException({
          statusCode: 404,
          error: `Sin datos`,
          message: `Sin datos`,
        });
      }
      return usuarios; // Devuelve el usuario con el ID especificado
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (buscarProyectosContcodIdUser): ${error}`,
          message: `Error del Servidor en (buscarProyectosContcodIdUser): ${error}`,
        });
      }
    }
  }
  async buscarUsuarioPorId(id: number) {
    try {
      const query = `
        SELECT
        users.username, 
        departamento.id 
      FROM
        sipago.users
        INNER JOIN
        sipago.oficinas
        ON 
          users.id_oficina = oficinas.id
        INNER JOIN
        sipago.departamento
        ON 
          oficinas.departamento = departamento.id
        WHERE users.id = ?
        `;
      const [usuario] = await this.connection.execute(query, [`${id}`]);
      if (!usuario || !usuario[0]) {
        throw new BadRequestException({
          statusCode: 404,
          error: `El Usuario ${id}  NO Existe`,
          message: `Usuario ${id}  no fue encontrado`,
        });
      }
      return usuario;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (buscarNombreUsuarioDepartemento): ${error}`,
          message: `Error del Servidor en (buscarNombreUsuarioDepartemento): ${error}`,
        });
      }
    }
  }
}
