import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';
import { OwlCarouselConfig, BackgroundImage } from '../../../functions';

import { ProductsService } from '../../../services/products.service';


@Component({
  selector: 'app-best-sales-items',
  templateUrl: './best-sales-items.component.html',
  styleUrls: ['./best-sales-items.component.css']
})
export class BestSalesItemsComponent implements OnInit {

  path:String = Path.url;

  constructor() { }

  ngOnInit(): void {
  }

}
