import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';

@Component({
  selector: 'app-product-right',
  templateUrl: './product-right.component.html',
  styleUrls: ['./product-right.component.css']
})
export class ProductRightComponent implements OnInit {

  path:String = Path.url;

  constructor() { }

  ngOnInit(): void {
  }

}
