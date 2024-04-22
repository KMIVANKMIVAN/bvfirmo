import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Connection } from 'mysql2/promise';

import * as crypto from 'crypto';

@Injectable()
export class AevusuariosService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly connection: Connection,
  ) {}

  async crearUsuario(nivel: number, datosUsuario: any) {
    try {
      if (nivel != 1) {
        throw new UnauthorizedException({
          statusCode: 401,
          error: `El Usuario ${datosUsuario.username} no Puede ser Creado, USTED NO ES UN ADMINISTRADOR`,
          message: `El Usuario ${datosUsuario.username} no Puede ser Creado, USTED NO ESTA AUTORIZADO`,
        });
      }

      const usuarioExiste = await this.porNombreUsuarioVoF(
        datosUsuario.username,
      );
      if (usuarioExiste) {
        throw new BadRequestException({
          statusCode: 400,
          error: `El Usuario con nombre ${datosUsuario.username} YA EXISTE`,
          message: `El Usuario con nombre ${datosUsuario.username} YA FUE REGISTRADO`,
        });
      }

      const correoExiste = await this.usuarioCorreoExiste(datosUsuario.email);
      if (correoExiste) {
        throw new BadRequestException({
          statusCode: 400,
          error: `El Usuario con correo ${datosUsuario.email} YA EXISTE`,
          message: `El Usuario con correo ${datosUsuario.email} YA FUE REGISTRADO`,
        });
      }

      // Verificar si el usuario ya existe por número de cédula de identidad
      const cedulaExiste = await this.usuarioCedulaIdentidadExiste(
        datosUsuario.cedula_identidad,
      );
      if (cedulaExiste) {
        throw new BadRequestException({
          statusCode: 400,
          error: `El Usuario con carnet ${datosUsuario.cedula_identidad} YA EXISTE`,
          message: `El Usuario con carnet ${datosUsuario.cedula_identidad} YA FUE REGISTRADO`,
        });
      }

      const llaveSecreta = '2, 4, 6, 7, 9, 15, 20, 23, 25, 30';

      const sha256Hash = crypto.createHmac('sha256', llaveSecreta);

      sha256Hash.update(datosUsuario.password);

      const hashedData = sha256Hash.digest('hex');

      datosUsuario.password = hashedData;

      datosUsuario.fecha_creacion = this.obtenerFechaActual();
      datosUsuario.mosca = this.obtenerIniciales(datosUsuario.nombre);

      const campos = [
        'superior',
        'id_oficina',
        'dependencia',
        'username',
        'password',
        'nombre',
        'last_login',
        'mosca',
        'cargo',
        'email',
        'logins',
        'fecha_creacion',
        'habilitado',
        'nivel',
        'genero',
        'prioridad',
        'id_entidad',
        'super',
        'cedula_identidad',
        'expedido',
        'theme',
      ];

      const valores = campos.map((campo) => {
        if (datosUsuario[campo] !== undefined) {
          return datosUsuario[campo];
        } else if (campo === 'habilitado' || campo === 'nivel') {
          return 1;
        } else if (campo === 'genero') {
          return 'hombre';
        } else if (campo === 'prioridad') {
          return 0;
        } else {
          return null;
        }
      });

      const query = `INSERT INTO users (${campos.join(', ')}) VALUES (${valores.map(() => '?').join(', ')})`;

      await this.connection.execute(query, valores);

      // Después de la inserción, recuperamos los datos del usuario recién insertado
      const [rows] = await this.connection.query(
        'SELECT * FROM users WHERE id = LAST_INSERT_ID()',
      );

      if (!rows) {
        throw new BadRequestException({
          statusCode: 404,
          error: `No se pudo crear al Usuarios.`,
          message: `No se pudo crear al Usuarios.`,
        });
      }

      return rows[0]; // Devolvemos los datos completos del usuario recién creado
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw new InternalServerErrorException({
        statusCode: 500,
        error: `Error del Servidor en (create): ${error}`,
        message: `Error del Servidor en (create): ${error}`,
      });
    }
  }

  async traerTodosUsuarios() {
    try {
      const [usuarios] = await this.connection.query('SELECT * FROM users');
      if (usuarios) {
        throw new BadRequestException({
          statusCode: 404,
          error: `No se encontraron Usuarios.`,
          message: `No se encontraron Usuarios.`,
        });
      }
      return usuarios;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (traerTodosUsuarios): ${error}`,
          message: `Error del Servidor en (traerTodosUsuarios): ${error}`,
        });
      }
    }
  }

  async porNombreUsuario(nombreUsuario: string) {
    try {
      const [usuarios] = await this.connection.query(
        'SELECT * FROM users WHERE username = ?',
        [nombreUsuario],
      );

      if (!usuarios || !usuarios[0]) {
        throw new BadRequestException({
          statusCode: 404,
          error: `El Usuario ${nombreUsuario} NO Existe`,
          message: `Usuario con nombre de usuario ${nombreUsuario} no fue encontrado`,
        });
      }

      return usuarios[0]; // Devolvemos el primer usuario encontrado
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (porNombreUsuario): ${error}`,
          message: `Error del Servidor en (porNombreUsuario): ${error}`,
        });
      }
    }
  }

  async porIdUsuario(id: number) {
    try {
      const [usuario] = await this.connection.query(
        'SELECT * FROM users WHERE id = ?',
        [id],
      );
      if (!usuario || !usuario[0]) {
        throw new BadRequestException({
          statusCode: 404,
          error: `El Usuario con ID ${id} NO Existe`,
          message: `Usuario con ID ${id} no fue encontrado`,
        });
      }
      return usuario[0]; // Devuelve el usuario con el ID especificado
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (porIdUsuario): ${error}`,
          message: `Error del Servidor en (porIdUsuario): ${error}`,
        });
      }
    }
  }

  async actualizarUsuario(id: number, actualizarDatosUsuario: any) {
    try {
      const usuarioExiste = await this.porIdUsuario(id);

      const camposActualizar = Object.keys(actualizarDatosUsuario)
        .map((campo) => `${campo} = ?`)
        .join(', ');

      const valoresActualizar = Object.values(actualizarDatosUsuario);

      const query = `UPDATE users SET ${camposActualizar} WHERE id = ?`;

      valoresActualizar.push(id);

      await this.connection.execute(query, valoresActualizar);

      const [usuarioActualizado] = await this.connection.query(
        'SELECT * FROM users WHERE id = ?',
        [id],
      );

      if (!usuarioActualizado || !usuarioActualizado[0]) {
        throw new BadRequestException({
          statusCode: 400,
          error: `El Usuario con ID ${id} NO se actualizo correctamente`,
          message: `Usuario con ID ${id} no se actualizo correctamente`,
        });
      }

      return usuarioActualizado[0];
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (actualizarUsuario): ${error}`,
          message: `Error del Servidor en (actualizarUsuario): ${error}`,
        });
      }
    }
  }

  async buscarNombreUsuarioDepartemento(
    nombreusuario: string,
    idoficina: number,
  ) {
    try {
      const query = `
        SELECT
          users.id,
          users.username,
          users.nombre,
          users.cargo,
          users.nivel,
          departamento.departamento,
          departamento.acronimo
        FROM
          users
          INNER JOIN
          oficinas
          ON
            users.id_oficina = oficinas.id
          INNER JOIN
          departamento
          ON
            oficinas.departamento = departamento.id
        WHERE
          users.username LIKE ? AND
          users.id_oficina = ?
        LIMIT 5
      `;
      const [usuarios] = await this.connection.execute(query, [
        `%${nombreusuario}%`,
        idoficina,
      ]);
      if (!usuarios || !usuarios[0]) {
        throw new BadRequestException({
          statusCode: 404,
          error: `El Usuario ${nombreusuario} con OFICINA: ${idoficina} NO Existe`,
          message: `Usuario ${nombreusuario} con OFICINA: ${idoficina} no fue encontrado`,
        });
      }
      return usuarios; // Devuelve el usuario con el ID especificado
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

  async buscarNombresUsuarioCarnet(nombreusuariocarnet: string) {
    try {
      const query = `
      SELECT * FROM users
      WHERE username LIKE ? OR cedula_identidad LIKE ?
      LIMIT 5
    `;
      const [usuarios] = await this.connection.execute(query, [
        `%${nombreusuariocarnet}%`,
        `%${nombreusuariocarnet}%`,
      ]);
      if (!usuarios || !usuarios[0]) {
        throw new BadRequestException({
          statusCode: 404,
          error: `El Usuario ${nombreusuariocarnet}  NO Existe`,
          message: `Usuario ${nombreusuariocarnet}  no fue encontrado`,
        });
      }
      return usuarios; // Devuelve el usuario con el ID especificado
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (buscarNombreUsuarioCarnet): ${error}`,
          message: `Error del Servidor en (buscarNombreUsuarioCarnet): ${error}`,
        });
      }
    }
  }

  async reiniciarContraseniaPorDefecto(id: number) {
    try {
      const usuarioExiste = await this.porIdUsuario(id);

      const secretKey = '2, 4, 6, 7, 9, 15, 20, 23, 25, 30';
      const defaultPassword = '708090';

      const sha256Hash = crypto.createHmac('sha256', secretKey);
      sha256Hash.update(defaultPassword);
      const hashedData = sha256Hash.digest('hex');

      const query = `UPDATE users SET password = ? WHERE id = ?`;

      await this.connection.execute(query, [hashedData, id]);

      const [reiniciarContrasenia] = await this.connection.query(
        'SELECT * FROM users WHERE id = ?',
        [id],
      );

      if (!reiniciarContrasenia || !reiniciarContrasenia[0]) {
        throw new BadRequestException({
          statusCode: 400,
          error: `El Usuario con ID ${id} NO se actualizo su contraseña correctamente`,
          message: `Usuario con ID ${id} no se actualizo su contraseña correctamente`,
        });
      }

      return reiniciarContrasenia[0];
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (actualizarUsuario): ${error}`,
          message: `Error del Servidor en (actualizarUsuario): ${error}`,
        });
      }
    }
  }

  async eliminarUsuario(id: number) {
    try {
      const usuarioEliminado = await this.porIdUsuario(id);

      const query = `DELETE FROM users WHERE id = ?`;

      await this.connection.execute(query, [id]);

      return {
        mensaje: `Usuario con ID ${id} eliminado correctamente`,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          statusCode: 500,
          error: `Error del Servidor en (eliminarUsuario): ${error}`,
          message: `Error del Servidor en (eliminarUsuario): ${error}`,
        });
      }
    }
  }

  //metodos
  obtenerFechaActual = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  obtenerIniciales = (nombreCompleto) => {
    const palabras = nombreCompleto.split(' ');
    let iniciales = '';

    for (const palabra of palabras) {
      iniciales += palabra[0].toUpperCase();
    }

    return iniciales;
  };

  async usuarioCorreoExiste(correoElectronico: string): Promise<boolean> {
    const [result] = await this.connection.execute(
      'SELECT COUNT(*) as count FROM users WHERE email = ?',
      [correoElectronico],
    );
    return result[0].count > 0;
  }

  async usuarioCedulaIdentidadExiste(
    cedulaIdentidad: number,
  ): Promise<boolean> {
    const [result] = await this.connection.execute(
      'SELECT COUNT(*) as count FROM users WHERE cedula_identidad = ?',
      [cedulaIdentidad],
    );
    return result[0].count > 0;
  }

  async porNombreUsuarioVoF(nombreUsuario: string): Promise<boolean> {
    const [usuarios] = await this.connection.query(
      'SELECT * FROM users WHERE username = ?',
      [nombreUsuario],
    );

    // Verifica si usuarios es un array y tiene la propiedad length
    return Array.isArray(usuarios) && usuarios.length > 0;
  }
}
