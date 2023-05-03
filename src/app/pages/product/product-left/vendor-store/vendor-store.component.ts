import { Component, OnInit, Input } from '@angular/core';
import { Path } from '../../../../config';
import { DinamicRating, DinamicReviews, Rating, Tooltip } from '../../../../functions';
import { StoresService } from '../../../../services/stores.service';
import { ProductsService } from 'src/app/services/products.service';

declare var jQuery: any;
declare var $: any;

@Component({
	selector: 'app-vendor-store',
	templateUrl: './vendor-store.component.html',
	styleUrls: ['./vendor-store.component.css']
})
export class VendorStoreComponent implements OnInit {

	@Input() childItem: any;
	path: string = Path.url;
	store: any[] = [];
	products: any[] = []; // Variable para almacenar la data de los productos
	idProducts: any[] = []; // Variable para capturar el ID del producto
	loadProduct: number = 0; // Variable para identificar cuando  termina la carga de los productos
	render: boolean = false; // Variable render de DataTable
	renderReview: boolean = false; // Variables para el render de las Reseñas
	loadReview: number = 0; // Variables para el render de las Reseñas
	totalReviews: any[] = []; // Variable para capturar el total de calficiaciones que tiene la tienda
	preload: boolean = false;

	constructor(private storesService: StoresService, private productsService: ProductsService) { }

	ngOnInit(): void {

		this.preload = true;

		this.storesService.getFilterData("store", this.childItem)
			.subscribe(resp => {

				for (const i in resp) {

					this.store.push(resp[i])

				}

			})

		this.storesService.getFilterData("username", this.childItem)
		.subscribe(resp => {

			/*=============================================
			Traemos la data de productos de acuerdo al nombre de la tienda
			=============================================*/

			this.productsService.getFilterDataStore("store", this.store[0].store)
				.subscribe(resp => {

					/*=============================================
					Almacenamos la información del producto
					=============================================*/

					for (const i in resp) {

						this.loadProduct++;

						this.products.push(resp[i]);

						this.idProducts = Object.keys(resp).toString().split(",");

					}

					/*=============================================
					Damos formato a la data de productos
					=============================================*/

					this.products.map((product, index) => {

						/*=============================================
						Damos formato a las reseñas
						=============================================*/

						this.totalReviews.push(JSON.parse(product.reviews));

						let rating = DinamicRating.fnc(product);
						product.reviews = DinamicReviews.fnc(rating);

						return product;

					})

					// console.log(this.totalReviews, "mapeo");

					// console.log(this.totalReviews.length, "longitud");

				})

		})

		/*=============================================
		Finaliza el Preload
		=============================================*/

		this.preload = false;

	}

	parseSocial(socialString: string) {
		try {
			// Intenta analizar la cadena JSON en un objeto JSON
			return JSON.parse(socialString);
		} catch (error) {
			// Si hay un error al analizar la cadena JSON, muestra un mensaje de error en la consola
			console.error('Error parsing social string:', error);
			// Devuelve null para indicar que ha habido un error
			return null;
		}
	}

	/*=============================================
	Callback DataTable
	=============================================*/

	callback(i, totalReviews) {

		if (!this.render) {

			this.render = true;

			let globalRating = 0;
			let globalReviews = 0;

			setTimeout(function () {

				/*=============================================
				Agregamos el tooltip para mostrar comentario de revisión
				=============================================*/

				Tooltip.fnc();

				/*=============================================
				Aparecemos la tabla
				=============================================*/

				// $("table").animate({ "opacity": 1 });

				// $(".preloadTable").animate({ "opacity": 0 });

				/*=============================================
				Agregamos las calificaciones totales de la tienda
				=============================================*/

				totalReviews.forEach((review, index) => {

				globalRating += review.length;

				for (const i in review) {

					globalReviews += +review[i].review || 0;
					
				}
				})

				// console.log("Raiting", globalRating);
				// console.log("Reviews", globalReviews);

				/*=============================================
				Tomamos el promedio y porcentaje de calificaciones
				=============================================*/

				let averageReviews = Math.round(globalReviews / globalRating);
				let precentage = Math.round(globalReviews * 100 / (globalRating * 5));

				// console.log("Average", averageReviews);
				// console.log("precentage", precentage);
				/*=============================================
				Pintamos en el HTML el promedio y porcentaje de calificaciones
				=============================================*/

				$(".globalRating").html(globalRating);
				$(".percentage").html(precentage);

				/*=============================================
				Tomamos el Arreglo del promedio de calificaciones
				=============================================*/

				let averageRating = DinamicReviews.fnc(averageReviews);

				/*=============================================
				Pintamos en el HTML el Select para el plugin Rating
				=============================================*/

				$(".br-theme-fontawesome-stars").html(`

					<select class="ps-rating reviewsOption" data-read-only="true"></select>

				`)

				/*=============================================
				Recorremos el arreglo del promedio de calificaciones para pintar los options
				=============================================*/

				for (let i = 0; i < averageRating.length; i++) {

					$(".reviewsOption").append(`

						<option value="${averageRating[i]}">${i + 1}</option>

					`)

				}

				/*=============================================
				Ejecutamos la función Rating()
				=============================================*/

				Rating.fnc();

			}, i * 1)
		}
	}

}
