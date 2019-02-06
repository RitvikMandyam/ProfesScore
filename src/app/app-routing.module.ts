import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RateByCourseComponent} from './rate-by-course/rate-by-course.component';

const routes: Routes = [
  {path: '', component: RateByCourseComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
