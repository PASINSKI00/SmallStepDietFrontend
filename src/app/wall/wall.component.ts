import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Post } from './post';
import { PostService } from './post.service';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.sass']
})
export class WallComponent implements OnInit {
  posts: Post[] = [];
  addPostActive: boolean = false;
  returnIcon = faAngleLeft;
  postContent: string = "";
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(private postService: PostService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getPosts();
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log("Image cropped!");
  }

  loadImageFailed() {
    console.error("Image load failed!");
  }

  async getPosts() {
    const response$ = this.postService.getPosts();
    const lastValue = await lastValueFrom(response$);

    if(lastValue.status != 200) {
      alert("Error: " + lastValue.status);
      return;
    }
  
    this.posts = JSON.parse(lastValue.body);

    this.posts.forEach(post => {
      post.postDate = this.datePipe.transform(post.postDate, 'medium')!;
    });
  }

  async upload(){
    if(this.postContent == "") {
      alert("Post content cannot be empty!");
      return;
    }

    const response$ = this.postService.addPost(this.postContent);
    const lastValue$ = await lastValueFrom(response$);

    if(lastValue$.status != 201) {
      alert("Error: " + lastValue$.status);
      return;
    }

    const idPost: number = lastValue$.body;
    console.log("Post id: " + idPost);

    if(this.croppedImage != "") {
      const response$ = this.postService.uploadImage(this.croppedImage, idPost);
      const lastValue = await lastValueFrom(response$);

      if(lastValue.status != 200) {
        alert("Error: " + lastValue.status);
        return;
      }
    }
  }
}
