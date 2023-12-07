import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  address = environment.backendUrl;

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  uploadMealImage(image: string, idMeal: number) : Observable<any> {
    let headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.address + '/api/image/meal', image, { observe: 'response', params: {idMeal}, headers: headers, responseType: 'text' as 'json' });
  }

  uploadUserImage(image: string) : Observable<any> {
    let headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.address + '/api/image/user/mine', image, { observe: 'response', headers: headers, responseType: 'text' as 'json' });
  }
}
