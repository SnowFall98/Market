import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';
import { OwlCarouselConfig, CarouselNavigation } from '../../../functions';
import { ProductsService } from '../../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { param } from 'jquery';

declare var jQuery:any;
declare var $:any;


@Component({
  selector: 'app-best-sales-items',
  templateUrl: './best-sales-items.component.html',
  styleUrls: ['./best-sales-items.component.css']
})
export class BestSalesItemsComponent implements OnInit {

  path:String = Path.url;

  constructor(private productsService: ProductsService,private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    /*=============================================
      Caputarmos el parametro URL
		=============================================*/

    let params = this.activatedRoute.snapshot.params["params"];
    /*=============================================
      Filtrar la data de productos con la categoria
		=============================================*/

    this.productsService.getFilterData("category", params)
    .subscribe(resp1=>{

      if (Object.keys(resp1).length > 0 ){

        let i;
      
        for (i in resp1){
          this.productsFnc(resp1);
  
        }
      }else {
        /*=============================================
        Filtramos Data de subcategorías
        =============================================*/
        this.productsService.getFilterData("sub_category", params)
        .subscribe(resp2=>{
    
          let i;
            
          for (i in resp2){
            this.productsFnc(resp2);

          }
        })
      }

    })
    OwlCarouselConfig.fnc();
    CarouselNavigation.fnc();
  }
  /*=============================================
  Declaramos la función para mostrar las mejores ventas
  =============================================*/
  productsFnc(response){

  }

}
