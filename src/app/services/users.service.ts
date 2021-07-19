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



}
