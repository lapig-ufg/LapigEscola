// src/app/components/dynamic-map/dynamic-map.component.ts
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from '@/services/map.service';
import { DynamicMapService, MapData } from '@/services/dynamic-map.service';

@Component({
  selector: 'app-dynamic-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dynamic-map-wrapper">
      <!-- Header -->
      <div class="map-header" *ngIf="showHeader && mapData">
        <h3 class="map-title">{{ mapData.titulo }}</h3>
        <p class="map-description" *ngIf="mapData.descricao">
          {{ mapData.descricao }}
        </p>
        <div class="map-layers-info" *ngIf="mapData.layers_data.layers.length > 0">
          <span class="layers-count">
            <i class="pi pi-layers"></i>
            {{ mapData.layers_data.layers.length }}
            {{ mapData.layers_data.layers.length === 1 ? 'camada' : 'camadas' }}
          </span>
        </div>
      </div>

      <!-- Map Container -->
      <div class="map-body">
        <div #mapContainer class="map-container" *ngIf="!loading && !error"></div>

        <!-- Loading State -->
        <div *ngIf="loading" class="map-loading">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          <p class="mt-2">Carregando mapa...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="map-error">
          <i class="pi pi-exclamation-triangle text-4xl text-orange-500"></i>
          <p class="mt-2 text-600">{{ error }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dynamic-map-wrapper {
      margin: 30px 0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      background: white;
    }

    .map-header {
      background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
      color: white;
      padding: 20px;
    }

    .map-title {
      margin: 0 0 8px 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .map-description {
      margin: 0 0 8px 0;
      font-size: 0.95rem;
      opacity: 0.95;
      line-height: 1.5;
    }

    .map-layers-info {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .layers-count {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .map-body {
      position: relative;
      min-height: 400px;
    }

    .map-container {
      width: 100%;
      height: 500px;
      background: var(--surface-100);
    }

    .map-loading,
    .map-error {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400px;
      text-align: center;
      padding: 20px;
    }

    .map-loading {
      color: var(--primary-color);
    }

    .map-error {
      color: var(--text-color-secondary);
    }

    @media (max-width: 768px) {
      .dynamic-map-wrapper {
        margin: 20px 0;
        border-radius: 8px;
      }

      .map-header {
        padding: 15px;
      }

      .map-title {
        font-size: 1.25rem;
      }

      .map-container {
        height: 400px;
      }

      .map-body {
        min-height: 350px;
      }

      .map-loading,
      .map-error {
        height: 350px;
      }
    }
  `]
})
export class DynamicMapComponent implements OnInit, OnDestroy {
  private readonly dynamicMapService = inject(DynamicMapService);
  private readonly mapService = inject(MapService);

  @ViewChild('mapContainer') mapContainer?: ElementRef;

  @Input() mapSlug?: string;
  @Input() mapId?: number;
  @Input() showHeader = true;
  @Input() height?: string;

  mapData?: MapData;
  loading = false;
  error?: string;

  ngOnInit(): void {
    this.loadMapData();
  }

  ngOnDestroy(): void {
    this.mapService.destroyMap();
  }

  /**
   * Carrega dados do mapa da API Django Ninja
   */
  private loadMapData(): void {
    if (!this.mapSlug && !this.mapId) {
      this.error = 'ID ou Slug do mapa não fornecido';
      return;
    }

    this.loading = true;
    this.error = undefined;

    const request$ = this.mapSlug
      ? this.dynamicMapService.getBySlug(this.mapSlug)
      : this.dynamicMapService.getById(this.mapId!);

    request$.subscribe({
      next: (data) => {
        this.mapData = data;
        this.loading = false;

        // Inicializa mapa após view estar pronta
        setTimeout(() => this.initializeMap(), 100);
      },
      error: (err) => {
        this.error = err.error?.detail || 'Erro ao carregar dados do mapa';
        this.loading = false;
        console.error('Erro ao carregar mapa:', err);
      }
    });
  }

  /**
   * Inicializa mapa usando o MapService existente
   */
  private initializeMap(): void {
    if (!this.mapContainer || !this.mapData) {
      return;
    }

    // Converte dados para formato legado
    const legacyData = this.dynamicMapService.convertToLegacyFormat(this.mapData);

    // Centro inicial
    const center: [number, number] = legacyData.center ||
                                      [this.mapData.center_lon || -47.9292,
                                       this.mapData.center_lat || -15.7801];

    const zoom = legacyData.zoom || this.mapData.initial_zoom || 4;

    // Inicializa mapa usando o MapService existente
    this.mapService.initializeMap(this.mapContainer, center, zoom);

    // Adiciona camadas usando o MapService existente
    if (legacyData.layers.length > 0) {
      this.mapService.updateLayers(legacyData.layers);
    }

    // Ajusta view se houver focusFeatureUrl
    if (legacyData.focusFeatureUrl) {
      this.mapService.fitToFeatureUrl(legacyData.focusFeatureUrl);
    }

    // Aplica altura customizada se fornecida
    if (this.height && this.mapContainer) {
      this.mapContainer.nativeElement.style.height = this.height;
    }
  }
}
