import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment'

/**
 * Servicio base para configuración de API
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);

  // URL base de la API de Strapi
  private readonly API_URL: string = environment.apiUrl;

  protected get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.API_URL}${endpoint}`).pipe(
      catchError(this.handleError)
    );
  }

  protected post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.API_URL}${endpoint}`, body).pipe(
      catchError(this.handleError)
    );
  }

  protected put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.API_URL}${endpoint}`, body).pipe(
      catchError(this.handleError)
    );
  }

  protected delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.API_URL}${endpoint}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

      if (error.error?.error?.message) {
        errorMessage = error.error.error.message;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
