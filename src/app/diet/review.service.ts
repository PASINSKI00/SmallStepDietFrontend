import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  address: string = 'http://localhost:8080';

  constructor(private sharedService: SharedService, private http: HttpClient) { }

  reviewMeal(reviewForm: FormGroup): Observable<any> {
    const headers = new HttpHeaders({Authorization: this.sharedService.getAuthHeaderValue()});
    return this.http.post(this.address + '/api/meal/review', reviewForm.value, { headers: headers, observe: 'response', responseType: 'text' as 'json' })
  }
}
