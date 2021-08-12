import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Api, Register, Login, SendEmailVerification, ConfirmEmailVerification } from '../config';

import { UsersModel } from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
	private api:string = Api.url;
	private register:string = Register.url;
	private login:string = Login.url;
	private sendEmailVerification:string = SendEmailVerification.url;
	private confirmEmailVerification:string = ConfirmEmailVerification.url;

  constructor(private http:HttpClient) { }

   	/*=============================================
	Registro en Firebase Authentication
	=============================================*/
	
	registerAuth(user: UsersModel){

		return this.http.post(`${this.register}`, user);

	}

	/*=============================================
	Registro en Firebase Database
	=============================================*/

	registerDatabase(user: UsersModel){

		delete user.first_name;
		delete user.last_name;
		delete user.password;
		delete user.returnSecureToken;

		return this.http.post(`${this.api}/users.json`, user);

	}

	/*=============================================
  	Filtrar data para buscar coincidencias
  	=============================================*/

  	getFilterData(orderBy:string, equalTo:string){

    	return this.http.get(`${this.api}users.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

  	}

	/*=============================================
  	Login en Firebase Authentication
  	=============================================*/
  
  	loginAuth(user: UsersModel){

    	return this.http.post(`${this.login}`, user);

  	}
	  
	/*=============================================
  	Enviar verificación de correo electrónico
  	=============================================*/

  	sendEmailVerificationFnc(body:object){

		return this.http.post(`${this.sendEmailVerification}`, body);

	}

	/*=============================================
  	Confirmar email de verificación
  	=============================================*/

  	confirmEmailVerificationFnc(body:object){

		return this.http.post(`${this.confirmEmailVerification}`, body);

	}

	/*=============================================
  	Actualizar data de usuario RD
  	=============================================*/

  	patchData(id:string, value:object){

		return this.http.patch(`${this.api}users/${id}.json`,value);

	}



}