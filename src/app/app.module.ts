import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonToggleModule,
  MatChipsModule,
  MatIconModule,
  MatRippleModule,
  MatSelectModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule
} from '@angular/material';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {RateByCourseComponent} from './rate-by-course/rate-by-course.component';
import {LogoComponent} from './logo/logo.component';
import {LoaderComponent} from './loader/loader.component';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent,
    RateByCourseComponent,
    LogoComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatChipsModule,
    MatRippleModule,
    MatStepperModule,
    FlexLayoutModule,
    MatButtonToggleModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
