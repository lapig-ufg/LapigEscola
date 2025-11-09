/**
 * Conteúdo Service
 * Gerencia operações relacionadas ao conteúdo de temas
 */

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Conteudo,
  ImagemGaleria,
  LayersSchema,
  SchemaCuriosidade,
  SchemaPedagogia,
  Curiosidade,
  RecursoPedagogico
} from '@/models';

@Injectable({
  providedIn: 'root'
})
export class ConteudoService {
  private readonly api = inject(ApiService);

  /**
   * Base path para endpoints de tema
   */
  private getBasePath(biomaSlug: string, temaSlug: string): string {
    return `bioma/${biomaSlug}/tema/${temaSlug}`;
  }

  /**
   * Obtém o conteúdo textual de um tema
   */
  getConteudo(biomaSlug: string, temaSlug: string): Observable<Conteudo> {
    return this.api.get<Conteudo>(`${this.getBasePath(biomaSlug, temaSlug)}/conteudo`);
  }

  /**
   * Obtém as camadas geoespaciais de um tema
   */
  getLayers(biomaSlug: string, temaSlug: string): Observable<LayersSchema> {
    return this.api.get<LayersSchema>(`${this.getBasePath(biomaSlug, temaSlug)}/layers`);
  }

  /**
   * Obtém as imagens da galeria de um tema
   */
  getImages(biomaSlug: string, temaSlug: string): Observable<ImagemGaleria[]> {
    return this.api.get<ImagemGaleria[]>(`${this.getBasePath(biomaSlug, temaSlug)}/image`);
  }

  /**
   * Obtém as curiosidades de um tema
   */
  getCuriosidades(biomaSlug: string, temaSlug: string): Observable<SchemaCuriosidade[]> {
    return this.api.get<SchemaCuriosidade[]>(`${this.getBasePath(biomaSlug, temaSlug)}/curiosidades`);
  }

  /**
   * Obtém os recursos pedagógicos de um tema
   */
  getPedagogias(biomaSlug: string, temaSlug: string): Observable<SchemaPedagogia[]> {
    return this.api.get<SchemaPedagogia[]>(`${this.getBasePath(biomaSlug, temaSlug)}/pedagogias`);
  }

  /**
   * Obtém detalhes de uma curiosidade específica
   */
  getCuriosidadeDetail(id: number): Observable<Curiosidade> {
    return this.api.get<Curiosidade>(`pages/curiosidade/${id}`);
  }

  /**
   * Obtém detalhes de um recurso pedagógico específico
   */
  getPedagogiaDetail(id: number): Observable<RecursoPedagogico> {
    return this.api.get<RecursoPedagogico>(`pages/pedagogia/${id}`);
  }
}
