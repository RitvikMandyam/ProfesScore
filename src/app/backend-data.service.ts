import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendDataService {
  departmentsUrl = 'https://us-central1-professcore.cloudfunctions.net/get_depts_dev';
  classesUrl = 'https://us-central1-professcore.cloudfunctions.net/get_classes_dev';
  ratingsUrl = 'https://us-central1-professcore.cloudfunctions.net/get_ratings_dev';

  constructor(private http: HttpClient) { }

  getDepartments() {
    return this.http.get(this.departmentsUrl);
  }
  getClasses(dept, quarter) {
    return this.http.get(this.classesUrl + '?dept=' + dept + '&quarter=' + quarter);
  }
  getRatings(dept, class_, quarter) {
    return this.http.get(this.ratingsUrl + '?dept=' + dept + '&class=' + encodeURIComponent(class_) + '&quarter=' + quarter);
  }
}
