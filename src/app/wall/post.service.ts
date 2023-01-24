import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageService } from '../image.service';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  address = "http://localhost:8080";

  constructor(private sharedService: SharedService, private http: HttpClient, private imageService: ImageService) { }

  getPosts() : Observable<any> {
    return this.http.get(this.address + '/api/post/all', { observe: 'response', responseType: 'text' as 'json' })
  }

  addPost(content: string) : Observable<any> {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.post(this.address + '/api/post', { content: content }, {headers: headers, observe: 'response', responseType: 'text' as 'json' });
  }

  deletePost(idPost: number) {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.delete(this.address + '/api/post', {params:{idPost}, headers: headers, observe: 'response', responseType: 'text' as 'json' });
  }

  uploadImage(image: string, idPost: number) : Observable<any> {
    return this.imageService.uploadPostImage(image, idPost);
  }
}
