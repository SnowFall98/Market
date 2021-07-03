import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';

@Component({
  selector: 'app-product-left',
  templateUrl: './product-left.component.html',
  styleUrls: ['./product-left.component.css']
})
export class ProductLeftComponent implements OnInit {

  path:String = Path.url;
  
  constructor() { }

  ngOnInit(): void {
  }

}
