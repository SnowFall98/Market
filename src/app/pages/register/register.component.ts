import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersModel } from '../../models/users.model';
import { UsersService } from '../../services/users.service';
import { Capitalize, Sweetalert } from '../../functions';
import "firebase/auth";
import firebase from "firebase/app";


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
  	Registro en Firebase Authentication
  	=============================================*/
		
		this.user.returnSecureToken = true;

		this.usersService.registerAuth(this.user)
		.subscribe(resp=>{
			
			if(resp["email"] == this.user.email){

       /*=============================================
        Enviar correo de verificación
        =============================================*/

        let body = {

          requestType: "VERIFY_EMAIL",
          idToken: resp["idToken"]
        
        }

        this.usersService.sendEmailVerificationFnc(body)
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

        })				

			}

		}, err =>{

      Sweetalert.fnc("error", err.error.error.message, null)

    })

  }

  /*=============================================
  Registro con Facebook
  =============================================*/

  facebookRegister(){

    let localUsersService = this.usersService;
    let localUser = this.user;

    /*=============================================
		Documentacion para entender el SDK de Facebook/Firebase 
		//https://firebase.google.com/docs/auth/web/facebook-login
		=============================================*/

    // Your web app's Firebase configuration
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
    Crea una instancia del objeto proveedor de Facebook
    =============================================*/
   
    var provider = new firebase.auth.FacebookAuthProvider();

    /*=============================================
    acceder con una ventana emergente y con certificado SSL (https)
    =============================================*/
    //ng serve --ssl true --ssl-cert "/path/to/file.crt" --ssl-key "/path/to/file.key"

    firebase.auth().signInWithPopup(provider).then(function(result) {
      
      registerFirebaseDatabase(result, localUser, localUsersService)
     
    }).catch(function(error) {
     
      var errorMessage = error.message;
      
      Sweetalert.fnc("error", errorMessage, "register");
   
    });

    /*=============================================
    Registramos al usuario en Firebase Database
    =============================================*/

    function registerFirebaseDatabase(result, localUser, localUsersService){

      var user = result.user; 
     
      if(user.P){
     
        localUser.displayName = user.displayName;
        localUser.email = user.email;
        localUser.idToken = user.h.b.h;
        localUser.method = "facebook";
        localUser.username = user.email.split('@')[0];
        localUser.picture = user.photoURL;
  
        /*=============================================
        Evitar que se dupliquen los registros en Firebase Database
        =============================================*/

        localUsersService.getFilterData("email", user.email)
        .subscribe(resp=>{

          if(Object.keys(resp).length > 0){

            Sweetalert.fnc("error", `Ya ha iniciado sesión, inicie sesión con ${resp[Object.keys(resp)[0]].method} método`, "login")

          }else{

            localUsersService.registerDatabase(localUser)
            .subscribe(resp=>{

              if(resp["name"] != ""){

                Sweetalert.fnc("success", "Por favor inicie sesión con facebook", "login");

              } 
            })
          }
        })
      }
    }
  }

  /*=============================================
  Registro con Google
  =============================================*/

  googleRegister(){

    let localUsersService = this.usersService;
    let localUser = this.user;

    /*=============================================
		Documentacion para entender el SDK de Google/Firebase 
    //https://firebase.google.com/docs/auth/web/google-signin
		=============================================*/
		// Orden de realizacion del SDK Firebase
		// Crea una nueva APP en Settings
		// npm install --save firebase
		// import firebase from "firebase/app"; -- Revisar documentacion ya que cambia la forma de importacion
		// import "firebase/auth"; -- Revisar documentacion ya que cambia la forma de importacion

    // Your web app's Firebase configuration
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
      
      registerFirebaseDatabase(result, localUser, localUsersService)
     
    }).catch(function(error) {
     
      var errorMessage = error.message;
      
      Sweetalert.fnc("error", errorMessage, "register");
   
    });

    /*=============================================
    Registramos al usuario en Firebase Database
    =============================================*/

    function registerFirebaseDatabase(result, localUser, localUsersService){

      var user = result.user; 
     
      if(user.P){
     
        localUser.displayName = user.displayName;
        localUser.email = user.email;
        localUser.idToken = user.h.b.h;
        localUser.method = "google";
        localUser.username = user.email.split('@')[0];
        localUser.picture = user.photoURL;
  
        /*=============================================
        Evitar que se dupliquen los registros en Firebase Database
        =============================================*/

        localUsersService.getFilterData("email", user.email)
        .subscribe(resp=>{

          if(Object.keys(resp).length > 0){

            Sweetalert.fnc("error", `Ya ha iniciado sesión, inicie sesión con ${resp[Object.keys(resp)[0]].method} método`, "login")

          }else{

            localUsersService.registerDatabase(localUser)
            .subscribe(resp=>{

              if(resp["name"] != ""){

                Sweetalert.fnc("success", "Inicie sesión con Google", "login");

              } 
            })
          }
        })
      }
    }
  }

}
