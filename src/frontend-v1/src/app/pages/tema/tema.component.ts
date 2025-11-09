/**
 * Tema Component
 * Página principal de tema de bioma com mapa OpenLayers
 * Rota: /bioma/:slug/tema/:temaSlug
 */

import { Component, OnInit, OnDestroy, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { ConteudoService, MapService } from '@/services';
import { Conteudo, ImagemGaleria, LayersSchema, SchemaCuriosidade, SchemaPedagogia } from '@/models';
import { environment } from '@/environments/environment';
import {
  BiomaContentComponent,
  ImageCardComponent,
  InfoCardComponent
} from '@/components';

@Component({
  selector: 'app-tema',
  standalone: true,
  imports: [
    CommonModule,
    BiomaContentComponent,
    ImageCardComponent,
    InfoCardComponent
  ],
  template: `
    <div class="tema-container">
      <!-- Loading State -->
      <div *ngIf="loading" class="flex align-items-center justify-content-center p-8">
        <i class="pi pi-spin pi-spinner" style="font-size: 3rem"></i>
      </div>

      <!-- Error State -->
      <div *ngIf="error && !loading" class="error-message">
        <i class="pi pi-exclamation-triangle text-6xl text-orange-500"></i>
        <h2 class="mt-4">Erro ao carregar tema</h2>
        <p class="text-600">{{ error }}</p>
      </div>

      <!-- Content -->
      <div *ngIf="!loading && !error" class="tema-content">
        <!-- Header -->
        <div class="tema-header">
          <h1 class="tema-title">{{ conteudo?.titulo }}</h1>
        </div>

        <!-- Map (se houver camadas) -->
        <div *ngIf="layersData && layersData.layers.length > 0" class="map-section">
          <div #mapContainer class="map-container"></div>
        </div>

        <!-- Bioma Content (Tabs) -->
        <app-bioma-content
          [texto]="conteudo?.texto"
          [imagensContent]="images && images.length > 0"
          [curiosidadesContent]="curiosidades && curiosidades.length > 0"
          [pedagogiaContent]="pedagogias && pedagogias.length > 0"
        >
          <!-- Slot: Imagens -->
          <div slot="imagens" *ngIf="images && images.length > 0">
            <div class="grid imagens-grid">
              <div *ngFor="let img of images" class="col-12 sm:col-6 lg:col-4 xl:col-3">
                <app-image-card
                  [title]="img.titulo"
                  [subtitle]="img.resumo"
                  [image]="img.imagem"
                />
              </div>
            </div>
          </div>

          <!-- Slot: Curiosidades -->
          <div slot="curiosidades" *ngIf="curiosidades && curiosidades.length > 0">
            <div class="grid curiosidades-grid">
              <div *ngFor="let cur of curiosidades" class="col-12 sm:col-6 lg:col-4 xl:col-3">
                <app-info-card
                  [title]="cur.titulo"
                  [subtitle]="cur.resumo"
                  [image]="cur.imagem"
                  [buttonLabel]="'Ler Mais'"
                  [cardType]="'curiosidade'"
                  [cardId]="cur.id"
                  (buttonClick)="navigateToDetail($event)"
                />
              </div>
            </div>
          </div>

          <!-- Slot: Recursos Pedagógicos -->
          <div slot="pedagogia" *ngIf="pedagogias && pedagogias.length > 0">
            <div class="grid pedagogia-grid">
              <div *ngFor="let ped of pedagogias" class="col-12 sm:col-6 lg:col-4 xl:col-3">
                <app-info-card
                  [title]="ped.titulo"
                  [subtitle]="ped.resumo"
                  [image]="ped.imagem"
                  [buttonLabel]="ped.file ? 'Baixar Recurso' : 'Ver Detalhes'"
                  [cardType]="'pedagogia'"
                  [cardId]="ped.id"
                  (buttonClick)="navigateToDetail($event)"
                />
              </div>
            </div>
          </div>
        </app-bioma-content>
      </div>
    </div>
  `,
  styles: [`
    .tema-container {
      padding: 2rem;
    }

    .tema-header {
      margin-bottom: 2rem;
    }

    .tema-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--primary-color);
      margin: 0;
    }

    .map-section {
      margin: 2rem 0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .map-container {
      width: 100%;
      height: 500px;
      background: var(--surface-100);
    }

    .error-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .imagens-grid,
    .curiosidades-grid,
    .pedagogia-grid {
      justify-content: flex-start;
    }

    /* Quando há 1 item, limita a largura máxima */
    .imagens-grid > div:only-child,
    .curiosidades-grid > div:only-child,
    .pedagogia-grid > div:only-child {
      max-width: 400px;
      margin: 0 auto;
    }

    /* Quando há 2 itens, centraliza */
    .imagens-grid > div:nth-child(2):last-child,
    .curiosidades-grid > div:nth-child(2):last-child,
    .pedagogia-grid > div:nth-child(2):last-child {
      margin-right: auto;
    }

    @media (max-width: 768px) {
      .tema-container {
        padding: 1rem;
      }

      .tema-title {
        font-size: 2rem;
      }

      .map-container {
        height: 400px;
      }

      /* No mobile, remove limitação de largura */
      .imagens-grid > div:only-child,
      .curiosidades-grid > div:only-child,
      .pedagogia-grid > div:only-child {
        max-width: 100%;
      }
    }
  `]
})
export class TemaComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly conteudoService = inject(ConteudoService);
  private readonly mapService = inject(MapService);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  @ViewChild('mapContainer') mapContainer?: ElementRef;

  biomaSlug?: string;
  temaSlug?: string;

  conteudo?: Conteudo;
  layersData?: LayersSchema;
  images?: ImagemGaleria[];
  curiosidades?: SchemaCuriosidade[];
  pedagogias?: SchemaPedagogia[];

  loading = true;
  error?: string;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.biomaSlug = params['slug'];
      this.temaSlug = params['temaSlug'];

      if (this.biomaSlug && this.temaSlug) {
        this.loadTemaData();
      }
    });
  }

  ngOnDestroy(): void {
    this.mapService.destroyMap();
  }

  /**
   * Carrega todos os dados do tema em paralelo
   */
  private loadTemaData(): void {
    if (!this.biomaSlug || !this.temaSlug) return;

    this.loading = true;
    this.error = undefined;

    forkJoin({
      conteudo: this.conteudoService.getConteudo(this.biomaSlug, this.temaSlug),
      layers: this.conteudoService.getLayers(this.biomaSlug, this.temaSlug),
      images: this.conteudoService.getImages(this.biomaSlug, this.temaSlug),
      curiosidades: this.conteudoService.getCuriosidades(this.biomaSlug, this.temaSlug),
      pedagogias: this.conteudoService.getPedagogias(this.biomaSlug, this.temaSlug)
    }).subscribe({
      next: (data) => {
        this.conteudo = data.conteudo;
        this.layersData = data.layers;
        this.images = data.images;
        this.curiosidades = data.curiosidades;
        this.pedagogias = data.pedagogias;

        this.updateMetaTags();
        this.loading = false;

        // Inicializa mapa após view estar pronta
        setTimeout(() => this.initializeMap(), 100);
      },
      error: (err) => {
        this.error = err.message || 'Não foi possível carregar os dados do tema';
        this.loading = false;
        console.error('Erro ao carregar tema:', err);
      }
    });
  }

  /**
   * Inicializa mapa OpenLayers
   */
  private initializeMap(): void {
    if (!this.mapContainer || !this.layersData || this.layersData.layers.length === 0) {
      return;
    }

    // Inicializa mapa
    this.mapService.initializeMap(this.mapContainer);

    // Adiciona camadas
    this.mapService.updateLayers(this.layersData.layers);

    // Ajusta view se houver focusFeatureUrl
    if (this.layersData.focusFeatureUrl) {
      this.mapService.fitToFeatureUrl(this.layersData.focusFeatureUrl);
    }
  }

  /**
   * Navega para página de detalhe
   */
  navigateToDetail(event: { type?: string; id?: number | string }): void {
    if (!event.type || !event.id || !this.biomaSlug || !this.temaSlug) return;

    // Navega para a rota de detalhe: /app/bioma/:slug/tema/:temaSlug/:type-:id
    this.router.navigate(['/app/bioma', this.biomaSlug, 'tema', this.temaSlug, `${event.type}-${event.id}`]);
  }

  /**
   * Atualiza meta tags
   */
  private updateMetaTags(): void {
    if (!this.conteudo) return;

    const title = `${this.conteudo.titulo} | ${environment.appTitle}`;
    this.titleService.setTitle(title);

    this.metaService.updateTag({
      name: 'description',
      content: this.conteudo.resumo || environment.appSubtitle
    });

    this.metaService.updateTag({
      property: 'og:title',
      content: this.conteudo.titulo
    });
  }
}
