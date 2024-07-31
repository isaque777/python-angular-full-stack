import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from 'src/app/model/course';
import { PaginatedCourse } from '../model/paginated-course';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private baseUrl = 'http://localhost:8000/courses'; // Adjust to match your API endpoint

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  /**
   * Create a new course.
   * @param Course The data of the course to be created.
   * @returns An observable with the response containing the inserted course ID.
   */
  createCourse(Course: Course): Observable<any> {
    return this.http.post(`${this.baseUrl}`, Course, { headers: this.headers });
  }

  /**
   * Get courses with pagination.
   * @param page The page number for pagination.
   * @param pageSize The number of courses per page.
   * @returns An observable with the list of courses.
   */
  getCourses(page: number, pageSize: number): Observable<PaginatedCourse> {
    return this.http.get<PaginatedCourse>(
      `${this.baseUrl}?page=${page}&page_size=${pageSize}`
    );
  }

  /**
   * Update an existing course.
   * @param courseId The ID of the course to be updated.
   * @param updateData The updated data for the course.
   * @returns An observable with the response containing the number of modified documents.
   */
  updateCourse(courseId: string, updateData: Partial<Course>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${courseId}`, updateData, {
      headers: this.headers,
    });
  }

  /**
   * Delete a course.
   * @param courseId The ID of the course to be deleted.
   * @returns An observable with the response containing the number of deleted documents.
   */
  deleteCourse(courseId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${courseId}`);
  }

  // Method to get course by ID
  getCourse(courseId: string): Observable<Course> {
    const url = `${this.baseUrl}/${courseId}`;
    return this.http.get<Course>(url);
  }

  /**
   * Get autocomplete suggestions for courses based on query and type.
   * @param query The search query string.
   * @param type The type of the category to filter by (e.g., 'University').
   * @returns Observable containing the list of suggestions.
   */
  getAutocompleteSuggestions(query: string, type: string): Observable<any> {
    const params = new HttpParams().set('q', query).set('type', type);

    return this.http.get<any>(`${this.baseUrl}/autocomplete`, { params });
  }
}
