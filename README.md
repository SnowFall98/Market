# NODE

Recuerda siempre instalar [Node.js](https://nodejs.org/es/download/) en su última versión para una mejor ejecución de procesos.

# Proceso para clonación

1. Lo primero es crear un proyecto Node.js en cualquier ubicación.
2. Una vez instalado, hacer la clonación del Git y reemplazar los archivos existentes por la rama master.
3. Conectar DB y otras API's key que se requieran
4. Ejecutar `ng serve --live-reload false` para levantar el servidor

# Instalación de Dependencias para el correcto funcionamiento

Debemos instalar estas dependencias dentro del proyecto en la consola para el correcto funcionamiento.

TYPE SCRIPT FUNCTION: 
`npm install --save @types/chart.js`

SDK DE FIREBASE:
`npm install --save firebase`

JQUERY DATATABLE PLUGIN:
`npm i angular-datatables`
`npm i @types/datatables.net --save-dev`

CONFIRMATION POPOVER PLUGIN:
`npm install --save angular-confirmation-popover`

NOTIE ALERT PLUGIN:
`npm install notie`

CREACIÓN DE COOKIES EN ANGULAR:
`npm install js-cookie --save`
`npm install @types/js-cookie --save`

EDITOR DE TEXTO ENRIQUECIDO: SUMMERNOTE
`npm install --save summernote ngx-summernote`

CREACIÓN DE ALGORITMO MD5:
`npm i md5-typescript`

INPUT TAG:
`npm i ngx-chips`

DROPZONE:
`npm install --save ngx-dropzone`

# Errores de ejecución
Se pueden presentar errores como: 
1. "An unhandled exception occurred: Script file ./node_modules/js-cookie/src/js.cookie.js does not exist." 
2. "El archivo ..\npm\ng.ps1 no está firmado digitalmente. No se puede ejecutar este script en el sistema actual." 

Para solucionar el error de que no encuentra el archivo .js escribiremos lo siguiente en la terminal:
npm install --save @types/chart.js

Para solucionar el error de las firmas digitales debemos modificar en PowerShell lo siguiente:
1. Abrimos el Windows PowerShell como administrador.
2. Ejecutamos el comando «Get-ExecutionPolicy» nos tendría que devolver «Unrestricted»
3. Para cambiar esta configuración basta con ejecutar «Set-ExecutionPolicy Unrestricted».
Con esto ya no debería presentar fallas y la ejecución del proyecto debería funcionar.

# Market

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.3.

## Información sobre FireBase Database Realtiem

Los nombres de las `CATEGORÍAS` de la Base de Datos `NO PUEDEN IR CON NINGÚN SIGNO DE PUNTUACIÓN, SÍMBOLOS O CARACTERES ESPECIALES`

Ya que, al poseer alguno de estos, `NO SE REGISTRARÁ VISTAS o VIEWS` cuando entran a esta categoría.

Lo mismo aplica para las `SUBCATEGORÍAS`

# Levantar el servidor

Para levantar el servidor con certificado `SSL (https)` se debe realizar lo siguiente:

1. Ir a el archivo `config.js` 
2. Comentar la linea 6 y dejar sin comentario la linea 10
3. Ejecuta el siguiente comando para USAR CERTIFICADO SSL (https)
4. `ng serve --ssl true --ssl-cert "/path/to/file.crt" --ssl-key "/path/to/file.key"`
5. En caso de que no funcione utilizar este: `ng serve --ssl`
6. Navegar a `https://localhost:4200/`

Si se desea ejecutar de forma normal el servidor local (http): 
1. Ir a el archivo `config.js`
2. Comentar la linea 10 y dejar sin comentario la linea 6
3. Ejecutar `ng serve --o`
4. Navegar a `http://localhost:4200/`


# INICIAR ANGULAR SIN "HOT RELOAD":
`ng serve --live-reload false`
Es necesario usar esta linea en vez de `ng serve --o` ya que, al no hacerlo, presentará fallas porque se esta administrando de manera local. Al subirlo al dominio ya no hay necesidad


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
