import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Buffer } from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  address = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  login(form: FormGroup) : Observable<any> {
    var buf = Buffer.from(form.value.email + ':' + form.value.password);
    const headers = new HttpHeaders({Authorization: 'Basic ' + buf.toString('base64')});
    return this.http.get(this.address + '/api/login', { observe: 'response', headers: headers, responseType: 'text' as 'json' });
  }

  signup(form: FormGroup) : Observable<any> {
    console.log(form.value);
    return this.http.post(this.address + '/api/user', form.value);
  }
}
