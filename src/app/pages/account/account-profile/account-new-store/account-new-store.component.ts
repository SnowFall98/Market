import { Component, Input, OnInit } from '@angular/core';
import { Path } from '../../../../config';
import { StoresService } from '../../../../services/stores.service';
import  { NgForm } from '@angular/forms';
import { StoresModel } from '../../../../models/stores.model';
import { ProductsModel } from '../../../../models/products.model';
import { UsersService } from '../../../../services/users.service';
import { Sweetalert, Capitalize, CreateUrl}  from '../../../../functions';
import { ProductsService } from '../../../../services/products.service';
import { CategoriesService } from '../../../../services/Categories.service';
import { SubCategoriesService } from '../../../../services/sub-categories.service';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-account-new-store',
  templateUrl: './account-new-store.component.html',
  styleUrls: ['./account-new-store.component.css']
})
export class AccountNewStoreComponent implements OnInit {
  
  @Input() childItem:any;
  
  path:string = Path.url;
  accept:boolean=false; // Variable para aceptar términos y condiciones
  storeOk:boolean=false; //Variable para saber que la creación de la tienda está lista
  store: StoresModel; // Variable para el modelo de tiendas
  dialCode:string = null; // Variable para el numero indicativo del pais
  countries:any = null; //variable para capturar el listado de paises
  social:object = { facebook:"", instagram:"", twitter:"", linkedin:"", youtube:""} //Variable de tipo objeto para redes sociales
  product: ProductsModel; // Variable para el modelo de productos
  categories:any[] = []; // Variables de tipo arreglo para categorías
  subcategories:any[] = []; // Variables de tipo arreglo para subcategorías
  config = { placeholder:'', tabsize:2, height:'400px', toolbar:[ //Configuración inicial de Summernote 
      ['misc', ['codeview', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['link','picture', 'hr']]
    ]
  }
  summaryGroup: any[] = [{ input:''}] //Variables de tipo arreglo con objeto para el resumen del producto
  detailsGroup: any[] = [{ title:'', value:'' }] // Variables de tipo arreglo con objetos para los detalles del producto
  specificationsGroup: any[] = [{ type:'', values:''}] // Variables de tipo arreglo con objetos para las especificaciones del producto
  tags:any[] = []; // Variables de tipo arreglo para las palabras claves del producto
  gallery: File[] = []; // Variables de tipo arreglo para la galería del producto
  topBanner:object = { //Variables de tipo objeto para el banner superior del producto

    "H3 tag":"",
    "P1 tag":"",
    "H4 tag":"", 
    "P2 tag":"", 
    "Span tag":"",
    "Button tag":"",
    "IMG tag":""
  }
  hSlider:object = { // Variables de tipo objeto para el slide horizontal del producto

    "H4 tag":"",
    "H3-1 tag":"",
    "H3-2 tag":"", 
    "H3-3 tag":"", 
    "H3-4s tag":"",
    "Button tag":"",
    "IMG tag":""
  }
  video:any[] = []; // Variables de tipo arreglo para el video del producto

  constructor(private storesService:StoresService, private usersService: UsersService, private productsService: ProductsService,
              private categoriesService:CategoriesService, private subCategoriesService: SubCategoriesService) {
    
    this.store = new StoresModel();
    this.product = new ProductsModel();

  }

  ngOnInit(): void {

    /*=============================================
    Validamos si el usuario ya tiene una tienda habilitada
    =============================================*/

    this.storesService.getFilterData("username", this.childItem)
    .subscribe(resp=>{

      if(Object.keys(resp).length > 0){
        
        window.open("account/my-store", "_top");

      }else{

        this.store.username = this.childItem;
        this.store.logo = `assets/img/stores/default/default-logo.jpg`;
        this.store.cover = `assets/img/stores/default/default-cover.jpg`;

      }

    })
    /*=============================================
    Traer la información del usuario existente
    =============================================*/

    this.usersService.getFilterData("username", this.childItem)
    .subscribe(resp=>{

      for(const i in resp){

        this.store.email = resp[i].email;
        this.store.country = resp[i].country;
        this.store.city = resp[i].city;
        this.store.address = resp[i].address;

        /*=============================================
        Dar formato al número teléfonico
        =============================================*/

        if(resp[i].phone != undefined){

          this.store.phone = resp[i].phone.split("-")[1];
          this.dialCode = resp[i].phone.split("-")[0];
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

  /*=============================================
  Mover el Scroll hasta donde inicia términos y condiciones
  =============================================*/

  goTerms(){

    $("html, body").animate({

      scrollTop: $("#tabContent").offset().top-50

    }) 

  }
  /*=============================================
  Función que avisa si Acepta términos y condiciones
  =============================================*/

  changeAccept(){

    if(this.accept){

      $("#createStore").tab("show")

      /*=============================================
      Mover el scroll hasta la creación de la tienda
      =============================================*/

      $("html, body").animate({
        
        scrollTop: $("#createStore").offset().top-100

      }) 

    }else{
      $("#createStore").removeClass("active")
    }
  }

  /*=============================================
  Activar módulo para crear producto
  =============================================*/

  createProduct(){

    /*=============================================
    Validar que la tienda esté correctamente creada
    =============================================*/

    let formStore = $(".formStore");

    let error = 0;

    for(let i = 0; i < formStore.length; i++){

      if($(formStore[i]).val() == "" || $(formStore[i]).val() == undefined){

        error++

        $(formStore[i]).parent().addClass("was-validated")

      }
    }

    if(error > 0){

      return;
    }
    this.storeOk = true;

    /*=============================================
    Cuando se activa el módulo para crear el producto
    =============================================*/

    if(this.storeOk){

      $("#createProduct").tab("show")

      /*=============================================
      Mover el scroll hasta la creación de la tienda
      =============================================*/

      $("html, body").animate({

        scrollTop: $("#createProduct").offset().top-100

      }) 

      /*=============================================
      Traer data de categorías
      =============================================*/

      this.categoriesService.getData()
      .subscribe(resp=>{

        for(const i in resp){

          this.categories.push(resp[i]);
        }
      
      })

      /*=============================================
      Agregar imagen del producto por defecto
      =============================================*/

      this.product.image = `assets/img/products/default/default-image.jpg`;

      /*=============================================
      Agregar Imagen Banner Top por defecto
      =============================================*/

      this.topBanner["IMG tag"] = `assets/img/products/default/default-top-banner.jpg`;

    }

    /*=============================================
    Agregar Imagen Banner Default por defecto
    =============================================*/

    this.product.default_banner = `assets/img/products/default/default-banner.jpg`;

    /*=============================================
    Agregar Imagen Slide Horizontal por defecto
    =============================================*/

    this.hSlider["IMG tag"] = `assets/img/products/default/default-horizontal-slider.jpg`;

    /*=============================================
    Agregar Imagen Slide Vertical por defecto
    =============================================*/

    this.product.vertical_slider = `assets/img/products/default/default-vertical-slider.jpg`;

  }

  /*=============================================
  Validación extra para cada campo del formulario
  =============================================*/

  validate(input){

    /*=============================================
    Validamos el nombre de la tienda
    =============================================*/

    if($(input).attr("name") == "storeName" || $(input).attr("name") == "productName"){

      /*=============================================
      Validamos expresión regular del nombre de la tienda
      =============================================*/ 

      let pattern = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]{1,}$/;

      if(!pattern.test(input.value)){

        $(input).parent().addClass('was-validated');

        input.value = "";

        return;

      }else{

        if($(input).attr("name") == "storeName"){ 

          /*=============================================
          Validamos que el nombre de la tienda no esté repetido
          =============================================*/

          this.storesService.getFilterData("store", input.value)
          .subscribe(resp=>{

            if(Object.keys(resp).length > 0){

              $(input).parent().addClass('was-validated')
              input.value = "";
              this.store.url = "";

              Sweetalert.fnc("error", "El nombre de la tienda ya existe", null)

              return;

            }else{

              /*=============================================
              Capitulamos el nombre de la tienda
              =============================================*/

              input.value = Capitalize.fnc(input.value);

              /*=============================================
              Creamos la URL de la tienda
              =============================================*/

              this.store.url = CreateUrl.fnc(input.value);
            }

          })

        }else{

          /*=============================================
          ESTA FUNCIÓN NO PERMITE PUBLICAR PRODUCTOS CON EL MISMO NOMBRE
          =============================================*/

          this.productsService.getFilterData("name", input.value)
          .subscribe(resp=>{

            if(Object.keys(resp).length > 0){

              $(input).parent().addClass('was-validated')
              input.value = "";
              this.product.url = "";

              Sweetalert.fnc("error", "El nombre del producto ya existe", null)

              return;

            }else{

              /*=============================================
              Capitulamos el nombre de la tienda
              =============================================*/

              input.value = Capitalize.fnc(input.value);

              /*=============================================
              Creamos la URL de la tienda
              =============================================*/

              this.product.url = CreateUrl.fnc(input.value);
            }

          })

        }

      }

    }

    /*=============================================
    Validamos la información de la tienda
    =============================================*/

    if($(input).attr("name") == "storeAbout"){

      /*=============================================
      Validamos expresión regular de la información de la tienda
      =============================================*/ 

      let pattern = /^[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\"\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,1000}$/;

      if(!pattern.test(input.value)){

        $(input).parent().addClass('was-validated');

        input.value = "";

        return;

      }else{

        this.store.abstract = input.value.substr(0,100)+"...";
      }

    }

    /*=============================================
    Validamos la ciudad de la tienda
    =============================================*/

    if($(input).attr("name") == "storeCity"){

      /*=============================================
      Validamos expresión regular de la ciudad de la tienda
      =============================================*/ 

      let pattern = /^[A-Za-zñÑáéíóúÁÉÍÓÚ ]{1,}$/;

      if(!pattern.test(input.value)){

        $(input).parent().addClass('was-validated');

        input.value = "";

        return;

      }

    }

    /*=============================================
    Validamos el teléfono de la tienda
    =============================================*/

    if($(input).attr("name") == "storePhone"){

      /*=============================================
      Validamos expresión regular del teléfono de la tienda
      =============================================*/ 

      let pattern = /^[-\\0-9 ]{1,}$/;

      if(!pattern.test(input.value)){

        $(input).parent().addClass('was-validated');

        input.value = "";

        return;

      }

    }

    /*=============================================
    Validamos la dirección de la tienda
    =============================================*/

    if($(input).attr("name") == "storeAddress"){

      /*=============================================
      Validamos expresión regular de la dirección de la tienda
      =============================================*/ 

      let pattern = /^[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\"\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,1000}$/;

      if(!pattern.test(input.value)){

        $(input).parent().addClass('was-validated');

        input.value = "";

        return;

      }

    }

    /*=============================================
    Validamos las redes sociales de la tienda
    =============================================*/

    if($(input).attr("social") == "socialNetwork"){

      /*=============================================
      Validamos expresión regular de la dirección de la tienda
      =============================================*/ 

      let pattern = /^[-\\_\\.\\0-9a-zA-Z]{1,}$/;

      if(!pattern.test(input.value)){

        $(input).parent().addClass('was-validated');

        // input.value = "";

        return;

      }

    }

    /*=============================================
    Validamos los TAGS de los Banner's y Slider's
    =============================================*/

    if($(input).attr("tags") == "tags"){

      /*=============================================
      Validamos expresión regular
      =============================================*/ 

      let pattern = /^[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,50}$/;

      if(!pattern.test(input.value)){

        $(input).parent().addClass('was-validated');

        input.value = "";

        return;
      }
    }

    /*=============================================
    Validamos el video del producto
    =============================================*/

    if($(input).attr("name") == "id_video"){

      /*=============================================
      Validamos expresión regular
      =============================================*/ 

      let pattern = /^[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\"\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,100}$/;

      if(!pattern.test(input.value)){

        $(input).parent().addClass('was-validated');

        return;

      }

    }

  }

  /*=============================================
  Validación para las imágenes del formulario
  =============================================*/

  validateImage(e, tagPicture){

    /*=============================================
    Validamos el formato
    =============================================*/

    let image = e.target.files[0];

    if(image["type"] !== "image/jpeg" && image["type"] !== "image/png"){

      Sweetalert.fnc("error", "La imagen debe estar en formato JPG o PNG.", null)

      return;
    } else if(image["size"] > 2000000){
      
      /*=============================================
      Validamos el tamaño
      =============================================*/

      Sweetalert.fnc("error", "La imagen no debe pesar más de 2 MB", null)

      return;
      
    }else{

      /*=============================================
      Mostramos la imagen temporal
      =============================================*/

      let data = new FileReader();
      data.readAsDataURL(image);

      $(data).on("load", function(event){

        let path = event.target.result; 

        $(`.${tagPicture}`).attr("src", path)

      })

    }

  }

  /*=============================================
  Agregar código dial al input telefónico
  =============================================*/

  changeCountry(input){

    this.countries.forEach(country=>{

      if(input.value == country.name){

        this.dialCode = country.dial_code;
      }

    })

  }

  /*=============================================
  Traer la data de subcategorías de acuerdo a la categoría seleccionada
  =============================================*/

  changeCategory(input){

    let category = input.value.split("_")[0];

    this.subCategoriesService.getFilterData("category", category)
    .subscribe(resp=>{

      this.subcategories = [];

      for(const i in resp){

        this.subcategories.push(resp[i])
      }

    })

  }

  /*=============================================
  Adicionar Input's de forma dinámica
  =============================================*/

  addInput(type){

    if(type == "summary"){

      if(this.summaryGroup.length < 5){

        this.summaryGroup.push({

          input:''
        })

      }else{

        Sweetalert.fnc("error", "Entry limit has been exceeded", null)

      }

    }

    if(type == "details"){

      if(this.detailsGroup.length < 10){

        this.detailsGroup.push({

          title:'',
          value:''
        })

      }else{

        Sweetalert.fnc("error", "Entry limit has been exceeded", null)

      }

    }

    if(type == "specifications"){

      if(this.specificationsGroup.length < 5){

        this.specificationsGroup.push({

          type:'',
          values:''
        })

      }else{

        Sweetalert.fnc("error", "Entry limit has been exceeded", null)

      }

    }

  }

  /*=============================================
  Quitar Input's de forma dinámica
  =============================================*/

  removeInput(i, type){

    if(i > 0){

      if(type == "summary"){

        this.summaryGroup.splice(i, 1) 

      }

      if(type == "details"){

        this.detailsGroup.splice(i, 1) 

      }

      if(type == "specifications"){

        this.specificationsGroup.splice(i, 1) 

      }
    }

  }

  /*=============================================
    Funciones de Dropzone
    =============================================*/

    onSelect(event) {
        
    this.gallery.push(...event.addedFiles);

  }

  onRemove(event) {
   
    this.gallery.splice(this.gallery.indexOf(event), 1);

  }





  /*=============================================
  Envío del formulario
  =============================================*/

  onSubmit(f: NgForm){

    /*=============================================
    Validar que el producto esté correctamente creado
    =============================================*/

    let formProduct = $(".formProduct");

    let error = 0;

    for(let i = 0; i < formProduct.length; i++){

      if($(formProduct[i]).val() == "" || $(formProduct[i]).val() == undefined){

        error++

        $(formProduct[i]).parent().addClass("was-validated")

      }
    }
    /*=============================================
    Validación completa del formulario
    =============================================*/

    if(f.invalid){

      Sweetalert.fnc("error", "Invalid Request", null);

      return;
    }
    






  
  }




}
