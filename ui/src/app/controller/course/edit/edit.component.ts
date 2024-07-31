import { Course } from 'src/app/model/course';
import { Component } from '@angular/core';

import { Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CourseService } from 'src/app/service/course.service';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-course-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class CourseEditComponent {
  courseForm!: FormGroup;
  course: Course | undefined;
  filteredUniversities: Observable<string[]>;
  filteredCountries: Observable<string[]>;
  filteredCities: Observable<string[]>;
  // myControl = new FormControl();

  constructor(
    private _courseService: CourseService,
    private formBuilder: FormBuilder,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<CourseEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.loadCourse(data);

    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(400),
    //   distinctUntilChanged(),
    //   switchMap((val) => {
    //     return this.filter(val || '', 'University');
    //   })
    // );

    // Assuming _fb is your FormBuilder instance
    this.courseForm = this._fb.group({
      CourseName: ['', [Validators.required, Validators.maxLength(20)]],
      CourseDescription: ['', [Validators.required, Validators.maxLength(100)]],
      University: ['', [Validators.required, Validators.maxLength(50)]],
      Country: ['', [Validators.required, Validators.maxLength(50)]],
      City: ['', [Validators.required, Validators.maxLength(50)]],
    });

    this.filteredUniversities = this.courseForm
      .get('University')!
      .valueChanges.pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value) => this._filter(value, 'University')),
        map((item) => this.transformAutoComplete(item))
      );


    this.filteredCountries = this.courseForm.get('Country')!.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((value) => this._filter(value, 'Country')),
      map((item) => this.transformAutoComplete(item))
    );

    this.filteredCities = this.courseForm.get('City')!.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((value) => this._filter(value, 'City')),
      map((item) => this.transformAutoComplete(item))
    );
  }

  // Transform data for display
  transformAutoComplete(items: any[]): string[] {
    return items.map((item) => (<any>item)['_id']);
  }

  loadCourse(courseId: any) {
    if (courseId) {
      this._courseService.getCourse(courseId).subscribe((course: Course) => {
        this.course = course;
      });
    }
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

  // // filter and return the values
  // filter(q: string, type: string): Observable<any[]> {
  //   debugger
  //   // call the service which makes the http-request
  //   return this._courseService.getAutocompleteSuggestions(q, type);
  //   // .pipe(
  //   //   map((response) =>
  //   //     response.filter((option : any) => {
  //   //       return option.name.toLowerCase().indexOf(val.toLowerCase()) === 0;
  //   //     })
  //   //   )
  //   // );
  // }

  private _filter(q: string, type: string): Observable<any[]> {
    if (q.replace('/"', '').length < 1) {
      return of();
    }
    return this._courseService.getAutocompleteSuggestions(q, type);
  }
}
