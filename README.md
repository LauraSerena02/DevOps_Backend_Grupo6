
A continuación, se detallan los pasos para la instalación del proyecto.
Instrucciones de instalación

1. Clonando los repositorios

	Pasos para la clonación

	Acceda al Directorio de Trabajo:

  Cambie al directorio donde se desea almacenar el código fuente del repositorio. Por ejemplo:
  cd /ruta/del/directorio

	Clonar los repositorios: Clone cada repositorio necesario utilizando el comando git clone. 
 
 	Reemplazar [URL_del_Repositorio] con la URL correspondiente.

	git clone [URL_del_Repositorio]

2. Instalando las diferentes dependencias en el archivo alojado en el directorio elegido previamente:

Instala las dependencias
Ejecuta el siguiente comando para instalar todas las dependencias necesarias:

npm install


3. Configurando las variables de entorno

El proyecto hace uso de variables de entorno para la configuración. Se brinda un archivo. env de ejemplo como. env.example en el directorio raíz.

host=localhost

portdb=3306

portbackend=3000

usernamedb=root

password= #Contraseña de la base de datos local configurada en la herramienta de gestión de bases de datos, por ejemplo, nuestro proyecto usa MySql Workbench

database=dbMisLuquitas

4. Archivo de base de datos estático

Nombre del Archivo: 

db.sql

Se encuentra en la carpeta database.

Descripción
Este archivo contiene datos estáticos necesarios para el funcionamiento del proyecto. Se utiliza para inicializar la base de datos o realizar pruebas.

Instrucciones de Uso
   - Copiar el Archivo:
Copia el archivo de base de datos estático a la ubicación de la base de datos activa o a donde se necesite para realizar las consultas.
La consulta esta detallada a todo lo largo.
