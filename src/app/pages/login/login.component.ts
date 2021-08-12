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
		Validar acción de recordar credencial de correo
		=============================================*/

		if(localStorage.getItem("rememberMe") && localStorage.getItem("rememberMe") == "yes"){

			this.user.email = localStorage.getItem("email");
			this.rememberMe = true;

		}

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

    /*=============================================
		Verificar cuenta de correo electrónico
		=============================================*/

		if(this.activatedRoute.snapshot.queryParams["oobCode"] != undefined &&
    this.activatedRoute.snapshot.queryParams["mode"] == "verifyEmail"){

      let body = {

        oobCode: this.activatedRoute.snapshot.queryParams["oobCode"]
      }

      this.usersService.confirmEmailVerificationFnc(body)
      .subscribe(resp=>{

        if(resp["emailVerified"]){

          /*=============================================
          Actualizar Confirmación de correo en Database
          =============================================*/ 

          this.usersService.getFilterData("email", resp["email"])
          .subscribe(resp=>{

            for(const i in resp){

              let id = Object.keys(resp).toString();

              let value = {

                needConfirm: true
              }

              this.usersService.patchData(id, value)
              .subscribe(resp=>{

                if(resp["needConfirm"]){

                  Sweetalert.fnc("success", "¡Correo Confirmado, puedes ingresar ahora!", "login")
                }

              })

            }

          })

        }

      }, err =>{

        if(err.error.error.message == "INVALID_OOB_CODE"){

          Sweetalert.fnc("error", "El correo ya fue confirmado", "login")	

        }
      })
    }
    
    /*=============================================
		Confirmar cambio de contraseña
		=============================================*/

		if(this.activatedRoute.snapshot.queryParams["oobCode"] != undefined &&
    this.activatedRoute.snapshot.queryParams["mode"] == "resetPassword"){

      let body = {

        oobCode: this.activatedRoute.snapshot.queryParams["oobCode"]
      }

      this.usersService.verifyPasswordResetCodeFnc(body)
      .subscribe(resp=>{

        if(resp["requestType"] == "PASSWORD_RESET"){

          $("#newPassword").modal()

        }
      })
    }


  }

  /*=============================================
  Validación de expresión regular del formulario
  =============================================*/
   
  validate(input){

    let pattern;

    if($(input).attr("name") == "password"){

      pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/;
      
    }

    if(!pattern.test(input.value)){

      $(input).parent().addClass('was-validated')

      input.value = "";
    
    }

  }

  /*=============================================
  Envío del formulario
  =============================================*/

  onSubmit(f: NgForm ){

		if(f.invalid ){

      return;

		}

	 	/*=============================================
    Alerta suave mientras se registra el usuario
    =============================================*/

    Sweetalert.fnc("loading", "Loading...", null)

    /*=============================================
    Validar que el correo esté verificado
    =============================================*/

    this.usersService.getFilterData("email", this.user.email) 
    .subscribe( resp1 =>{

      for(const i in resp1){

        if(resp1[i].needConfirm){

          /*=============================================
          Login en Firebase Authentication
          =============================================*/
          
          this.user.returnSecureToken = true;

          this.usersService.loginAuth(this.user)
          .subscribe( resp2 => {

          /*=============================================
          Almacenar id Token en Firebase Database
          =============================================*/

          let id = Object.keys(resp1).toString();

            let value = {

              idToken: resp2["idToken"]
            }

            this.usersService.patchData(id, value)
            .subscribe(resp3=>{

              if(resp3["idToken"] != ""){

                Sweetalert.fnc("close", null, null)
          
                /*=============================================
                Almacenamos el Token de seguridad en el localstorage
                =============================================*/

                localStorage.setItem("idToken", resp3["idToken"]);

                /*=============================================
                Almacenamos el email en el localstorage
                =============================================*/

                localStorage.setItem("email", resp2["email"]);

                /*=============================================
                Almacenamos la fecha de expiración localstorage
                =============================================*/

                let today = new Date();

                today.setSeconds(resp2["expiresIn"]);

                localStorage.setItem("expiresIn", today.getTime().toString());

                /*=============================================
                Almacenamos recordar email en el localStorage
                =============================================*/

                if(this.rememberMe){

                  localStorage.setItem("rememberMe", "yes");
                
                }else{

                  localStorage.setItem("rememberMe", "no");
                }

                /*=============================================
                Redireccionar al usuario a la página de su cuenta
                =============================================*/

                window.open("account", "_top");

              }

            })

          }, err =>{

              Sweetalert.fnc("error", err.error.error.message, null)

          })

        }else{

          Sweetalert.fnc("error", 'Need Confirm your email', null)

        }

      }

    }) 		
  }

  /*=============================================
  Enviar solicitud para recuperar Contraseña
  =============================================*/

  resetPassword(value){

    Sweetalert.fnc("loading", "Loading...", null)

    let body = {

      requestType: "PASSWORD_RESET",
      email: value

    }

    this.usersService.sendPasswordResetEmailFnc(body)
    .subscribe(resp=>{

      if(resp["email"] == value){

        Sweetalert.fnc("success", "Revise su correo electrónico para cambiar la contraseña", "login")

      }

    })

  }

  /*=============================================
  Enviar nueva Contraseña
  =============================================*/

  newPassword(value){

    if(value != ""){

      Sweetalert.fnc("loading", "Loading...", null)

      let body = {

        oobCode: this.activatedRoute.snapshot.queryParams["oobCode"],
        newPassword: value

      }

      this.usersService.confirmPasswordResetFnc(body)
      .subscribe(resp=>{

        if(resp["requestType"] == "PASSWORD_RESET"){

          Sweetalert.fnc("success", "Cambio de contraseña exitoso, inicie sesión ahora", "login")

        }

      })

    }

  }

  

}