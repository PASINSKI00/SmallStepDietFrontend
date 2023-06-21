import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { lastValueFrom } from 'rxjs';
import { ImageService } from 'src/app/image.service';
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
  imageChangedEvent: any = '';
  croppedImage: any = '';
  hideFileInput = true;

  constructor(private sharedService: SharedService, private userService: UserService, private router: Router, private imageService: ImageService) { }

  ngOnInit(): void {
    this.userService.getMe().subscribe(response => {
      this.user = JSON.parse(response.body);
    });
  }

  logout() {
    this.sharedService.logout() ? this.router.navigate(['/home']) : null;
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  loadImageFailed() {
    alert("Image load failed. Please try again.");
  }

  uploadImage() {
    this.imageService.uploadUserImage(this.croppedImage).subscribe(
      (response) => {
        alert("Image uploaded successfully!");
        this.hideFileInput = true;
        location.reload();
      },
      (error) => {
        alert("Image upload failed. Please try again.");
      }
    );
  }
}
