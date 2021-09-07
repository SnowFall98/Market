import { Component, Input, OnInit } from '@angular/core';
import { Path } from '../../../../config';
import { StoresService } from '../../../../services/stores.service';
import  { NgForm } from '@angular/forms';

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

  constructor(private storesService:StoresService) { }

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
    






  
  }




}
