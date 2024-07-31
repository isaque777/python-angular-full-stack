import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from 'src/app/service/core.service';
import { CourseService } from 'src/app/service/course.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass'],
})
export class CourseDeleteComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _dialogRef: MatDialogRef<CourseDeleteComponent>,
    private _courseService: CourseService,
    private _coreService: CoreService
  ) {}

  deleteCourse() {
    this._courseService.delete(this.data).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Course deleted!', 'done');
        this._dialogRef.close(true);
      },
    });
  }
}
