import { Component } from '@angular/core';

import { Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CourseService } from 'src/app/service/course.service';

@Component({
  selector: 'app-course-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass'],
})
export class CourseEditComponent {
  courseForm: FormGroup;
  // types: Array<Type>;

  constructor(
    private _courseService: CourseService,
    private formBuilder: FormBuilder,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<CourseEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.courseForm = this._fb.group({
      code: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          // ValidationService.invalidHardCodedConstant,
        ],
      ],
      description: ['', [Validators.required, Validators.maxLength(20)]],
      typeFather: ['', null],
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.courseForm.controls[controlName].hasError(errorName);
  };

  onFormSubmit() {
    if (this.courseForm.valid) {
      const type = this.courseForm.value;
      // type.typeFather = this.types.filter(
      //   (type) => type.id === this.typeFatherSelected
      // )[0];
      if (this.data) {
        // this._typeService.update(this.data.id, this.typeForm.value).subscribe({
        //   next: (val: any) => {
        //     this._courseService.openSnackBar('Type detail updated!');
        //     this._dialogRef.close(true);
        //   },
        // });
      } else {
        // this._typeService.save(type).subscribe({
        //   next: (val: any) => {
        //     this._courseService.openSnackBar('Type added successfully');
        //     this._dialogRef.close(true);
        //   },
        // });
      }
    }
  }

  // private loadTypes() {
  //   this._typeService.findAll().subscribe({
  //     next: (res) => {
  //       this.types = res;
  //     },
  //   });
  // }
}
