import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
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
