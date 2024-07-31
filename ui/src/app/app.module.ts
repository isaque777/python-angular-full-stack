
import { CommonModule } from "@angular/common";
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CourseEditComponent } from './controller/course/edit/edit.component';
import { CourseViewComponent } from './controller/course/view/view.component';
import { MaterialModule } from './material.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';
import { CoreService } from "./service/core.service";

@NgModule({
  declarations: [AppComponent, CourseViewComponent, CourseEditComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    MatMomentDateModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [CoreService,
    { provide: MAT_DIALOG_DATA, useValue: {} }],
  bootstrap: [AppComponent],
})
export class AppModule {}
