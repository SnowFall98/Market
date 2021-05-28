# NODE

Recuerda siempre instalar [Node.js](https://nodejs.org/es/download/) en su última versión para una mejor ejecución de procesos.

# Proceso para clonación

1. Lo primero es crear un proyecto Node.js en cualquier ubicación.
2. Una vez instalado, hacer la clonación del Git y reemplazar los archivos existentes por la rama master.
3. Conectar DB y otras API's key que se requieran
4. Ejecutar ng serve -o para levantar el servidor

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

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

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
