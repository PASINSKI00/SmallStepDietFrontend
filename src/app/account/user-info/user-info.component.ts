import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { lastValueFrom } from 'rxjs';
import { ImageService } from 'src/app/image.service';
import { AlertDetails } from 'src/app/overlays/alert/alert-details';
import { RedirectDetails } from 'src/app/overlays/redirect/redirect-details';
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

  isLoading: boolean = false;
  isLoggingOut: boolean = false;

  constructor(private sharedService: SharedService, private userService: UserService, private imageService: ImageService) { }

  async ngOnInit() {
    this.isLoading = true;
    await lastValueFrom(this.userService.getMe()).then(response => {
      this.user = JSON.parse(response.body);
    }).catch(() => {
      const alertDetails = new AlertDetails("Something went wrong. Please try again.")
      this.sharedService.emitChange(alertDetails);
    });
    this.isLoading = false;
  }

  logout() {
    this.isLoggingOut = true;
    this.sharedService.logout() ? this.sharedService.emitChange(new RedirectDetails("Logged Out Successfully.", '/home', true)) : null;
    this.isLoggingOut = false;
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  loadImageFailed() {
    const alertDetails = new AlertDetails("Image load failed. Please try again.");
    this.sharedService.emitChange(alertDetails);
  }

  uploadImage() {
    this.imageService.uploadUserImage(this.croppedImage).subscribe(
      () => {
        this.hideFileInput = true;
        location.reload();
      },
      () => {
        const alertDetails = new AlertDetails("Image upload failed. Please try again.");
        this.sharedService.emitChange(alertDetails);
      }
    );
  }
}
