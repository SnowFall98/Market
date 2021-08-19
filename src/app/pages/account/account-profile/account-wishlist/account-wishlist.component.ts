import { Component, OnInit, Input } from '@angular/core';
import { Path } from '../../../../config';
import { DinamicPrice, Sweetalert } from '../../../../functions';
import { UsersService } from '../../../../services/users.service';
import { ProductsService } from '../../../../services/products.service';

declare var jQuery:any;
declare var $:any;


@Component({
  selector: 'app-account-wishlist',
  templateUrl: './account-wishlist.component.html',
  styleUrls: ['./account-wishlist.component.css']
})
export class AccountWishlistComponent implements OnInit {

  @Input() childItem:any;

	path:string = Path.url;
	wishlist:any[] = [];
  products:any[] = [];
	price:any[] = [];

  constructor(private usersService: UsersService, private productsService: ProductsService) { }

  ngOnInit(): void {

    /*=============================================
  	Seleccionamos el id del usuario
  	=============================================*/

    this.usersService.getUniqueData(this.childItem)
    .subscribe(resp =>{

      if(resp["whislist"] != undefined){

        /*=============================================
    		Tomamos de la data la lista de deseos
  			=============================================*/

        this.wishlist = JSON.parse(resp["wihslist"]);

        /*=============================================
    		Realizamos un foreach en la lista de deseos
    		=============================================*/


      }

    })

  }

}
