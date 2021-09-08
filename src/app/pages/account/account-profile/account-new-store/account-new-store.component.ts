import { Component, Input, OnInit } from '@angular/core';
import { Path } from '../../../../config';
import { StoresService } from '../../../../services/stores.service';
import  { NgForm } from '@angular/forms';
import { StoresModel } from '../../../../models/stores.model';
import { UsersService } from '../../../../services/users.service';
import { Sweetalert, Capitalize, CreateUrl}  from '../../../../functions';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-account-new-store',
  templateUrl: './account-new-store.component.html',
  styleUrls: ['./account-new-store.component.css']
})
export class AccountNewStoreComponent implements OnInit {
  
  @Input() childItem:any;
  
  path:string = Path.url;
  accept:boolean=false; // Variable para aceptar términos y condiciones
  storeOk:boolean=false;//Variable para saber que la creación de la tienda está lista
  store: StoresModel;//  Variable para el modelo de tiendas y productos
  dialCode:string = null;// Variable para el numero indicativo del pais
  countries:any = null;//variable para capturar el listado de paises

  constructor(private storesService:StoresService, private usersService: UsersService,) {
    
    this.store = new StoresModel();

  }

  ngOnInit(): void {

    /*=============================================
    Validamos si el usuario ya tiene una tienda habilitada
    =============================================*/

    this.storesService.getFilterData("username", this.childItem)
    .subscribe(resp=>{

      if(Object.keys(resp).length > 0){

        window.open("account/my-store", "_top");

      }
    })
    /*=============================================
    Traer la información del usuario existente
    =============================================*/

    this.usersService.getFilterData("username", this.childItem)
    .subscribe(resp=>{

      for(const i in resp){

        this.store.email = resp[i].email;
        this.store.country = resp[i].country;
        this.store.city = resp[i].city;
        this.store.address = resp[i].address;

        /*=============================================
        Dar formato al número teléfonico
        =============================================*/

        if(resp[i].phone != undefined){

          this.store.phone = resp[i].phone.split("-")[1];
          this.dialCode = resp[i].phone.split("-")[0];
        }

        /*=============================================
        Traer listado de países
        =============================================*/

        this.usersService.getCountries()
        .subscribe(resp=>{

          this.countries = resp;

        })

      }
    })
  }

  /*=============================================
  Mover el Scroll hasta donde inicia términos y condiciones
  =============================================*/

  goTerms(){

    $("html, body").animate({

      scrollTop: $("#tabContent").offset().top-50

    }) 

  }
  /*=============================================
  Función que avisa si Acepta términos y condiciones
  =============================================*/

  changeAccept(){

    if(this.accept){

      $("#createStore").tab("show")

      /*=============================================
      Mover el scroll hasta la creación de la tienda
      =============================================*/

      $("html, body").animate({
        
        scrollTop: $("#createStore").offset().top-100

      }) 

    }else{
      $("#createStore").removeClass("active")
    }
  }

  /*=============================================
  Activar módulo para crear producto
  =============================================*/

  createProduct(){

    /*=============================================
    Validar que la tienda esté correctamente creada
    =============================================*/

    let formStore = $(".formStore");

    let error = 0;

    for(let i = 0; i < formStore.length; i++){

      if($(formStore[i]).val() == "" || $(formStore[i]).val() == undefined){

        error++

        $(formStore[i]).parent().addClass("was-validated")

      }
    }

    if(error > 0){

      return;
    }
    this.storeOk = true;

    /*=============================================
    Cuando se activa el módulo para crear el producto
    =============================================*/

    if(this.storeOk){

      $("#createProduct").tab("show")

      /*=============================================
      Mover el scroll hasta la creación de la tienda
      =============================================*/

      $("html, body").animate({

        scrollTop: $("#createProduct").offset().top-100

      }) 

    }




  }

  /*=============================================
  Validación extra para cada campo del formulario
  =============================================*/

  validate(input){

    /*=============================================
    Validamos el nombre de la tienda
    =============================================*/

    if($(input).attr("name") == "storeName" || $(input).attr("name") == "productName"){

      /*=============================================
      Validamos expresión regular del nombre de la tienda
      =============================================*/ 

      let pattern = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]{1,}$/;

      if(!pattern.test(input.value)){

        $(input).parent().addClass('was-validated');

        input.value = "";

        return;

      }else{

        if($(input).attr("name") == "storeName"){ 

          /*=============================================
          Validamos que el nombre de la tienda no esté repetido
          =============================================*/

          this.storesService.getFilterData("store", input.value)
          .subscribe(resp=>{

            if(Object.keys(resp).length > 0){

              $(input).parent().addClass('was-validated')
              input.value = "";
              this.store.url = "";

              Sweetalert.fnc("error", "El nombre de la tienda ya existe", null)

              return;

            }else{

              /*=============================================
              Capitulamos el nombre de la tienda
              =============================================*/

              input.value = Capitalize.fnc(input.value);

              /*=============================================
              Creamos la URL de la tienda
              =============================================*/

              this.store.url = CreateUrl.fnc(input.value);
            }

          })

        }

      }

    }

    /*=============================================
    Validamos la información de la tienda
    =============================================*/

    if($(input).attr("name") == "storeAbout"){

      /*=============================================
      Validamos expresión regular de la información de la tienda
      =============================================*/ 

      let pattern = /^[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\"\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,1000}$/;

      if(!pattern.test(input.value)){

        $(input).parent().addClass('was-validated');

        input.value = "";

        return;

      }else{

        this.store.abstract = input.value.substr(0,100)+"...";
      }

    }

    /*=============================================
    Validamos la ciudad de la tienda
    =============================================*/

    if($(input).attr("name") == "storeCity"){

      /*=============================================
      Validamos expresión regular de la ciudad de la tienda
      =============================================*/ 

      let pattern = /^[A-Za-zñÑáéíóúÁÉÍÓÚ ]{1,}$/;

      if(!pattern.test(input.value)){

        $(input).parent().addClass('was-validated');

        input.value = "";

        return;

      }

    }

    /*=============================================
    Validamos el teléfono de la tienda
    =============================================*/

    if($(input).attr("name") == "storePhone"){

      /*=============================================
      Validamos expresión regular del teléfono de la tienda
      =============================================*/ 

      let pattern = /^[-\\0-9 ]{1,}$/;

      if(!pattern.test(input.value)){

        $(input).parent().addClass('was-validated');

        input.value = "";

        return;

      }

    }

    /*=============================================
    Validamos la dirección de la tienda
    =============================================*/

    if($(input).attr("name") == "storeAddress"){

      /*=============================================
      Validamos expresión regular de la dirección de la tienda
      =============================================*/ 

      let pattern = /^[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\"\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,1000}$/;

      if(!pattern.test(input.value)){

        $(input).parent().addClass('was-validated');

        input.value = "";

        return;

      }

    }

  }

  /*=============================================
  Agregar código dial al input telefónico
  =============================================*/

  changeCountry(input){

    this.countries.forEach(country=>{

      if(input.value == country.name){

        this.dialCode = country.dial_code;
      }

    })

  }






  /*=============================================
  Envío del formulario
  =============================================*/

  onSubmit(f: NgForm){

    /*=============================================
    Validar que el producto esté correctamente creado
    =============================================*/

    let formProduct = $(".formProduct");

    let error = 0;

    for(let i = 0; i < formProduct.length; i++){

      if($(formProduct[i]).val() == "" || $(formProduct[i]).val() == undefined){

        error++

        $(formProduct[i]).parent().addClass("was-validated")

      }
    }
    /*=============================================
    Validación completa del formulario
    =============================================*/

    if(f.invalid){

      Sweetalert.fnc("error", "Invalid Request", null);

      return;
    }
    






  
  }




}
