import { Component, OnInit } from '@angular/core';
import  { NgForm } from '@angular/forms';
import { Sweetalert } from '../../functions';
import { UsersModel } from '../../models/users.model';
import { UsersService  } from '../../services/users.service';
import { ActivatedRoute } from '@angular/router';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: UsersModel;
	rememberMe:boolean = false;

  constructor(private usersService: UsersService, private activatedRoute: ActivatedRoute) {

    this.user = new UsersModel();

   }

  ngOnInit(): void {

    /*=============================================
    Validar formulario de Bootstrap 4
    =============================================*/

    // Disable form submissions if there are invalid fields
    (function() {
      'use strict';
      window.addEventListener('load', function() {
        // Get the forms we want to add validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
          form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add('was-validated');
          }, false);
        });
      }, false);
    })();
  }

  /*=============================================
  Envío del formulario
  =============================================*/

  onSubmit(f: NgForm){

    if(f.invalid ){

      return;
    }

    /*=============================================
    Alerta suave mientras se registra el usuario
    =============================================*/

    Sweetalert.fnc("loading", "Loading...", null)

    /*=============================================
  	Registro en Firebase Authentication
  	=============================================*/
		
		this.user.returnSecureToken = true;

		this.usersService.registerAuth(this.user)
		.subscribe(resp=>{


    }, err =>{

      Sweetalert.fnc("error", err.error.error.message, null)

    })

  }

}