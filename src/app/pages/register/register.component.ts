import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersModel } from '../../models/users.model';
import { UsersService } from '../../services/users.service';
import { Capitalize, Sweetalert } from '../../functions';

declare var jQuery:any;
declare var $:any;

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
  Capitalizar la primera letra de nombre y apellido
  =============================================*/

  capitalize(input){

    input.value = Capitalize.fnc(input.value)

  }

  /*=============================================
  Validación de expresión regular del formulario
  =============================================*/
  validate(input){

    let pattern;

    if($(input).attr("name") == "username"){

      pattern = /^[A-Za-z]{2,8}$/;

      input.value = input.value.toLowerCase();

      this.usersService.getFilterData("username", input.value)
      .subscribe(resp=>{
        
        if(Object.keys(resp).length > 0){

          $(input).parent().addClass('was-validated')

          input.value = "";

          Sweetalert.fnc("error", "El nombre de usuario ya existe", null)

          return;
         
        }

      })
    }

    if($(input).attr("name") == "password"){

      pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/;
      
    }

    if(!pattern.test(input.value)){

      $(input).parent().addClass('was-validated')

      input.value = "";
    
    }

  }

  onSubmit(f: NgForm){

    /*=============================================
  	Validación y bloqueo desde el back al validar datos
  	=============================================*/

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


      if(resp["email"] == this.user.email){

        /*=============================================
        Registro en Firebase Database
        =============================================*/

        this.user.displayName = `${this.user.first_name } ${this.user.last_name}`;
        this.user.method = "direct";
        this.user.needConfirm = false;
        this.user.username = this.user.username.toLowerCase();
 
        this.usersService.registerDatabase(this.user)
        .subscribe(resp=>{
              
          Sweetalert.fnc("success", "Confirme su cuenta en su correo electrónico (verifique el correo no deseado)", "login")

        })

      }

		}, err =>{

      Sweetalert.fnc("error", err.error.error.message, null)

    })

  }

}
