import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { Rating, DinamicRating, DinamicReviews, DinamicPrice, CountDown, ProgressBar, Tabs, SlickConfig, ProductLightbox, Quantity } from '../../../functions';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-product-left',
  templateUrl: './product-left.component.html',
  styleUrls: ['./product-left.component.css']
})
export class ProductLeftComponent implements OnInit {

    path:string = Path.url;	
    product:any[]= [];
    rating:any[] = [];
    reviews:any[] = [];
    price:any[] = [];
    preload:boolean = false;
    render:boolean = true;
    countd:any[] = [];
    gallery:any[] = [];
    renderGallery:boolean = true;
    video:string = null;
    tags:string = null;
    totalReviews:string;
    offer:boolean = false;
    
  constructor(private activateRoute: ActivatedRoute, private productsService: ProductsService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.preload = true;
    this.productsService.getFilterData("url", this.activateRoute.snapshot.params["param"])  
    .subscribe( resp => {
      
      this.productsFnc(resp);		

    })

  }

  /*=============================================
  Declaramos función para mostrar los productos recomendados
  =============================================*/	

  productsFnc(response){

    this.product = [];

    /*=============================================
    Hacemos un recorrido por la respuesta que nos traiga el filtrado
    =============================================*/	

      let i;
      let getProduct = [];

      for(i in response){

      getProduct.push(response[i]);						
        
    }

    /*=============================================
    Filtramos el producto
    =============================================*/

    getProduct.forEach((product, index)=>{

      this.product.push(product);
      
      this.rating.push(DinamicRating.fnc(this.product[index]));
      
      this.reviews.push(DinamicReviews.fnc(this.rating[index]));

      this.price.push(DinamicPrice.fnc(this.product[index]));

      /*=============================================
      Agregamos la fecha al descontador
      =============================================*/ 
      
      if(this.product[index].offer != ""){

        let today = new Date();

        let offerDate = new Date(

          parseInt(JSON.parse(this.product[index].offer)[2].split("-")[0]),
          parseInt(JSON.parse(this.product[index].offer)[2].split("-")[1])-1,
          parseInt(JSON.parse(this.product[index].offer)[2].split("-")[2])

        )

        /*=============================================
        Funcion para las fechas de ofertas
        =============================================*/ 

        if (today < offerDate) {

          this.offer = true;
        
          const date = JSON.parse(this.product[index].offer)[2]; 
        
          this.countd.push(
  
            new Date(
              parseInt(date.split("-")[0]),
              parseInt(date.split("-")[1])-1,
              parseInt(date.split("-")[2])
  
            )
          )  
        }
      }

      /*=============================================
      Gallery
      =============================================*/

      this.gallery.push(JSON.parse(this.product[index].gallery)) 

      /*=============================================
      Video
      =============================================*/

      if(JSON.parse(this.product[index].video)[0] == "youtube"){

        this.video = `https://www.youtube.com/embed/${JSON.parse(this.product[index].video)[1]}?rel=0&autoplay=0 `

      }

      if(JSON.parse(this.product[index].video)[0] == "vimeo"){

        this.video = `https://player.vimeo.com/video/${JSON.parse(this.product[index].video)[1]}`
        
      }

    /*=============================================
      Agregamos los tags
      =============================================*/ 

      this.tags = this.product[index].tags.split(",");

      /*=============================================
        Total Reviews
        =============================================*/
        this.totalReviews = JSON.parse(this.product[index].reviews).length;


      this.preload = false;

    })

  }

  callback(){

    if(this.render){

      this.render = false;

      Rating.fnc();
      CountDown.fnc();
      ProgressBar.fnc();
      Tabs.fnc();
      Quantity.fnc();
    }
  }

  callbackGallery(){

    if(this.renderGallery){

      this.renderGallery = false;

      SlickConfig.fnc()
      ProductLightbox.fnc()

    }

  }

  /*=============================================
	Función para agregar productos a la lista de deseos	
	=============================================*/

	addWishlist(product){

		this.usersService.addWishlist(product);
		
	}

}
