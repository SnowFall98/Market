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