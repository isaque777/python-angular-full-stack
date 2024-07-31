import { Course } from 'src/app/model/course';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { map, startWith, switchMap } from 'rxjs';
import { TransformedCourse } from 'src/app/model/transformed-course-data';
import { CourseService } from './../../../service/course.service';
import { MatDialog } from '@angular/material/dialog';
import { CourseEditComponent } from '../edit/edit.component';
/**
 * @title Table with pagination
 */
@Component({
  selector: 'app-course-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class CourseViewComponent implements AfterViewInit {
  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent!: PageEvent;

  displayedColumns: string[] = [
    'CourseName',
    'Location',
    'StartDate',
    'Length',
    'Cost',
    'Edit',
  ];
  transformedData!: TransformedCourse[];
  dataSource = new MatTableDataSource<TransformedCourse>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private courseService: CourseService, public dialog: MatDialog) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    this.loadPaginatedData();
  }

  private loadPaginatedData() {
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() =>
          this.courseService.find(
            this.paginator.pageIndex,
            this.paginator.pageSize
          )
        ),
        map((data) => {
          this.length = data.total_items; // Total items might be more accurate than total_pages
          return data;
        }),
        map((data) => this.transformCourse(data.courses))
      )
      .subscribe((items) => {
        this.transformedData = items;
        this.dataSource.data = this.transformedData;
      });
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  openDialog(data: string) {
    const dialogRef = this.dialog.open(CourseEditComponent, {
      data,
      width:'80%',   // Set width to 80%  of the window's total width
      height:'80%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.loadPaginatedData();
    });
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
  }

  addData() {
    // const randomElementIndex = Math.floor(Math.random() * ELEMENT_DATA.length);
    // this.dataSource.push(ELEMENT_DATA[randomElementIndex]);
    // this.table.renderRows();
  }

  removeData() {
    // this.dataSource.pop();
    // this.table.renderRows();
  }

  // Transform data for display
  transformCourse(data: Course[]): TransformedCourse[] {
    return data.map((course) => {
      const startDate = moment((<any>course.StartDate)['$date']);
      const endDate = moment((<any>course.EndDate)['$date']);

      const duration = moment.duration(endDate.diff(startDate));
      const length = duration.asDays();

      return {
        CourseName: course.CourseName,
        Location: `${course.Country}, ${course.City}, ${course.University}`,
        StartDate: startDate.toDate(),
        Length: `${length}`,
        Currency: `${course.Currency}`,
        Cost: `${course.Price.toFixed(2)}`,
        id: (<any>course)['_id'].$oid,
      };
    });
  }
}
