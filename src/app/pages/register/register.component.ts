import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersModel } from '../../models/users.model';
import { UsersService  } from '../../services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: UsersModel;

  constructor(private usersService: UsersService) {

		this.user = new UsersModel(); 
  }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm){



    /*=============================================
  	Registro en Firebase Authentication
  	=============================================*/
		
		this.user.returnSecureToken = true;

		this.usersService.registerAuth(this.user)
		.subscribe(resp=>{

		}, err =>{

      //Sweetalert.fnc("error", err.error.error.message, null)

    })

  }

}
