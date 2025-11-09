/**
 * Bioma Service
 * Gerencia operações relacionadas a Biomas e Temas
 */

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { BiomaSchema, Bioma } from '@/models';

@Injectable({
  providedIn: 'root'
})
export class BiomaService {
  private readonly api = inject(ApiService);

  /**
   * Lista todos os biomas com seus temas
   */
  listBiomas(): Observable<BiomaSchema[]> {
    return this.api.get<BiomaSchema[]>('bioma/list');
  }

  /**
   * Obtém informações detalhadas de um bioma específico
   */
  getBiomaInfo(biomaSlug: string): Observable<Bioma> {
    return this.api.get<Bioma>(`bioma/${biomaSlug}/info`);
  }
}
