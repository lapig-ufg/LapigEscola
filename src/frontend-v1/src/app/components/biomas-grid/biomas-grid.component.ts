/**
 * Biomas Grid Component
 * Grid de biomas em destaque na landing page
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { BiomaService } from '@/services';
import { BiomaSchema } from '@/models';
import { environment } from '@/environments/environment'

/**
 * Interface estendida para incluir campos opcionais do bioma
 */
interface BiomaDisplay extends BiomaSchema {
  descricao?: string;
  imagem?: string;
}

/**
 * Descrições padrão dos biomas brasileiros
 */
const BIOMA_DESCRIPTIONS: Record<string, string> = {
  'amazonia': 'A maior floresta tropical do mundo, com incrível biodiversidade e rios caudalosos. Abriga milhares de espécies de plantas, animais e povos indígenas. Essencial para o equilíbrio climático do planeta.',
  'cerrado': 'Savana brasileira com árvores retorcidas e rica biodiversidade. Considerado o berço das águas, abriga nascentes de importantes bacias hidrográficas. Segundo maior bioma do Brasil.',
  'mata-atlantica': 'Floresta exuberante que acompanha o litoral brasileiro. Possui uma das maiores biodiversidades do planeta, com muitas espécies endêmicas. Um dos biomas mais ameaçados do mundo.',
  'caatinga': 'Único bioma exclusivamente brasileiro, adaptado ao clima semiárido. Flora resistente à seca com cactáceas e plantas de folhas pequenas. Região de grande importância cultural e histórica.',
  'pampa': 'Campos sulinos com vastas planícies de gramíneas e vegetação rasteira. Importante para a pecuária e conservação de espécies campestres. Caracterizado por um relevo suavemente ondulado.',
  'pantanal': 'Maior planície alagável do mundo, com rica fauna e flora. Santuário ecológico com grande concentração de animais silvestres. Alterna períodos de cheia e seca ao longo do ano.'
};

/**
 * Imagens locais dos biomas brasileiros
 */
const prefix = environment.assetPrefix ? '/static/' : '/';

const BIOMA_IMAGES: Record<string, string> = {
  'amazonia': `${prefix}layout/images/biomas/amazonia.webp`,
  'cerrado': `${prefix}layout/images/biomas/cerrado.webp`,
  'mata-atlantica': `${prefix}layout/images/biomas/mata-atlantica.webp`,
  'caatinga': `${prefix}layout/images/biomas/caatinga.webp`,
  'pampa': `${prefix}layout/images/biomas/pampa.webp`,
  'pantanal': `${prefix}layout/images/biomas/pantanal.webp`,
};
@Component({
  selector: 'app-biomas-grid',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule, TagModule],
  template: `
    <section class="biomas-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Explore os Biomas Brasileiros</h2>
          <p class="section-description">
            Conheça a diversidade ecológica do Brasil através de conteúdos educacionais
            sobre cada bioma, suas características e importância ambiental.
          </p>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="loading-container">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          <p class="mt-3">Carregando biomas...</p>
        </div>

        <!-- Biomas Grid -->
        <div *ngIf="!loading && biomas.length > 0" class="biomas-grid">
          <div *ngFor="let bioma of biomas" class="bioma-card-wrapper">
            <p-card [styleClass]="'bioma-card bioma-' + bioma.slug">
              <ng-template pTemplate="header">
                <div class="bioma-header">
                  <img
                    [src]="getBiomaImage(bioma)"
                    [alt]="bioma.nome"
                    class="bioma-image"
                  />
                  <div class="bioma-overlay">
                    <h3 class="bioma-name">{{ bioma.nome }}</h3>
                    <p-tag
                      *ngIf="getTemasCount(bioma) > 0"
                      [value]="getTemasCount(bioma) + ' temas'"
                      [rounded]="true"
                      styleClass="bioma-tag"
                    />
                  </div>
                </div>
              </ng-template>

              <div class="bioma-content">
                <p class="bioma-description">
                  {{ getBiomaDescription(bioma) }}
                </p>
              </div>

              <ng-template pTemplate="footer">
                <div class="bioma-footer">
                  <p-button
                    label="Explorar"
                    icon="pi pi-arrow-right"
                    [routerLink]="getBiomaLink(bioma)"
                    [outlined]="true"
                    styleClass="w-full"
                  />
                </div>
              </ng-template>
            </p-card>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && biomas.length === 0" class="empty-state">
          <i class="pi pi-info-circle" style="font-size: 3rem"></i>
          <p class="mt-3">Nenhum bioma disponível no momento.</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .biomas-section {
      padding: 5rem 2rem;
      background: transparent;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 0 0 1rem 0;
    }

    .section-description {
      font-size: 1.125rem;
      color: var(--text-color-secondary);
      max-width: 700px;
      margin: 0 auto;
      line-height: 1.7;
    }

    .biomas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
    }

    .bioma-card-wrapper {
      animation: fadeInScale 0.5s ease-out backwards;
    }

    .bioma-card-wrapper:nth-child(1) { animation-delay: 0.1s; }
    .bioma-card-wrapper:nth-child(2) { animation-delay: 0.2s; }
    .bioma-card-wrapper:nth-child(3) { animation-delay: 0.3s; }
    .bioma-card-wrapper:nth-child(4) { animation-delay: 0.4s; }
    .bioma-card-wrapper:nth-child(5) { animation-delay: 0.5s; }
    .bioma-card-wrapper:nth-child(6) { animation-delay: 0.6s; }

    :host ::ng-deep .bioma-card {
      height: 100%;
      overflow: hidden;
      transition: all 0.3s ease;
      border: 1px solid var(--surface-border);
    }

    :host ::ng-deep .bioma-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    }

    .bioma-header {
      position: relative;
      height: 220px;
      overflow: hidden;
      background: var(--surface-100);
    }

    .bioma-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    :host ::ng-deep .bioma-card:hover .bioma-image {
      transform: scale(1.1);
    }

    .bioma-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1.5rem;
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.8) 0%,
        rgba(0, 0, 0, 0.4) 50%,
        transparent 100%
      );
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .bioma-name {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    :host ::ng-deep .bioma-tag {
      align-self: flex-start;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .bioma-content {
      padding: 0.5rem 0;
      min-height: 80px;
    }

    .bioma-description {
      color: var(--text-color-secondary);
      line-height: 1.6;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .bioma-footer {
      border-top: 1px solid var(--surface-border);
      padding-top: 1rem;
    }

    .loading-container,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
      color: var(--text-color-secondary);
    }

    /* Cores específicas por bioma */
    :host ::ng-deep .bioma-amazonia .bioma-overlay {
      background: linear-gradient(to top, rgba(16, 124, 16, 0.9) 0%, transparent 100%);
    }

    :host ::ng-deep .bioma-cerrado .bioma-overlay {
      background: linear-gradient(to top, rgba(202, 138, 4, 0.9) 0%, transparent 100%);
    }

    :host ::ng-deep .bioma-mata-atlantica .bioma-overlay {
      background: linear-gradient(to top, rgba(5, 150, 105, 0.9) 0%, transparent 100%);
    }

    :host ::ng-deep .bioma-caatinga .bioma-overlay {
      background: linear-gradient(to top, rgba(161, 98, 7, 0.9) 0%, transparent 100%);
    }

    :host ::ng-deep .bioma-pantanal .bioma-overlay {
      background: linear-gradient(to top, rgba(14, 116, 144, 0.9) 0%, transparent 100%);
    }

    :host ::ng-deep .bioma-pampa .bioma-overlay {
      background: linear-gradient(to top, rgba(101, 163, 13, 0.9) 0%, transparent 100%);
    }

    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @media (max-width: 768px) {
      .biomas-section {
        padding: 3rem 1rem;
      }

      .section-header {
        margin-bottom: 2rem;
      }

      .section-title {
        font-size: 2rem;
      }

      .section-description {
        font-size: 1rem;
      }

      .biomas-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }
  `]
})
export class BiomasGridComponent implements OnInit {
  private readonly biomaService = inject(BiomaService);

  biomas: BiomaDisplay[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadBiomas();
  }

  private loadBiomas(): void {
    this.biomaService.listBiomas().subscribe({
      next: (data: BiomaSchema[]) => {
        this.biomas = data as BiomaDisplay[];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar biomas:', err);
        this.loading = false;
      }
    });
  }

  getTemasCount(bioma: BiomaDisplay): number {
    return bioma.temas?.length || 0;
  }

  getBiomaDescription(bioma: BiomaDisplay): string {
    // Prioriza a descrição da API, senão usa a descrição padrão baseada no slug
    if (bioma.descricao && bioma.descricao.trim().length > 0) {
      return bioma.descricao;
    }

    return BIOMA_DESCRIPTIONS[bioma.slug] || 'Explore a rica biodiversidade e características únicas deste importante bioma brasileiro.';
  }

  getBiomaImage(bioma: BiomaDisplay): string {
    // Prioriza a imagem da API, senão usa a imagem local baseada no slug
    if (bioma.imagem && bioma.imagem.trim().length > 0) {
      return bioma.imagem;
    }

    return BIOMA_IMAGES[bioma.slug] || `${prefix}layout/images/biomas/placeholder.webp`;
  }

  getBiomaLink(bioma: BiomaDisplay): string[] {
    // Se o bioma tem temas, navega para o primeiro tema
    if (bioma.temas && bioma.temas.length > 0) {
      const primeiroTema = bioma.temas[0];
      return ['/app/bioma', bioma.slug, 'tema', primeiroTema.slug];
    }

    // Se não tem temas, vai para o dashboard
    return ['/app/biomas'];
  }
}
