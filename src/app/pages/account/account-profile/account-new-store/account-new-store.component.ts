import { Component, OnInit } from '@angular/core';
import { Path } from '../../../../config';

@Component({
  selector: 'app-account-new-store',
  templateUrl: './account-new-store.component.html',
  styleUrls: ['./account-new-store.component.css']
})
export class AccountNewStoreComponent implements OnInit {

  path:string = Path.url;

  constructor() { }

  ngOnInit(): void {
  }

}
