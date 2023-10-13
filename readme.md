<p align="center">
<img src="./public/img/presentation.jpg" width="400" alt="Nest Logo" />
</p>

# Proyecto - 03 Blog Api - App


## Description del Proyecto

este proyecto es una api de un blog, que permitira a los usuarios, registrase, iniciar seccion, subir post, comentar post, ver post, se podra subir imagenes, ir al perfinl de usuario. la aplicacion esta construida utilizandoo node.js express.js y utuliza como base de datos PostgresSQL para almacenar la informacion


## Caracteres principales

1. crear post 

2. subir imagenes 

3. registrar usuario

4. loguearse con un usuario

5. utiliza websockets para cuando se cree un post, se emita ese post a todos los clientes

6. comentar Post

7. eliminar Post

8. Actualizar Post 



# Tecnologias Utilizadas

1. express: un framework minimalista de node.js que facilita la creacion de aplicaciones web y APIs.

2. express-rate-limit: es un middleware que se utiliza para limitar las solicitudes repetidas a APIs públicas y / o puntos finales como la autenticación y el restablecimiento de contraseñas.

3. express-validator: es un middleware de validación de datos para Express. Proporciona validación y saneamiento de datos de entrada.

4. helmet: es un middleware de seguridad que ayuda a proteger las aplicaciones Express / Connect de algunas de las vulnerabilidades conocidas de la web mediante la configuración de encabezados HTTP adecuados.

5. postgreSQL: es un sistema de gestión de bases de datos relacional orientado a objetos y de código abierto.

6. firebase: Una plataforma de desarrollo de aplicaciones móviles y web que proporciona bases de datos en tiempo real y servicios de autenticación para permitir a los desarrolladores crear aplicaciones.

7. sequelize: Un ORM (Object Relational Mapper) para bases de datos SQL. que simplifica el trabajo con bases de datos SQL escribiendo código JavaScript en lugar de SQL.

8. jsonwebtoken: es una implementación de JSON Web Tokens (JWT) para Node.js que permite la creación y verificación de tokens JWT.

9. socket.io: es una biblioteca de JavaScript para aplicaciones web en tiempo real. Permite la comunicación bidireccional en tiempo real entre clientes y servidores web.


## Requisitos previos para la utilizacion del proyecto

1. tener instalado node.js

2. tener instalado postgresSQL

3. tener creada una base de datos en postgresSQL


## Como ejecutar el proyecto

1. clonar el repositorio

2. ejecutar el siguiente comando para instalar las dependencias:
```

  npm install

```

3. crear una base de datos local en postgresSQL

4. crearse una app en firebase e inicializar el firestore en ella

5. clonar el .env.template y renombrarlo a .env y llenar las variables de entorno

6. levantar el modo desarrollo con el siguiente comando:
```

  npm run start:dev
