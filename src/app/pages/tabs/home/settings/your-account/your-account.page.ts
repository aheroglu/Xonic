import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-your-account',
  templateUrl: './your-account.page.html',
  styleUrls: ['./your-account.page.scss'],
})
export class YourAccountPage implements OnInit {
  loggedUser: any;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getLoggedUser();
  }

  async getLoggedUser() {
    await this.userService.getLoggedUserData().subscribe({
      next: (response) => {
        this.loggedUser = response;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
