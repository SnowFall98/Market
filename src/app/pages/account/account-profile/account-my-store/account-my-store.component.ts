import { Component, OnInit } from '@angular/core';
import { Path } from '../../../../config';

@Component({
  selector: 'app-account-my-store',
  templateUrl: './account-my-store.component.html',
  styleUrls: ['./account-my-store.component.css']
})
export class AccountMyStoreComponent implements OnInit {

	path:string = Path.url;

  constructor() { }

  ngOnInit(): void {
  }

}
