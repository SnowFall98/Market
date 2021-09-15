import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Path } from '../../../../config';
import { StoresService } from '../../../../services/stores.service';
import { ProductsService } from '../../../../services/products.service';
import { DinamicRating, DinamicReviews, Tooltip, Rating} from '../../../../functions';
import { Subject } from 'rxjs';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-account-my-store',
  templateUrl: './account-my-store.component.html',
  styleUrls: ['./account-my-store.component.css']
})
export class AccountMyStoreComponent implements OnInit, OnDestroy {

	@Input() childItem:any;

	path:string = Path.url;
	preload:boolean = false;

	store:any[]=[]; // Variable para almacenar la data de la tienda
	products:any[]=[]; // Variable para almacenar la data de los productos
	dtOptions: DataTables.Settings = {}; // 	Variables para trabajar con DataTable
	dtTrigger: Subject<any> = new Subject(); // 	Variables para trabajar con DataTable
	loadProduct:number = 0; // Variable para identificar cuando  termina la carga de los productos
	render:boolean = false; // Variable render de DataTable
	renderReview:boolean = false; // Variables para el render de las Reseñas
	loadReview:number = 0; // Variables para el render de las Reseñas

  constructor(private storesService:StoresService, private productsService: ProductsService ) { }

  ngOnInit(): void {

    this.preload = true;

    /*=============================================
    Validamos si el usuario ya tiene una tienda habilitada
    =============================================*/

    this.storesService.getFilterData("username", this.childItem)
    .subscribe(resp=>{

      if(Object.keys(resp).length == 0){
    
        window.open("account/new-store", "_top");

      }else{

        /*=============================================
        Almacenamos la información de la tienda
        =============================================*/

        for(const i in resp){

          this.store.push(resp[i]);
          
        }

        /*=============================================
        Damos formato a las redes sociales de la tienda
        =============================================*/

        this.store.map((item, index)=>{

          item.social = JSON.parse(item.social);

          return item;

        })

        /*=============================================
        Traemos la data de productos de acuerdo al nombre de la tienda
        =============================================*/

        this.productsService.getFilterDataMyStore("store", this.store[0].store)
        .subscribe(resp=>{

          /*=============================================
          Almacenamos la información del producto
          =============================================*/

          for (const i in resp){

            this.loadProduct++;

            this.products.push(resp[i]);

          }

          /*=============================================
          Damos formato a la data de productos
          =============================================*/

          this.products.map((product, index)=>{

            product.feedback = JSON.parse(product.feedback);
            product.details = JSON.parse(product.details);
            product.gallery = JSON.parse(product.gallery);
            product.horizontal_slider = JSON.parse(product.horizontal_slider);
            product.summary = JSON.parse(product.summary);
            product.tags = JSON.parse(product.tags);
            product.top_banner = JSON.parse(product.top_banner);

            /*=============================================
            Damos formato a las ofertas
            =============================================*/

            if( product.offer != ''){

              product.offer = JSON.parse(product.offer);

            } else {

              product.offer = [];
            }

            /*=============================================
            Damos formato a las especificaciones
            =============================================*/

            if(product.specification != '' && product.specification != '[{\"\":[]}]'){

              product.specification = JSON.parse(product.specification);

            } else {

              product.specification = [];

            }

            /*=============================================
            Damos formato al video
            =============================================*/

            product.video = JSON.parse(product.video);

            if (product.video.length > 0){

              if (product.video[0] == 'youtube'){

                product.video = `https://www.youtube.com/embed/${product.video[1]}?rel=0&autoplay=0`;

              }

              if (product.video[0] == 'vimeo'){

                product.video = `https://player.vimeo.com/video/${product.video[1]}`;

              }
            }

            /*=============================================
            Damos formato a las reseñas
            =============================================*/

            let rating = DinamicRating.fnc(product);
            product.reviews = DinamicReviews.fnc(rating);

            return product;

          })

          /*=============================================
					Pintar el render en DataTable
					=============================================*/	

          if(this.loadProduct == this.products.length){

            this.dtTrigger.next();	

          }

        })
        
        this.preload = true;

      }

    })

  }

  callback(i){

    if(!this.render){
      
      this.render = true;

      setTimeout(function(){

        /*=============================================
        Agregamos el tooltip para mostrar comentario de revisión
        =============================================*/ 

        Tooltip.fnc();

        /*=============================================
        Ejecutamos la función Rating()
        =============================================*/ 

        Rating.fnc(); 

      },i*10)
		}
	}

	/*=============================================
	Callback Review
	=============================================*/

	callbackReview(){

		this.loadReview++

		if(this.loadReview > this.loadProduct){

			if(!this.renderReview){

				this.renderReview = true;

				Rating.fnc();
				
			}
		}
	}

  /*=============================================
	Destruímos el trigger de angular
	=============================================*/

	ngOnDestroy():void{

		this.dtTrigger.unsubscribe();
	}

}
