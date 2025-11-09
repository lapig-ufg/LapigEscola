/**
 * Home Component
 * Dashboard moderna com estatísticas e visão geral dos biomas
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from '@/environments/environment';
import { BiomaService } from '@/services';
import { BiomaSchema } from '@/models';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { AvatarModule } from 'primeng/avatar';

interface BiomaDisplay extends BiomaSchema {
  descricao?: string;
  imagem?: string;
}

interface DashboardStats {
  totalBiomas: number;
  totalTemas: number;
  totalConteudos: number;
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
const BIOMA_IMAGES: Record<string, string> = {
  'amazonia': '/layout/images/biomas/amazonia.webp',
  'cerrado': '/layout/images/biomas/cerrado.webp',
  'mata-atlantica': '/layout/images/biomas/mapa-atlantica.webp',
  'caatinga': '/layout/images/biomas/caatinga.webp',
  'pampa': '/layout/images/biomas/pampa.webp',
  'pantanal': '/layout/images/biomas/pantanal.webp'
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TagModule,
    SkeletonModule,
    AvatarModule
  ],
  template: `
    <div class="dashboard-page">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="dashboard-title">
              <i class="pi pi-globe"></i>
              Biomas Brasileiros
            </h1>
            <p class="dashboard-subtitle">
              Explore a rica biodiversidade do Brasil através dos nossos biomas
            </p>
          </div>
          <div class="header-actions">
            <p-button
              label="Voltar à Home"
              icon="pi pi-home"
              [routerLink]="['/']"
              styleClass="dashboard-btn-primary"
            />
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card stat-card-primary">
          <div class="stat-icon">
            <i class="pi pi-map"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Biomas</p>
            <h3 class="stat-value">{{ loading ? '...' : stats.totalBiomas }}</h3>
            <p class="stat-description">Ecossistemas únicos</p>
          </div>
        </div>

        <div class="stat-card stat-card-success">
          <div class="stat-icon">
            <i class="pi pi-book"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Temas</p>
            <h3 class="stat-value">{{ loading ? '...' : stats.totalTemas }}+</h3>
            <p class="stat-description">Conteúdos educacionais</p>
          </div>
        </div>

        <div class="stat-card stat-card-info">
          <div class="stat-icon">
            <i class="pi pi-images"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Recursos</p>
            <h3 class="stat-value">{{ loading ? '...' : stats.totalConteudos }}+</h3>
            <p class="stat-description">Materiais disponíveis</p>
          </div>
        </div>

        <div class="stat-card stat-card-warning">
          <div class="stat-icon">
            <i class="pi pi-users"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Acesso</p>
            <h3 class="stat-value">100%</h3>
            <p class="stat-description">Gratuito para todos</p>
          </div>
        </div>
      </div>

      <!-- Biomas Grid -->
      <div class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="pi pi-th-large"></i>
            Explore os Biomas
          </h2>
          <p class="section-subtitle">
            Clique em um bioma para descobrir sua biodiversidade
          </p>
        </div>

        <!-- Loading State -->
        @if (loading) {
          <div class="biomas-grid">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="bioma-card-skeleton">
                <p-card>
                  <ng-template pTemplate="header">
                    <p-skeleton width="100%" height="200px" />
                  </ng-template>
                  <p-skeleton width="60%" class="mb-2" />
                  <p-skeleton width="100%" height="60px" class="mb-3" />
                  <p-skeleton width="100%" height="2rem" />
                </p-card>
              </div>
            }
          </div>
        }

        <!-- Biomas Grid -->
        @if (!loading && biomas.length > 0) {
          <div class="biomas-grid">
            @for (bioma of biomas; track bioma.slug) {
              <div class="bioma-card">
                <p-card [class]="'h-full bioma-' + bioma.slug">
                  <ng-template pTemplate="header">
                    <div class="bioma-image-container">
                      <img
                        [src]="getBiomaImage(bioma)"
                        [alt]="bioma.nome"
                        class="bioma-image"
                      />
                      <div class="bioma-overlay">
                        <h3 class="bioma-name">{{ bioma.nome }}</h3>
                        @if (getTemasCount(bioma) > 0) {
                          <p-tag
                            [value]="getTemasCount(bioma) + ' temas'"
                            [rounded]="true"
                            severity="success"
                          />
                        }
                      </div>
                    </div>
                  </ng-template>

                  <div class="bioma-body">
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
                        class="w-full bioma-btn"
                        severity="success"
                      />
                    </div>
                  </ng-template>
                </p-card>
              </div>
            }
          </div>
        }

        <!-- Empty State -->
        @if (!loading && biomas.length === 0) {
          <div class="empty-state">
            <i class="pi pi-inbox empty-icon"></i>
            <h3 class="empty-title">Nenhum bioma disponível</h3>
            <p class="empty-description">
              Os biomas serão carregados em breve. Tente novamente mais tarde.
            </p>
          </div>
        }
      </div>

      <!-- Quick Links -->
      <div class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="pi pi-bookmark"></i>
            Recursos Educacionais
          </h2>
        </div>

        <div class="quick-links-grid">
          <div class="quick-link-card">
            <div class="quick-link-icon bg-blue-100 text-blue-600">
              <i class="pi pi-book"></i>
            </div>
            <h4 class="quick-link-title">Materiais Pedagógicos</h4>
            <p class="quick-link-description">
              PDFs, apresentações e guias para educadores
            </p>
          </div>

          <div class="quick-link-card">
            <div class="quick-link-icon bg-purple-100 text-purple-600">
              <i class="pi pi-images"></i>
            </div>
            <h4 class="quick-link-title">Galeria de Imagens</h4>
            <p class="quick-link-description">
              Fotos de alta qualidade da fauna e flora
            </p>
          </div>

          <div class="quick-link-card">
            <div class="quick-link-icon bg-orange-100 text-orange-600">
              <i class="pi pi-video"></i>
            </div>
            <h4 class="quick-link-title">Vídeos Educativos</h4>
            <p class="quick-link-description">
              Documentários e conteúdo audiovisual
            </p>
          </div>

          <div class="quick-link-card">
            <div class="quick-link-icon bg-green-100 text-green-600">
              <i class="pi pi-lightbulb"></i>
            </div>
            <h4 class="quick-link-title">Curiosidades</h4>
            <p class="quick-link-description">
              Fatos interessantes sobre cada bioma
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Header */
    .dashboard-header {
      margin-bottom: 2rem;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .header-text {
      flex: 1;
      min-width: 300px;
    }

    .dashboard-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .dashboard-title i {
      color: #10b981;
      font-size: 2.25rem;
    }

    .dashboard-subtitle {
      font-size: 1.125rem;
      color: var(--text-color-secondary);
      margin: 0;
      line-height: 1.6;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    :host ::ng-deep .dashboard-btn-primary {
      background: linear-gradient(135deg, #059669, #10b981);
      border: none;
      font-weight: 600;
    }

    :host ::ng-deep .dashboard-btn-primary:hover {
      background: linear-gradient(135deg, #047857, #059669);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      border-left: 4px solid transparent;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .stat-card-primary {
      border-left-color: #10b981;
    }

    .stat-card-success {
      border-left-color: #059669;
    }

    .stat-card-info {
      border-left-color: #3b82f6;
    }

    .stat-card-warning {
      border-left-color: #f59e0b;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      flex-shrink: 0;
    }

    .stat-card-primary .stat-icon {
      background: linear-gradient(135deg, #d1fae5, #a7f3d0);
      color: #065f46;
    }

    .stat-card-success .stat-icon {
      background: linear-gradient(135deg, #a7f3d0, #6ee7b7);
      color: #047857;
    }

    .stat-card-info .stat-icon {
      background: linear-gradient(135deg, #dbeafe, #bfdbfe);
      color: #1e40af;
    }

    .stat-card-warning .stat-icon {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      color: #92400e;
    }

    .stat-content {
      flex: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-color-secondary);
      margin: 0 0 0.25rem 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.25rem 0;
      color: var(--text-color);
      line-height: 1;
    }

    .stat-description {
      font-size: 0.875rem;
      color: var(--text-color-secondary);
      margin: 0;
    }

    /* Section */
    .dashboard-section {
      margin-bottom: 3rem;
    }

    .section-header {
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .section-title i {
      color: #10b981;
      font-size: 1.5rem;
    }

    .section-subtitle {
      font-size: 1rem;
      color: var(--text-color-secondary);
      margin: 0;
    }

    /* Biomas Grid */
    .biomas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .bioma-card {
      height: 100%;
    }

    :host ::ng-deep .bioma-card .p-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    :host ::ng-deep .bioma-card .p-card-body {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    :host ::ng-deep .bioma-card .p-card-content {
      flex: 1;
    }

    .bioma-image-container {
      position: relative;
      height: 220px;
      overflow: hidden;
      background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    }

    .bioma-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .bioma-card:hover .bioma-image {
      transform: scale(1.05);
    }

    .bioma-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1.5rem;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .bioma-name {
      color: white;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .bioma-body {
      margin-bottom: 1rem;
    }

    .bioma-description {
      color: var(--text-color-secondary);
      line-height: 1.6;
      margin: 0;
    }

    .bioma-footer {
      display: flex;
      gap: 0.5rem;
    }

    :host ::ng-deep .bioma-btn {
      font-weight: 600;
    }

    /* Quick Links */
    .quick-links-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .quick-link-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid var(--surface-border);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .quick-link-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      border-color: #10b981;
    }

    .quick-link-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .quick-link-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 0.5rem 0;
    }

    .quick-link-description {
      font-size: 0.875rem;
      color: var(--text-color-secondary);
      margin: 0;
      line-height: 1.5;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-icon {
      font-size: 4rem;
      color: var(--text-color-secondary);
      opacity: 0.5;
      margin-bottom: 1rem;
    }

    .empty-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 0.5rem 0;
    }

    .empty-description {
      font-size: 1rem;
      color: var(--text-color-secondary);
      margin: 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .dashboard-page {
        padding: 1rem;
      }

      .dashboard-title {
        font-size: 2rem;
      }

      .header-content {
        flex-direction: column;
      }

      .header-actions {
        width: 100%;
      }

      .header-actions ::ng-deep .p-button {
        width: 100%;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .biomas-grid {
        grid-template-columns: 1fr;
      }

      .quick-links-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly biomaService = inject(BiomaService);

  biomas: BiomaDisplay[] = [];
  loading = true;
  stats: DashboardStats = {
    totalBiomas: 0,
    totalTemas: 0,
    totalConteudos: 0
  };

  ngOnInit(): void {
    this.updateMetaTags();
    this.loadBiomas();
  }

  private loadBiomas(): void {
    this.loading = true;
    this.biomaService.listBiomas().subscribe({
      next: (data: BiomaSchema[]) => {
        this.biomas = data as BiomaDisplay[];
        this.calculateStats();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar biomas:', err);
        this.loading = false;
      }
    });
  }

  private calculateStats(): void {
    this.stats.totalBiomas = this.biomas.length;
    this.stats.totalTemas = this.biomas.reduce(
      (acc: number, bioma: BiomaDisplay) => acc + this.getTemasCount(bioma),
      0
    );
    this.stats.totalConteudos = this.stats.totalTemas * 5; // Estimativa
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

    return BIOMA_IMAGES[bioma.slug] || '/layout/images/biomas/placeholder.webp';
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

  private updateMetaTags(): void {
    const title = `Dashboard - ${environment.appTitle}`;
    this.titleService.setTitle(title);

    this.metaService.updateTag({
      name: 'description',
      content: 'Dashboard educacional com visão geral dos biomas brasileiros e recursos pedagógicos.'
    });

    this.metaService.updateTag({
      property: 'og:title',
      content: title
    });

    this.metaService.updateTag({
      property: 'og:description',
      content: 'Plataforma educacional sobre biodiversidade e biomas brasileiros.'
    });
  }
}
