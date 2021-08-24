import { Component, OnInit } from '@angular/core';
import { Path } from '../../config';
import { Search, DinamicPrice } from '../../functions';
import { CategoriesService } from '../../services/categories.service';
import { SubCategoriesService } from '../../services/sub-categories.service';
import { UsersService } from '../../services/users.service';
import { ProductsService } from '../../services/products.service';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	path:string = Path.url;	
	categories:object = null;
	arrayTitleList:any[] = [];
	render:boolean = true;
	authValidate:boolean = false;
	picture:string;
	wishlist:number = 0;
	totalShoppingCart:number = 0;
	shoppingCart:any[] = [];
	renderShopping:boolean = true;
	subTotal:string= `<h3>Sub Total:<strong class="subTotalHeader"><div class="spinner-border"></div></strong></h3>`; 

	constructor(private categoriesService: CategoriesService, 
		private subCategoriesService: SubCategoriesService, 
		private usersService: UsersService,
		private productsService: ProductsService,) { }

	ngOnInit(): void {

		/*=============================================
		Validar si existe usuario autenticado
		=============================================*/
		this.usersService.authActivate().then(resp =>{

			if(resp){

				this.authValidate = true;

				this.usersService.getFilterData("idToken", localStorage.getItem("idToken"))
				.subscribe(resp=>{

					for(const i in resp){

						/*=============================================
						Mostramos cantidad de productos en su lista de deseos
						=============================================*/

						if(resp[i].wishlist != undefined){

							this.wishlist = Number(JSON.parse(resp[i].wishlist).length)

						}
						
						/*=============================================
						Mostramos foto del usuario
						=============================================*/

						if(resp[i].picture != undefined){

							if(resp[i].method != "direct"){

								this.picture = `<img src="${resp[i].picture}" class="img-fluid rounded-circle ml-auto">`;
							
							}else{

								this.picture = `<img src="assets/img/users/${resp[i].username.toLowerCase()}/${resp[i].picture}" class="img-fluid rounded-circle ml-auto">`;
							}

						}else{

							this.picture = `<i class="icon-user"></i>`;
						}

					}

				})
			}

		})

		/*=============================================
		Tomamos la data de las categorías
		=============================================*/

		this.categoriesService.getData()
		.subscribe(resp => {
			
			this.categories = resp;

			/*=============================================
			Recorremos la colección de categorías para tomar la lista de títulos
			=============================================*/

			let i;

			for(i in resp){

				/*=============================================
				Separamos la lista de títulos en índices de un array
				=============================================*/
				
				this.arrayTitleList.push(JSON.parse(resp[i].title_list));
				
			}

		})

		/*=============================================
		Tomamos la data del Carrito de Compras del LocalStorage
		=============================================*/

		if(localStorage.getItem("list")){

			let list = JSON.parse(localStorage.getItem("list"));

			this.totalShoppingCart = list.length;

			/*=============================================
			Recorremos el arreglo del listado
			=============================================*/
			
			for(const i in list){

				/*=============================================
				Filtramos los productos del carrito de compras
				=============================================*/

				this.productsService.getFilterData("url", list[i].product)
				.subscribe(resp=>{
					
					for (const f in resp){
						
						this.shoppingCart.push({

						url:resp[f].url,
						name:resp[f].name,
						category:resp[f].category,
						image:resp[f].image,
						delivery_time:resp[f].delivery_time,
						quantity:list[i].unit,
						price: DinamicPrice.fnc(resp[f])[0],
						shipping:Number(resp[f].shipping)*Number(list[i].unit)

					})

					}

				})
			
			}

		}


	
	}

	/*=============================================
	Declaramos función del buscador
	=============================================*/

	goSearch(search:string){

		if(search.length == 0 || Search.fnc(search) == undefined){

			return;
		}

		window.open(`search/${Search.fnc(search)}`, '_top')

	}

	/*=============================================
	Función que nos avisa cuando finaliza el renderizado de Angular
	=============================================*/
	
	callback(){

		if(this.render){

			this.render = false;
			let arraySubCategories = [];
			
			/*=============================================
			Hacemos un recorrido por la lista de títulos
			=============================================*/

			this.arrayTitleList.forEach(titleList =>{

				/*=============================================
				Separar individualmente los títulos
				=============================================*/

				for(let i = 0; i < titleList.length; i++){

					/*=============================================
					Tomamos la colección de las sub-categorías filtrando con la lista de títulos
					=============================================*/
					
					this.subCategoriesService.getFilterData("title_list", titleList[i])
					.subscribe(resp =>{
						
						arraySubCategories.push(resp);

						/*=============================================
						Hacemos un recorrido por la colección general de subcategorias
						=============================================*/

						let f;
						let g;
						let arrayTitleName = [];

						for(f in arraySubCategories){
							
							/*=============================================
							Hacemos un recorrido por la colección particular de subcategorias
							=============================================*/

							for(g in arraySubCategories[f]){

								/*=============================================
								Creamos un nuevo array de objetos clasificando cada subcategoría con la respectiva lista de título a la que pertenece
								=============================================*/

								arrayTitleName.push({

									"titleList": arraySubCategories[f][g].title_list,
									"subcategory": arraySubCategories[f][g].name,
									"url": arraySubCategories[f][g].url,

								})

							}

						}

						/*=============================================
						Recorremos el array de objetos nuevo para buscar coincidencias con las listas de título
						=============================================*/

						for(f in arrayTitleName){

							if(titleList[i] == arrayTitleName[f].titleList){
								
								/*=============================================
								Imprimir el nombre de subcategoría debajo de el listado correspondiente
								=============================================*/

								$(`[titleList='${titleList[i]}']`).append(

									`<li>
										<a href="products/${arrayTitleName[f].url}">${arrayTitleName[f].subcategory}</a>
									</li>`

								)
						
							}

						}					

					})

				}			

			})
		}

	}

	callbackShopping(){

		if(this.renderShopping){

			this.renderShopping = false;

			/*=============================================
			Sumar valores para el precio total
			=============================================*/

			let totalProduct = $(".ps-product--cart-mobile");

			setTimeout(function(){

				let price = $(".pShoppingHeader .end-price")
				let quantity = $(".qShoppingHeader");
				let shipping = $(".sShoppingHeader");

				let totalPrice = 0;

				for(let i = 0; i < price.length; i++){
									
					/*=============================================
					Sumar precio con envío
					=============================================*/

					let shipping_price = Number($(price[i]).html()) + Number($(shipping[i]).html());
					
					totalPrice +=  Number($(quantity[i]).html() * shipping_price)
		
				}

				$(".subTotalHeader").html(`$${totalPrice.toFixed(2)}`)

			},totalProduct.length * 500)

		}
	}



}
