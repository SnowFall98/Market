import { Component, OnInit } from '@angular/core';
import  { NgForm } from '@angular/forms';
import { Sweetalert } from '../../functions';
import { UsersModel } from '../../models/users.model';
import { UsersService  } from '../../services/users.service';
import { ActivatedRoute } from '@angular/router';
import "firebase/auth";
import firebase from "firebase/app";

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

    if($(input).attr("name") == "email"){

      pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
      
    }

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

          Sweetalert.fnc("error", 'Necesita confirmar su correo', null)

        }

      }

    }) 		
  }

  /*=============================================
  Enviar solicitud para recuperar Contraseña
  =============================================*/

  resetPassword(value){

    Sweetalert.fnc("loading", "Loading...", null);

    this.usersService.getFilterData("email", value)
		.subscribe(resp=>{

      if(Object.keys(resp).length > 0) {

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
      }else{

				Sweetalert.fnc("error", "El correo electrónico no existe en nuestra base de datos", null)

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

  /*=============================================
  Login con Facebook
  =============================================*/

  facebookLogin(){
    
    /*=============================================
		Documentacion para entender el SDK de Facebook/Firebase 
		//https://firebase.google.com/docs/auth/web/facebook-login
		=============================================*/
    
    let localUsersService = this.usersService;
    let localUser = this.user;

    const firebaseConfig = {
			apiKey: "AIzaSyBR9IUBZFVT4l1shmmdo1FDELSCOlER3zw",
      authDomain: "market-place-363dc.firebaseapp.com",
      databaseURL: "https://market-place-363dc-default-rtdb.firebaseio.com",
      projectId: "market-place-363dc",
      storageBucket: "market-place-363dc.appspot.com",
      messagingSenderId: "88795635850",
      appId: "1:88795635850:web:3b183d75f9e8a36b480d73",
      measurementId: "G-0VJ1CKBX6M"
		}

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  //https://firebase.google.com/docs/auth/web/facebook-login

  /*=============================================
  Crea una instancia del objeto proveedor de Facebook
  =============================================*/

  var provider = new firebase.auth.FacebookAuthProvider();

  /*=============================================
  acceder con una ventana emergente y con certificado SSL (https)
  =============================================*/
  //ng serve --ssl true --ssl-cert "/path/to/file.crt" --ssl-key "/path/to/file.key"

  firebase.auth().signInWithPopup(provider).then(function(result) {

    loginFirebaseDatabase(result, localUser, localUsersService)

  }).catch(function(error) {

    var errorMessage = error.message;

    Sweetalert.fnc("error", errorMessage, "login");

  });

  /*=============================================
  Registramos al usuario en Firebase Database
  =============================================*/

  function loginFirebaseDatabase(result, localUser, localUsersService){

    var user = result.user; 

    if(user.P){

      localUsersService.getFilterData("email", user.email)
      .subscribe(resp=>{

        if(Object.keys(resp).length > 0){

          if(resp[Object.keys(resp)[0]].method == "facebook"){

            /*=============================================
            Actualizamos el idToken en Firebase
            =============================================*/

            let id = Object.keys(resp).toString();

            let body = {	

              idToken: user.h.b.h
            }

            localUsersService.patchData(id, body)
            .subscribe(resp=>{

              /*=============================================
              Almacenamos el Token de seguridad en el localstorage
              =============================================*/

              localStorage.setItem("idToken", user.h.b.h);

              /*=============================================
              Almacenamos el email en el localstorage
              =============================================*/

              localStorage.setItem("email", user.email);

              /*=============================================
              Almacenamos la fecha de expiración localstorage
              =============================================*/

              let today = new Date();

              today.setSeconds(3600);

              localStorage.setItem("expiresIn", today.getTime().toString());

              /*=============================================
              Redireccionar al usuario a la página de su cuenta
              =============================================*/

              window.open("account", "_top");


            })

          }else{

            Sweetalert.fnc("error", `You're already signed in, please login with ${resp[Object.keys(resp)[0]].method} method`, "login")
          }

        }else{

          Sweetalert.fnc("error", "This account is not registered", "register")

        }


      })
      

    }
  }

}

	/*=============================================
  Login con Google
  =============================================*/

  googleLogin(){

    let localUsersService = this.usersService;
    let localUser = this.user;

    /*=============================================
		Documentacion para entender el SDK de Google/Firebase 
    https://firebase.google.com/docs/auth/web/google-signin
		=============================================*/

		// Orden de realizacion del SDK Firebase
		// Crea una nueva APP en Settings
		// npm install --save firebase
		// import firebase from "firebase/app"; -- Revisar documentacion ya que cambia la forma de importacion
		// import "firebase/auth"; -- Revisar documentacion ya que cambia la forma de importacion

		const firebaseConfig = {
			apiKey: "AIzaSyBR9IUBZFVT4l1shmmdo1FDELSCOlER3zw",
      authDomain: "market-place-363dc.firebaseapp.com",
      databaseURL: "https://market-place-363dc-default-rtdb.firebaseio.com",
      projectId: "market-place-363dc",
      storageBucket: "market-place-363dc.appspot.com",
      messagingSenderId: "88795635850",
      appId: "1:88795635850:web:3b183d75f9e8a36b480d73",
      measurementId: "G-0VJ1CKBX6M"
		}
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

		/*=============================================
		Crea una instancia del objeto proveedor de Google
		=============================================*/

		var provider = new firebase.auth.GoogleAuthProvider();

		/*=============================================
		acceder con una ventana emergente 
		=============================================*/

		firebase.auth().signInWithPopup(provider).then(function(result) {

			loginFirebaseDatabase(result, localUser, localUsersService)

		}).catch(function(error) {

			var errorMessage = error.message;

			Sweetalert.fnc("error", errorMessage, "login");

		});

		/*=============================================
		Registramos al usuario en Firebase Database
		=============================================*/

		function loginFirebaseDatabase(result, localUser, localUsersService){

			var user = result.user; 

			if(user.P){

				localUsersService.getFilterData("email", user.email)
				.subscribe(resp=>{

					if(Object.keys(resp).length > 0){

						if(resp[Object.keys(resp)[0]].method == "google"){

							/*=============================================
							Actualizamos el idToken en Firebase
							=============================================*/

							let id = Object.keys(resp).toString();

							let body = {	

								idToken: user.h.b.h
							}

							localUsersService.patchData(id, body)
							.subscribe(resp=>{

								/*=============================================
								Almacenamos el Token de seguridad en el localstorage
								=============================================*/

								localStorage.setItem("idToken", user.h.b.h);

								/*=============================================
								Almacenamos el email en el localstorage
								=============================================*/

								localStorage.setItem("email", user.email);

								/*=============================================
								Almacenamos la fecha de expiración localstorage
								=============================================*/

								let today = new Date();

								today.setSeconds(3600);

								localStorage.setItem("expiresIn", today.getTime().toString());

								/*=============================================
								Redireccionar al usuario a la página de su cuenta
								=============================================*/

								window.open("account", "_top");

							})

						}else{

							Sweetalert.fnc("error", `Ya ha iniciado sesión, inicie sesión con ${resp[Object.keys(resp)[0]].method} método`, "login")
						}

					}else{

						Sweetalert.fnc("error", "Esta cuenta no esta registrada", "register")

					}
				})
			}
		}
	}

  /*=============================================
	acceder con una ventana emergente y con certificado SSL (https)
  =============================================*/
  //ng serve --ssl true --ssl-cert "/path/to/file.crt" --ssl-key "/path/to/file.key"
  

}