// src/app/components/dynamic-map/dynamic-map.component.ts
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from '@/services/map.service';
import { DynamicMapService, MapData } from '@/services/dynamic-map.service';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
  selector: 'app-dynamic-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dynamic-map-wrapper" [class.dark-theme]="isDarkTheme">
      <!-- Header -->
      <div class="map-header" [ngClass]="'theme-' + headerTheme" *ngIf="showHeader && mapData">
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
      box-shadow: var(--card-shadow, 0 4px 20px rgba(0, 0, 0, 0.1));
      background: var(--surface-card, white);
      border: var(--sidebar-border, 1px solid var(--surface-border));
      transition: all 0.3s ease;
    }

    .map-header {
      padding: 20px;
      color: white;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    /* Tema Primary (padrão) */
    .map-header.theme-primary {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-600) 100%);
    }

    /* Tema Secondary */
    .map-header.theme-secondary {
      background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
    }

    /* Tema Success */
    .map-header.theme-success {
      background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
    }

    /* Tema Warning */
    .map-header.theme-warning {
      background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
      color: #212529;
    }

    /* Tema Danger */
    .map-header.theme-danger {
      background: linear-gradient(135deg, #dc3545 0%, #bd2130 100%);
    }

    /* Tema Info */
    .map-header.theme-info {
      background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
    }

    .map-title {
      margin: 0 0 8px 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: inherit;
    }

    .map-description {
      margin: 0 0 8px 0;
      font-size: 0.95rem;
      opacity: 0.95;
      line-height: 1.5;
      color: inherit;
    }

    .map-layers-info {
      font-size: 0.9rem;
      opacity: 0.9;
      color: inherit;
    }

    /* Adaptações específicas para tema warning */
    .map-header.theme-warning .map-title,
    .map-header.theme-warning .map-description,
    .map-header.theme-warning .map-layers-info {
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      font-weight: 600;
    }

    .layers-count {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .map-body {
      position: relative;
      min-height: 400px;
      background: var(--surface-ground, var(--surface-100));
    }

    .map-container {
      width: 100%;
      height: 500px;
      background: var(--surface-ground, var(--surface-100));
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
      background: var(--surface-ground, var(--surface-100));
    }

    .map-loading {
      color: var(--primary-color);
    }

    .map-error {
      color: var(--text-color-secondary);
    }

    /* Dark Theme Adaptations */
    .dynamic-map-wrapper.dark-theme {
      box-shadow: var(--sidebar-shadow, none);
      border: var(--sidebar-border, 1px solid var(--surface-border));
    }

    /* Dark Theme Headers */
    .dynamic-map-wrapper.dark-theme .map-header.theme-primary {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-700) 100%);
    }

    .dynamic-map-wrapper.dark-theme .map-header.theme-secondary {
      background: linear-gradient(135deg, #495057 0%, #343a40 100%);
    }

    .dynamic-map-wrapper.dark-theme .map-header.theme-success {
      background: linear-gradient(135deg, #1e7e34 0%, #155724 100%);
    }

    .dynamic-map-wrapper.dark-theme .map-header.theme-warning {
      background: linear-gradient(135deg, #e0a800 0%, #d39e00 100%);
    }

    .dynamic-map-wrapper.dark-theme .map-header.theme-danger {
      background: linear-gradient(135deg, #bd2130 0%, #a71e2a 100%);
    }

    .dynamic-map-wrapper.dark-theme .map-header.theme-info {
      background: linear-gradient(135deg, #138496 0%, #117a8b 100%);
    }

    .dynamic-map-wrapper.dark-theme .map-body,
    .dynamic-map-wrapper.dark-theme .map-container,
    .dynamic-map-wrapper.dark-theme .map-loading,
    .dynamic-map-wrapper.dark-theme .map-error {
      background: var(--surface-ground);
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
  private readonly layoutService = inject(LayoutService);

  @ViewChild('mapContainer') mapContainer?: ElementRef;

  @Input() mapSlug?: string;
  @Input() mapId?: number;
  @Input() showHeader = true;
  @Input() height?: string;
  @Input() headerTheme: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' = 'primary';

  mapData?: MapData;
  loading = false;
  error?: string;

  // Computed property para detectar dark mode
  get isDarkTheme(): boolean {
    return this.layoutService.isDarkTheme() || false;
  }

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
