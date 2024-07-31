import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CourseEditComponent } from './controller/course/edit/edit.component';
import { CourseDeleteComponent } from './controller/course/view/delete/delete.component';
import { CourseViewComponent } from './controller/course/view/view.component';
import { AppErrorInterceptor } from './interceptor/app.http.error.interceptor';
import { MaterialModule } from './material.module';
import { CoreService } from './service/core.service';

@NgModule({
  declarations: [
    AppComponent,
    CourseViewComponent,
    CourseDeleteComponent,
    CourseEditComponent,
  ],
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
  providers: [
    CoreService,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: HTTP_INTERCEPTORS, useClass: AppErrorInterceptor, multi: true },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
