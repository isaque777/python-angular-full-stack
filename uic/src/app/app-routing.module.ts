import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseViewComponent } from './controller/course/view/view.component';
import { CourseService } from './service/course.service';

const routes: Routes = [
  { path: 'courses', component: CourseViewComponent },
  { path: '', redirectTo: '/courses', pathMatch: 'full' },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CourseService],
  declarations: [],
})
export class AppRoutingModule {}
