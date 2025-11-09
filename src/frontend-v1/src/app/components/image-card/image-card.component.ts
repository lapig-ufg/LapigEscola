/**
 * Image Card Component
 * Card com imagem clicável e modal de zoom
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-image-card',
  standalone: true,
  imports: [CommonModule, CardModule, DialogModule],
  template: `
    <p-card
      [style]="{ 'background-color': bgColor }"
      styleClass="image-card"
    >
      <ng-template pTemplate="header">
        <div class="image-container" (click)="showDialog = true">
          <img
            [src]="image || '/assets/images/placeholder.jpg'"
            [alt]="title"
            class="card-image"
            (error)="onImageError($event)"
          />
          <div class="image-overlay">
            <i class="pi pi-search-plus overlay-icon"></i>
          </div>
        </div>
      </ng-template>

      <div class="card-content">
        <h3 class="card-title">{{ title }}</h3>
        <p *ngIf="subtitle" class="card-subtitle text-600">{{ subtitle }}</p>
      </div>
    </p-card>

    <p-dialog
      [(visible)]="showDialog"
      [header]="title"
      [modal]="true"
      [style]="{ width: '80vw', 'max-width': '1200px' }"
      [dismissableMask]="true"
      [draggable]="false"
      [resizable]="false"
    >
      <img
        [src]="image"
        [alt]="title"
        class="modal-image"
      />
      <p *ngIf="subtitle" class="mt-3 text-600">{{ subtitle }}</p>
    </p-dialog>
  `,
  styles: [`
    :host {
      display: block;
    }

    .image-card {
      transition: transform 0.2s, box-shadow 0.2s;
      height: 100%;
    }

    .image-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .image-container {
      position: relative;
      cursor: pointer;
      overflow: hidden;
      border-radius: 8px 8px 0 0;
      aspect-ratio: 16 / 9;
    }

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .image-container:hover .card-image {
      transform: scale(1.05);
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .image-container:hover .image-overlay {
      opacity: 1;
    }

    .overlay-icon {
      color: white;
      font-size: 3rem;
    }

    .card-content {
      padding: 1rem 0;
    }

    .card-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-color);
    }

    .card-subtitle {
      margin: 0;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .modal-image {
      width: 100%;
      height: auto;
      border-radius: 8px;
    }
  `]
})
export class ImageCardComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() image?: string;
  @Input() bgColor: string = 'var(--surface-card)';

  showDialog = false;

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/placeholder.jpg';
  }
}
