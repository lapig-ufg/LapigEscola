/**
 * Página Service
 * Gerencia operações relacionadas a páginas estáticas e navegação
 */

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { MenuItemSchema, PaginaEstatica } from '@/models';

@Injectable({
  providedIn: 'root'
})
export class PaginaService {
  private readonly api = inject(ApiService);

  /**
   * Obtém os itens do menu de navegação
   */
  getMenu(): Observable<MenuItemSchema[]> {
    return this.api.get<MenuItemSchema[]>('pages/menu');
  }

  /**
   * Obtém uma página estática pelo slug
   */
  getPage(slug: string): Observable<PaginaEstatica> {
    return this.api.get<PaginaEstatica>(`pages/get/${slug}`);
  }
}
