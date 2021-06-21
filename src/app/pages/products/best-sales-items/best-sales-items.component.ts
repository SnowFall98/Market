import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';
import { OwlCarouselConfig, CarouselNavigation, Rating } from '../../../functions';
import { ProductsService } from '../../../services/products.service';
import { ActivatedRoute } from '@angular/router';

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
  rating:Array<any> = [];
  reviews:Array<any> = [];
	price:Array<any> = [];
	cargando:Boolean = false;

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

          this.productsFnc(resp1);
  
      }else {
        /*=============================================
        Filtramos Data de subcategorías
        =============================================*/
        this.productsService.getFilterData("sub_category", params)
        .subscribe(resp2=>{
    
            this.productsFnc(resp2);

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
      if (index < 10){

        this.bestSalesItem.push(product);
        this.rating.push(this.dinamicRating(this.bestSalesItem[index]));
        this.reviews.push(this.dinamicReviews(this.rating[index]));
        this.price.push(this.dinamicPrice(this.bestSalesItem[index]));

				this.cargando = false;

      }
    })
  }

  /*=============================================
	Función para el Rating dinamico
	=============================================*/

  dinamicRating(response){

    let totalReview = 0;
    let rating = 0;
    for (let i = 0; i < JSON.parse(response.reviews).length; i++){

      totalReview += Number(JSON.parse(response.reviews)[i]["review"]);
    }

    rating = Math.round(totalReview/JSON.parse(response.reviews).length);

    return rating;

  }

  /*=============================================
	Función para el Review dinamico
	=============================================*/

  dinamicReviews(response){

    /*=============================================
    Clasificamos la cantidad de estrellas según la calificación
    =============================================*/    

    let reviews = [];

    for(let r = 0; r < 5; r++){

        if(response < (r+1)){

            reviews[r] = 2
        
        }else{

            reviews[r] = 1
        }    
    }

    return reviews;
  }

  /*=============================================
	Función para los precios dinámicos
	=============================================*/

  dinamicPrice (response){
    let type;
    let value;
    let offer;
    let price;
    let disccount;
    let arrayPrice = [];
    let offerDate;
    let today = new Date();


    if(response.offer != ""){

        offerDate = new Date(

            parseInt(JSON.parse(response.offer)[2].split("-")[0]),
            parseInt(JSON.parse(response.offer)[2].split("-")[1])-1,
            parseInt(JSON.parse(response.offer)[2].split("-")[2])

        )

        if(today < offerDate){

            type = JSON.parse(response.offer)[0];
            value = JSON.parse(response.offer)[1];

            if(type == "Disccount"){

                offer = (response.price-(response.price * value/100)).toFixed(2)    
            }    

            if(type == "Fixed"){

                offer = value;
                value = Math.round(offer*100/response.price);

            }

            disccount = `<div class="ps-product__badge">-${value}%</div>`;

            price = `<p class="ps-product__price sale">$<span class="end-price">${offer}</span> <del>$${response.price} </del></p>`;

        }else{

            price = `<p class="ps-product__price">$<span class="end-price">${response.price}</span></p>`; 
        }

    }else{

        price = `<p class="ps-product__price">$<span class="end-price">${response.price}</span></p>`;
    }

    /*=============================================
    Definimos si el producto tiene stock
    =============================================*/    

    if(response.stock == 0){

        disccount = `<div class="ps-product__badge out-stock">Out Of Stock</div>`;

    }

    arrayPrice[0] = price;
    arrayPrice[1] = disccount;

    return arrayPrice;
  }
  

  /*=============================================
	Función que nos avisa cuando finaliza el renderizado de Angular
	=============================================*/

  callback(){
    if(this.render){
      this.render = false;
      
      OwlCarouselConfig.fnc();
      CarouselNavigation.fnc();
      Rating.fnc();
    }
  }

}
