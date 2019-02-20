import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule, MatButtonModule,
  MatButtonToggleModule,
  MatChipsModule,
  MatIconModule,
  MatInputModule,
  MatRippleModule,
  MatSelectModule, MatSnackBarModule,
  MatSortModule,
  MatTableModule, MatToolbarModule, MatTooltipModule
} from '@angular/material';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {RateByCourseComponent} from './rate-by-course/rate-by-course.component';
import {LogoComponent} from './logo/logo.component';
import {LoaderComponent} from './loader/loader.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { ScheduleComponent } from './schedule/schedule.component';

@NgModule({
  declarations: [
    AppComponent,
    RateByCourseComponent,
    LogoComponent,
    LoaderComponent,
    ScheduleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatChipsModule,
    MatRippleModule,
    MatAutocompleteModule,
    FlexLayoutModule,
    MatButtonToggleModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatToolbarModule,
    MatSnackBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
