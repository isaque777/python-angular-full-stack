import { Moment } from "moment";

export  interface Course {
  // Define properties of a course based on your data schema
  // Example properties are included; adjust as necessary
  University: string;
  Country: string;
  City: string;
  CourseName: string;
  CourseDescription: string;
  StartDate: string | Moment;
  EndDate: string | Moment;
  Price: number;
  Currency: string;
}
