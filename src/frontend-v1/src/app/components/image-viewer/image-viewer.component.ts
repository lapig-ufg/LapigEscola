/**
 * Image Viewer Component
 * Visualizador de imagens com lightbox e zoom
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [CommonModule, ButtonModule, ImageModule],
  template: `
    <div class="image-viewer-container">
      <div class="image-viewer-header">
        <h3 class="image-viewer-title">
          <i class="pi pi-image text-primary mr-2"></i>
          {{ title }}
        </h3>
        <div class="image-viewer-actions">
          <button
            pButton
            type="button"
            icon="pi pi-download"
            label="Baixar Imagem"
            class="p-button-outlined p-button-sm"
            (click)="downloadImage()"
          ></button>
          <a
            [href]="imageUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="p-button p-button-outlined p-button-sm"
          >
            <i class="pi pi-external-link mr-2"></i>
            Abrir Original
          </a>
        </div>
      </div>

      <div class="image-viewer-content">
        <p-image
          [src]="imageUrl"
          [alt]="title"
          [preview]="true"
          width="100%"
          [imageStyle]="{'border-radius': '8px', 'cursor': 'pointer'}"
        >
        </p-image>
      </div>

      <div *ngIf="description" class="image-viewer-description">
        <p>{{ description }}</p>
      </div>

      <div class="image-viewer-footer">
        <span class="text-sm text-500">
          <i class="pi pi-info-circle mr-1"></i>
          Clique na imagem para ampliar em tela cheia
        </span>
      </div>
    </div>
  `,
  styles: [`
    .image-viewer-container {
      background: var(--surface-card);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      margin: 2rem 0;
    }

    .image-viewer-header {
      padding: 1.5rem;
      background: var(--surface-ground);
      border-bottom: 1px solid var(--surface-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .image-viewer-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-color);
      display: flex;
      align-items: center;
    }

    .image-viewer-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .image-viewer-content {
      padding: 2rem;
      background: var(--surface-ground);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .image-viewer-content :deep(img) {
      max-height: 600px;
      width: auto;
      max-width: 100%;
      object-fit: contain;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .image-viewer-description {
      padding: 1.5rem;
      background: var(--surface-50);
      border-top: 1px solid var(--surface-border);
      color: var(--text-color-secondary);
      line-height: 1.6;
    }

    .image-viewer-description p {
      margin: 0;
    }

    .image-viewer-footer {
      padding: 1rem 1.5rem;
      background: var(--surface-ground);
      border-top: 1px solid var(--surface-border);
      text-align: center;
    }

    /* Dark mode adjustments */
    :host-context(.app-dark) .image-viewer-container {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
    }

    :host-context(.app-dark) .image-viewer-content :deep(img) {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }

    @media (max-width: 768px) {
      .image-viewer-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .image-viewer-actions {
        width: 100%;
      }

      .image-viewer-actions > * {
        flex: 1;
        min-width: 140px;
      }

      .image-viewer-content {
        padding: 1.5rem;
        min-height: 300px;
      }

      .image-viewer-content :deep(img) {
        max-height: 400px;
      }
    }
  `]
})
export class ImageViewerComponent {
  @Input() imageUrl!: string;
  @Input() title: string = 'Imagem';
  @Input() description?: string;

  downloadImage(): void {
    fetch(this.imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.getFileName();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Erro ao baixar imagem:', error);
        // Fallback: abre em nova aba
        window.open(this.imageUrl, '_blank');
      });
  }

  private getFileName(): string {
    const urlParts = this.imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    return fileName || this.title + '.jpg';
  }
}