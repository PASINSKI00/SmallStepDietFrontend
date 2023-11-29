import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  address = environment.backendUrl;

  constructor(private sharedService: SharedService, private http: HttpClient) { }

  getMe() : Observable<any> {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.get(this.address + '/api/user/me', { observe: 'response', headers: headers, responseType: 'text' as 'json' })
  }
}
