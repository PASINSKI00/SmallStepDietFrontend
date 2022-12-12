import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  address = 'http://localhost:8080';

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  uploadMealImage(image: string, idMeal: number) : Observable<any> {

    let headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeader()});
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.address + '/api/image/meal', image, { observe: 'response', params: {idMeal}, headers: headers, responseType: 'text' as 'json' });
  }
}
