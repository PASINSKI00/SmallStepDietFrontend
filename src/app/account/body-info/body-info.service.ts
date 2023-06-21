import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BodyInfoService {
  address = 'http://localhost:8080';

  constructor(private sharedService: SharedService, private http: HttpClient) { }

  getBodyInfo(): Observable<any> {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.get(this.address + '/api/user/bodyinfo', { observe: 'response', headers: headers, responseType: 'text' as 'json' })
  }

  saveBodyInfo(bodyInfoForm: FormGroup): Observable<any> {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.post(this.address + '/api/user/bodyinfo', bodyInfoForm.value, { observe: 'response', headers: headers, responseType: 'text' as 'json' })
  }
}
