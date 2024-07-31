import { CourseService } from './../../../service/course.service';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable } from 'rxjs';
import { CourseData } from 'src/app/model/course';
import { TransformedCourseData } from 'src/app/model/transformed-course-data';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class CourseViewComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'CourseName',
    'Location',
    'StartDate',
    'Length',
    'Cost',
  ];
  transformedData!: TransformedCourseData[];
  // courses$!: Observable<CourseData[]>;
  // dataSource = new MatTableDataSource<TransformedCourseData>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private courseService: CourseService) {}

  ngAfterViewInit() {
    this.courseService
      .getCourses(1, 10)
      .pipe(map((data) => this.transformCourseData(data)))
      .subscribe((items) => {
        this.transformedData = items;
        // this.transformedData.paginator = this.paginator;
      });
  }

  // Transform data for display
  transformCourseData(data: CourseData[]): TransformedCourseData[] {
    return data.map((course) => {
      debugger;
      const startDate = new Date(course.StartDate);
      const endDate = new Date(course.EndDate);
      const length =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24); // Length in days

      return {
        CourseName: course.CourseName,
        Location: `${course.Country}, ${course.City}, ${course.University}`,
        // StartDate: startDate.toISOString().split('T')[0],
        StartDate: '',
        Length: `${length} days`,
        Cost: `${course.Currency} ${course.Price.toFixed(2)}`,
      };
    });
  }
}
