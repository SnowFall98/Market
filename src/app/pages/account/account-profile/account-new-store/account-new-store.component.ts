import { Component, Input, OnInit } from '@angular/core';
import { Path } from '../../../../config';
import { StoresService } from '../../../../services/stores.service';

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

}
