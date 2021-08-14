import { Component, OnInit } from '@angular/core';
import { Path } from '../../config';
import { Search } from '../../functions';
import { CategoriesService } from '../../services/categories.service';
import { SubCategoriesService } from '../../services/sub-categories.service';
import { UsersService } from '../../services/users.service';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.css']
})

export class HeaderMobileComponent implements OnInit {

	path:string = Path.url;	
	categories:object = null;
	render:boolean = true;
	categoriesList:any[] = [];
	authValidate:boolean = false;
	picture:string;

	constructor(private categoriesService: CategoriesService, 
		private subCategoriesService: SubCategoriesService,
		private usersService: UsersService) { }

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
			Recorrido por el objeto de la data de categorías
			=============================================*/

			let i;

			for(i in resp){

				/*=============================================
				Separamos los nombres de categorías
				=============================================*/

				this.categoriesList.push(resp[i].name)

			}

		})

		/*=============================================
		Activamos el efecto toggle en el listado de subcategorías
		=============================================*/

		$(document).on("click", ".sub-toggle", function(){

			$(this).parent().children('ul').toggle();

		})

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
			Separar las categorías
			=============================================*/

			this.categoriesList.forEach(category=>{
				
				/*=============================================
				Tomamos la colección de las sub-categorías filtrando con los nombres de categoría
				=============================================*/

				this.subCategoriesService.getFilterData("category", category)
				.subscribe(resp=>{
					
					/*=============================================
					Hacemos un recorrido por la colección general de subcategorias y clasificamos las subcategorias y url
					de acuerdo a la categoría que correspondan
					=============================================*/

					let i;

					for(i in resp){

						arraySubCategories.push({

							"category": resp[i].category,
							"subcategory": resp[i].name,
							"url": resp[i].url

						})

					}

					/*=============================================
					Recorremos el array de objetos nuevo para buscar coincidencias con los nombres de categorías
					=============================================*/

					for(i in arraySubCategories){

						if(category == arraySubCategories[i].category){
							

							$(`[category='${category}']`).append(

								`<li class="current-menu-item ">
		                        	<a href="products/${arraySubCategories[i].url}">${arraySubCategories[i].subcategory}</a>
		                        </li>`

		                    )

						}

					}

				})

			})			
			
		}

	}

}
