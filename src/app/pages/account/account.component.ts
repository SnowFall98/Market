import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private userService: UsersService) { }

  ngOnInit(): void {

    this.userService.authActivate().then(resp =>{

      if(!resp) {
        window.open("login", "_top")
      }
    })
  }

}
