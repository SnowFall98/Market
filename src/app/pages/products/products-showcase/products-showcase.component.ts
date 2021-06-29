import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';
import { Rating, DinamicRating, DinamicReviews, DinamicPrice, Pagination, Select2Cofig, Tabs } from '../../../functions';
import { ProductsService} from '../../../services/products.service';
import { ActivatedRoute } from '@angular/router';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-products-showcase',
  templateUrl: './products-showcase.component.html',
  styleUrls: ['./products-showcase.component.css']
})
export class ProductsShowcaseComponent implements OnInit {

	path:String = Path.url;
	products:Array<any> = [];
	render:Boolean = true;
	cargando:Boolean = false;
	rating:Array<any> = [];
	reviews:Array<any> = [];
	price:Array<any> = [];
	params:String = null;
	page;
	productFound:Number = 0;
	currentRoute:String = null;
	totalPage:Number = 0;
	sort;
	sortItems:Array<any> = [];
	sortValues:Array<any> = [];

  constructor(private productsService: ProductsService, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    
    this.cargando = true;

 		/*=============================================
		Capturamos el parámetro URL
		=============================================*/	

		this.params = this.activateRoute.snapshot.params["param"].split("&")[0];
		this.sort = this.activateRoute.snapshot.params["param"].split("&")[1];
		this.page = this.activateRoute.snapshot.params["param"].split("&")[2];

		/*=============================================
		Evaluamos que el segundo parámetro sea de paginación
		=============================================*/	
		if(Number.isInteger(Number(this.sort))){

			this.page = this.sort;
			this.sort = undefined;
		
		}

		/*=============================================
		Evaluamos que el parámetro de orden no esté definido
		=============================================*/	

		if(this.sort == undefined){

			this.currentRoute = `products/${this.params}`;
		
		}else{

			this.currentRoute = `products/${this.params}&${this.sort}`;

		}
		
		/*=============================================
		Filtramos data de productos con categorías
		=============================================*/	

		this.productsService.getFilterData("category", this.params)
		.subscribe(resp1=>{

			if(Object.keys(resp1).length > 0){
				
				this.productsFnc(resp1);
				
			}else{

				/*=============================================
				Filtramos data de subategorías
				=============================================*/	

				this.productsService.getFilterData("sub_category", this.params)
				.subscribe(resp2=>{
		
					this.productsFnc(resp2);			
									
				})

			}
			
		})
  }

  productsFnc(response){

    	this.products = [];

  		/*=============================================
		Hacemos un recorrido por la respuesta que nos traiga el filtrado
		=============================================*/	

  		let i;
  		let getProducts = [];
  		let total = 0;

  		for(i in response){

  			total++;

			getProducts.push(response[i]);						
				
		}

		/*=============================================
		Definimos el total de productos y la paginación de productos
		=============================================*/	

		this.productFound = total;
		this.totalPage =  Math.ceil(Number(this.productFound)/6);

    	/*=============================================
		Filtramos solo hasta 10 productos
		=============================================*/

		getProducts.forEach((product, index)=>{

			/*=============================================
			Evaluamos si viene número de página definida
			=============================================*/

			if(this.page == undefined){

				this.page = 1;
			}	

			/*=============================================
			Configuramos la paginación desde - hasta
			=============================================*/						

			let first = Number(index) + (this.page*6)-6; 
			let last = 6*this.page;

			/*=============================================
			Filtramos los productos a mostrar
			=============================================*/		

			if(first < last){

				if(getProducts[first] != undefined){

					this.products.push(getProducts[first]);

					this.rating.push(DinamicRating.fnc(getProducts[first]));
					
					this.reviews.push(DinamicReviews.fnc(this.rating[index]));

					this.price.push(DinamicPrice.fnc(getProducts[first]));

					this.cargando = false;

				}
			}

		})
    }

	/*=============================================
	Función que nos avisa cuando finaliza el renderizado de Angular
	=============================================*/

	callback(params){

		if(this.render){

			this.render = false;

			Rating.fnc();
			Pagination.fnc();
			//Select2Cofig.fnc();
			//Tabs.fnc();

		  /*=============================================
		  Captura del Select Sort Items
		  =============================================*/	

		  $(".sortItems").change(function(){

			  window.open(`products/${params}&${$(this).val()}`, '_top')

		  })
		}
	}

}
