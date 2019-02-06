import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendDataService {
  departmentsUrl = 'https://us-central1-professcore.cloudfunctions.net/get_depts';
  classesUrl = 'https://us-central1-professcore.cloudfunctions.net/get_classes';
  ratingsUrl = 'https://us-central1-professcore.cloudfunctions.net/get_ratings';

  constructor(private http: HttpClient) { }

  getDepartments() {
    return this.http.get(this.departmentsUrl);
  }
  getClasses(dept) {
    return this.http.get(this.classesUrl + '?dept=' + dept);
  }
  getRatings(dept, class_) {
    return this.http.get(this.ratingsUrl + '?dept=' + dept + '&class=' + encodeURIComponent(class_));
  }
}
