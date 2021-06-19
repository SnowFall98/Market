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
  bestSalesItem:Array<any> = [];
  render:Boolean = true;

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
  }

  /*=============================================
  Declaramos la función para mostrar las mejores ventas
  =============================================*/

  productsFnc(response){

    /*=============================================
    Hacemos un recorrido por la respuesta que nos traiga el filtrado
    =============================================*/

    this.bestSalesItem = [];
    let i;
    let getSales =[];

    for (i in response){

      getSales.push(response[i]);
      console.log("getSales",getSales);

    }

    /*=============================================
    Ordenamos de mayor a menor ventas el array de obje
    =============================================*/

    getSales.sort(function(a , b){
      return (b.sales - a.sales);
    })

    /*=============================================
    Filtrado de cantidad de productos a mostrar
    =============================================*/

    getSales.forEach((product, index)=>{
      if (index > 10){

        this.bestSalesItem.push(product);

      }
    })
  }

  callback(){
    if(this.render){
      this.render = false;
      
      OwlCarouselConfig.fnc();
      CarouselNavigation.fnc();
    }
  }

}
