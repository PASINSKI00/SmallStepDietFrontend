import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  address = 'http://localhost:8080';

  constructor(private sharedService: SharedService, private http: HttpClient) { }

  getMe() : Observable<any> {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.get(this.address + '/api/user/me', { observe: 'response', headers: headers, responseType: 'text' as 'json' })
  }
}
