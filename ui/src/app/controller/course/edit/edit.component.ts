import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { Course } from 'src/app/model/course';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { default as _rollupMoment } from 'moment';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { CourseService } from 'src/app/service/course.service';
import { CoreService } from 'src/app/service/core.service';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'MMM YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
    dateA11yLabel: 'YYYY/MM/DD',
  },
};
@Component({
  selector: 'app-course-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CourseEditComponent {
  courseForm!: FormGroup;
  course: Course | undefined;
  filteredUniversities: Observable<string[]>;
  filteredCountries: Observable<string[]>;
  filteredCities: Observable<string[]>;
  currencies: { code: string }[] = [
    { code: 'USD' },
    { code: 'EUR' },
    { code: 'GBP' },
    { code: 'JPY' },
    { code: 'AUD' },
    { code: 'CAD' },
    { code: 'CHF' },
    { code: 'CNY' },
    { code: 'SEK' },
    { code: 'NZD' },
    { code: 'MXN' },
    { code: 'SGD' },
    { code: 'HKD' },
    { code: 'NOK' },
    { code: 'KRW' },
    { code: 'TRY' },
    { code: 'RUB' },
    { code: 'INR' },
    { code: 'BRL' },
    { code: 'ZAR' },
    { code: 'SAR' },
    { code: 'AED' },
    { code: 'THB' },
    { code: 'DKK' },
    { code: 'PLN' },
    { code: 'HUF' },
    { code: 'ILS' },
    { code: 'CLP' },
    { code: 'COP' },
    { code: 'PEN' },
    { code: 'MYR' },
    { code: 'IDR' },
    { code: 'PHP' },
    { code: 'VND' },
    { code: 'RSD' },
    { code: 'LKR' },
    { code: 'BDT' },
    { code: 'NPR' },
    { code: 'MOP' },
    { code: 'GHS' },
    { code: 'MAD' },
    { code: 'XOF' },
    { code: 'XAF' },
    { code: 'XPF' },
  ];
  date = new FormControl(moment());

  constructor(
    private _courseService: CourseService,
    private _coreService: CoreService,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<CourseEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.loadCourse(data);

    this.courseForm = this._fb.group({
      CourseName: ['', [Validators.required, Validators.maxLength(50)]],
      CourseDescription: ['', [Validators.required, Validators.maxLength(400)]],
      University: ['', [Validators.required, Validators.maxLength(200)]],
      Country: ['', [Validators.required, Validators.maxLength(50)]],
      City: ['', [Validators.required, Validators.maxLength(100)]],
      StartDate: [null, Validators.required],
      EndDate: [null, Validators.required],
      Currency: [null, Validators.required],
      Price: ['', [Validators.required, Validators.maxLength(20)]],
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

  // Trigger errors manually
  triggerErrors(): void {
    for (const control in this.courseForm.controls) {
      this.courseForm.controls[control].markAsTouched();
      this.courseForm.controls[control].updateValueAndValidity();
    }
  }

  // Identify invalid controls
  getInvalidControls(): string[] {
    const invalidControls = [];
    for (const controlName in this.courseForm.controls) {
      const control = this.courseForm.controls[controlName];
      if (control.invalid && (control.dirty || control.touched)) {
        invalidControls.push(controlName);
      }
    }
    return invalidControls;
  }

  // Transform data for display
  transformAutoComplete(items: any[]): string[] {
    return items.map((item) => (<any>item)['_id']);
  }

  loadCourse(courseId: any) {
    if (courseId) {
      this._courseService
        .findById(courseId)
        .pipe(
          map((item) => {
            item.StartDate = moment((<any>item.StartDate)['$date']);
            item.EndDate = moment((<any>item.EndDate)['$date']);
            return item;
          })
        )
        .subscribe((course: Course) => {
          this.course = course;
        });
    } else {
      this.course = {
        University: '',
        Country: '',
        City: '',
        CourseName: '',
        CourseDescription: '',
        StartDate: '', // or null if you prefer to use null for empty dates
        EndDate: '', // or null
        Price: 0,
        Currency: '',
      };
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.courseForm.controls[controlName].hasError(errorName);
  };

  onFormSubmit() {
    if (this.courseForm.invalid) {
      this.triggerErrors();
      const invalidControls = this.getInvalidControls();
      console.log('Invalid controls:', invalidControls);
      this._coreService.openSnackBar('Invalid Input for:' + invalidControls);
      return;
    }
    const course = this.courseForm.value;
    if (this.data) {
      this._courseService.update(this.data, course).subscribe((response) => {
        console.log('Course updated successfully', response);
        this._coreService.openSnackBar('Course updated successfully');
        this._dialogRef.close(true);
      });
    } else {
      course.Currency = course.Currency.code;
      this._courseService.save(course).subscribe((response) => {
        console.log('Course created successfully', response);
        this._coreService.openSnackBar('Course added successfully');
        this._dialogRef.close(true);
      });
    }
  }

  private _filter(q: string, type: string): Observable<any[]> {
    if (q.replace('/"', '').length < 1) {
      return of();
    }
    return this._courseService.suggest(q, type);
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1.code === o2;
  }
}
