import { Course } from "./course";

export interface PaginatedCourse {
  total_items: number;
  total_pages: number;
  page: number;
  page_size: number;
  courses: Course[];
}
