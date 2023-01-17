import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { SharedService } from 'src/app/shared.service';
import { User } from 'src/app/user';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.sass']
})
export class UserInfoComponent implements OnInit {
  user: User = null!;

  constructor(private sharedService: SharedService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.getMe().subscribe(response => {
      this.user = JSON.parse(response.body);
      console.log(this.user);
    });
  }

  logout() {
    this.sharedService.logout();
    this.router.navigate(['/home']);
  }
}
