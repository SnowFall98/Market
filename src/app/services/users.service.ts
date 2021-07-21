import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Api, Register} from '../config';

import { UsersModel } from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
	private api:string = Api.url;
	private register:string = Register.url;

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



}