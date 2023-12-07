import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Buffer } from 'buffer';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  address = environment.backendUrl;

  constructor(private http: HttpClient) { }

  login(form: FormGroup) : Observable<any> {
    var buf = Buffer.from(form.value.email + ':' + form.value.password);
    const headers = new HttpHeaders({Authorization: 'Basic ' + buf.toString('base64')});
    return this.http.get(this.address + '/api/login', { observe: 'response', headers: headers, responseType: 'text' as 'json' });
  }

  signup(form: FormGroup) : Observable<any> {
    return this.http.post(this.address + '/api/user', form.value);
  }
}
