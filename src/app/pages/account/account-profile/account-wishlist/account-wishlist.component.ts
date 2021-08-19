import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Path } from '../../../../config';
import { DinamicPrice, Sweetalert } from '../../../../functions';
import { UsersService } from '../../../../services/users.service';
import { ProductsService } from '../../../../services/products.service';
import { Subject } from 'rxjs';

declare var jQuery:any;
declare var $:any;


@Component({
  selector: 'app-account-wishlist',
  templateUrl: './account-wishlist.component.html',
  styleUrls: ['./account-wishlist.component.css']
})
export class AccountWishlistComponent implements OnInit, OnDestroy {

  @Input() childItem:any;

	path:string = Path.url;
	wishlist:any[] = [];
  	products:any[] = [];
	price:any[] = [];

	dtOptions: DataTables.Settings = {};
	dtTrigger: Subject<any> = new Subject();

  constructor(private usersService: UsersService, private productsService: ProductsService) { }

  ngOnInit(): void {

    /*=============================================
  	Agregamos opciones a DataTable
  	=============================================*/

  	this.dtOptions = {
  		pagingType: 'full_numbers',
  		processing: true
  	}

    /*=============================================
  	Seleccionamos el id del usuario
  	=============================================*/

	this.usersService.getUniqueData(this.childItem)
	.subscribe(resp=>{
		
		if(resp["wishlist"] != undefined){

		/*=============================================
		Tomamos de la data la lista de deseos
		=============================================*/

		this.wishlist = JSON.parse(resp["wishlist"]);

		let load = 0;
		
		/*=============================================
		Realizamos un foreach en la lista de deseos
		=============================================*/

			if(this.wishlist.length > 0){

				this.wishlist.forEach(list =>{	
					
					/*=============================================
					Filtramos la data de productos 
					=============================================*/

					this.productsService.getFilterData("url", list)
					.subscribe(resp=>{

						/*=============================================
						recorremos la data de productos
						=============================================*/

						for(const i in resp){

							load++;

						/*=============================================
						agregamos los productos 
						=============================================*/
							
						this.products.push(resp[i]);

						/*=============================================
						validamos los precios en oferta
						=============================================*/

						this.price.push(DinamicPrice.fnc(resp[i]))	

						/*=============================================
						preguntamos cuando termina de cargar toda la data en el DOM
						=============================================*/

							if(load == this.wishlist.length){

								this.dtTrigger.next();
							
							}  

						}  
					
					})

				})		

			}

		}

	})

  }

    /*=============================================
	Destruímos el trigger de angular
	=============================================*/

	ngOnDestroy():void{

		this.dtTrigger.unsubscribe();

	}

}
