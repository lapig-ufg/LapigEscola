/**
 * API Service - Base HTTP Client
 * Serviço base para todas as chamadas HTTP da aplicação
 */

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  /**
   * Método genérico GET
   */
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Método genérico POST
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Método genérico PUT
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Método genérico DELETE
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Tratamento centralizado de erros HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro desconhecido';

    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente ou de rede
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      errorMessage = `Código ${error.status}: ${error.message}`;

      if (error.error && typeof error.error === 'object') {
        // Se o backend retornar uma mensagem de erro estruturada
        errorMessage = error.error.message || errorMessage;
      }
    }

    console.error('Erro na requisição:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
