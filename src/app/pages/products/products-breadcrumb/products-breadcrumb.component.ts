import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../../services/categories.service';
import { SubCategoriesService } from '../../../services/sub-categories.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products-breadcrumb',
  templateUrl: './products-breadcrumb.component.html',
  styleUrls: ['./products-breadcrumb.component.css']
})
export class ProductsBreadcrumbComponent implements OnInit {

  breadcrumb:String = null;

  constructor(
    private categoriesService: CategoriesService, 
    private subCategoriesService: SubCategoriesService, 
    private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    
    /*=============================================
		Otra forma de es "Refrescarel RouterLinkpara actualizar la página"
    Así no cambiamos el <a routerLink="products/{{category.url}}" target="_top">
		=============================================*/
    //this.activateRoute.params.subscribe(param=> { /*linea de instrucciones*/})

    let params= this.activateRoute.snapshot.params["param"].split("&")[0]; 

    /*=============================================
		Filtramos Data de categorías
		=============================================*/

    this.categoriesService.getFilterData("url", params)
    .subscribe(resp1=>{

      if (Object.keys(resp1).length > 0 ){

        let i;
      
        for (i in resp1){
  
         this.breadcrumb = resp1[i].name;

         let id = Object.keys(resp1).toString();
				
         let value = {
          "view": Number(resp1[i].view+1)
         }

         this.categoriesService.patchData(id, value)
         .subscribe(resp=>{})
	
  
        }
      }else {

        /*=============================================
        Filtramos Data de subcategorías
        =============================================*/
        this.subCategoriesService.getFilterData("url", params)
        .subscribe(resp2=>{
    
          let i;
            
          for (i in resp2){

          this.breadcrumb = resp2[i].name;

          let id = Object.keys(resp2).toString();
				
					let value = {
						"view": Number(resp2[i].view+1)
					}

					this.subCategoriesService.patchData(id, value)
					.subscribe(resp=>{})

          }
        })
      }

    })

  }

}
