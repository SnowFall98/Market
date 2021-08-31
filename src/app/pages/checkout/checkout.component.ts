import { Component, OnInit } from '@angular/core';
import { Path } from '../../config';
import { Sweetalert, DinamicPrice } from '../../functions';
import { Router } from '@angular/router';
import { UsersModel } from '../../models/users.model';
import { UsersService } from '../../services/users.service';
import { NgForm } from '@angular/forms';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  
	path: string = Path.url;
	user: UsersModel;
 	id: string = null;
	saveAddress:boolean = false;
	countries:any=null;
  	dialCode: string = null;
	shoppingCart: any[] = [];
	totalShoppingCart:number = 0;
	render: boolean = true;
	totalP:string = ` <h3 class="text-right">Total <span class="totalCheckout"><div class="spinner-border"></div></span></h3>`
	totalPrice:any[] = [];
	subTotalPrice:any[] = [];

	constructor(private router:Router, private usersService:UsersService, private productsService: ProductsService, ) { 

	this.user = new UsersModel();

	}


	ngOnInit(): void {

    	/*=============================================
		Validar si existe usuario autenticado
		=============================================*/

		this.usersService.authActivate().then(resp=>{

			if(resp){

				this.usersService.getFilterData("idToken", localStorage.getItem("idToken"))
				.subscribe(resp=>{

				this.id = Object.keys(resp).toString();

				for(const i in resp){

					this.user.displayName = resp[i].displayName;
					this.user.username = resp[i].username;
					this.user.email = resp[i].email;
					this.user.country = resp[i].country;
					this.user.city = resp[i].city;
					this.user.address = resp[i].address;

					if(resp[i].phone != undefined){

						this.user.phone = resp[i].phone.split("-")[1]
						this.dialCode = resp[i].phone.split("-")[0]

					}

					/*=============================================
					Traer listado de países
					=============================================*/

					this.usersService.getCountries()
					.subscribe(resp=>{
						
						this.countries = resp;

					})

				}

				})

			}

		})

    	/*=============================================
		Traer la lista del carrito de compras
		=============================================*/

		if(localStorage.getItem("list")){

			let list = JSON.parse(localStorage.getItem("list"));
      
      		this.totalShoppingCart = list.length;

			if(list.length == 0){

				this.router.navigateByUrl("/shopping-cart");

				return;

			}

      		/*=============================================
			Recorremos el arreglo del listado
			=============================================*/
			
			for(const i in list){

				/*=============================================
				Filtramos los productos del carrito de compras
				=============================================*/

				this.productsService.getFilterData("url", list[i].product)
				.subscribe(resp=>{

					for(const f in resp){

						let details = `<div class="list-details small text-secondary">`

						if(list[i].details.length > 0){

							let specification = JSON.parse(list[i].details);	

							for(const i in specification){

								let property = Object.keys(specification[i]);

								for(const f in property){

									details += `<div>${property[f]}: ${specification[i][property[f]]}</div>`
								}

							}

						}else{

							/*=============================================
							Mostrar los detalles por defecto del producto 
							=============================================*/

							if(resp[f].specification != ""){

								let specification = JSON.parse(resp[f].specification);

								for(const i in specification){

									let property = Object.keys(specification[i]).toString();

									details += `<div>${property}: ${specification[i][property][0]}</div>`

								}

							}

						}

						details += `</div>`;

						this.shoppingCart.push({

							url:resp[f].url,
							name:resp[f].name,
							category:resp[f].category,
							image:resp[f].image,
							delivery_time:resp[f].delivery_time,
							quantity:list[i].unit,
							price: DinamicPrice.fnc(resp[f])[0],
							shipping:Number(resp[f].shipping)*Number(list[i].unit),
							details:details,
							listDetails:list[i].details

						})

					}

				})

			}
    	}else{

			this.router.navigateByUrl("/shopping-cart");

			return;

		}
	
	}

  /*=============================================
	Guardar datos de envíos del usuario
	=============================================*/

	saveAddressFnc(inputCountry, inputCity, inputPhone, inputAddress, inputSaveAddress){	

		if(this.saveAddress){
			
			if(inputCountry.value != "" && inputCity.value != "" && inputPhone.value != "" && inputAddress.value != ""){

			let body = {
				
				country: this.user.country,
				country_code: this.user.country_code,
				city: this.user.city,
				phone: `${this.dialCode}-${this.user.phone}`,
				address: this.user.address

			}

				this.usersService.patchData(this.id, body)
				.subscribe(resp=>{

				Sweetalert.fnc("success", "Tus datos fueron actualizados", null)

				})
	
			}else{

				inputSaveAddress.checked = false;

				Sweetalert.fnc("error", "Por favor llene los campos requeridos", null)

			}
			
		}

	}

 	/*=============================================
	Agregar código dial al input telefónico
	=============================================*/

	changeCountry(inputCountry){

		this.countries.forEach(country=>{

			if(inputCountry.value == country.name){

				this.dialCode = country.dial_code;
				this.user.country_code = country.code;

			}

		})

	}

  /*=============================================
	Función Callback()
	=============================================*/

	callback(){

		if(this.render){

			this.render = false;

      		let totalShoppingCart = this.totalShoppingCart;
			let localSubTotalPrice = this.subTotalPrice;

			/*=============================================
			Mostrar lista del carrito de compras con los precios definitivos
			=============================================*/

			setTimeout(function(){

				let price = $(".pCheckout .end-price");
				let quantity = $(".qCheckout");
				let shipping = $(".sCheckout");
				let subTotalPrice = $(".subTotalPriceCheckout");

				let total = 0;

				for(let i = 0; i < price.length; i++){		

				/*=============================================
				Sumar precio con envío
				=============================================*/
				let shipping_price = Number($(price[i]).html()) + Number($(shipping[i]).html());			
				
				/*=============================================
				Multiplicar cantidad por precio con envío
				=============================================*/

				let subTotal = Number($(quantity[i]).html())*shipping_price;					

				/*=============================================
				Mostramos subtotales de cada producto
				=============================================*/

				$(subTotalPrice[i]).html(`$${subTotal.toFixed(2)}`)

				localSubTotalPrice.push(subTotal.toFixed(2))

				/*=============================================
				Definimos el total de los precios
				=============================================*/

				total += subTotal;

				}

				$(".totalCheckout").html(`$${total.toFixed(2)}`)

	    	},totalShoppingCart*500)
		}

	}


  onSubmit(f: NgForm){

  }
  

}
