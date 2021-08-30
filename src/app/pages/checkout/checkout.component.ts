import { Component, OnInit } from '@angular/core';
import { Path } from '../../config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  
	path:string = Path.url;

  constructor(private router:Router ) { }

  ngOnInit(): void {

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

}
