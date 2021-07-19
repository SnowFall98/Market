import { Component, OnInit } from '@angular/core';
import  { NgForm } from '@angular/forms';

import { UsersModel } from '../../models/users.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: UsersModel;

  constructor() {

		this.user = new UsersModel(); 
  }

  ngOnInit(): void {
  }

}
