import { Component, OnInit } from '@angular/core';
import { Path } from '../../config';
import { Sweetalert } from '../../functions';
import { Router } from '@angular/router';
import { UsersModel } from '../../models/users.model';
import { UsersService } from '../../services/users.service';
import { NgForm } from '@angular/forms';

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

  constructor(private router:Router, private usersService:UsersService, ) { 

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
			
					}

				})

			}

		})

    /*=============================================
		Traer la lista del carrito de compras
		=============================================*/

		if(localStorage.getItem("list")){

			let list = JSON.parse(localStorage.getItem("list"));

			if(list.length == 0){

				this.router.navigateByUrl("/shopping-cart");

				return;

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
          phone: this.user.phone,
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


  onSubmit(f: NgForm){

  }
  

}
