/**
 * Info Card Component
 * Card genérico com ação customizável (navegação ou download)
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  template: `
    <p-card styleClass="info-card h-full">
      <ng-template pTemplate="header" *ngIf="image">
        <div class="card-header-image">
          <img
            [src]="image"
            [alt]="title"
            (error)="onImageError($event)"
          />
        </div>
      </ng-template>

      <div class="card-body">
        <h3 class="card-title">{{ title }}</h3>
        <p *ngIf="subtitle" class="card-subtitle text-600">{{ subtitle }}</p>
      </div>

      <ng-template pTemplate="footer">
        <div class="card-footer flex gap-2">
          <p-button
            *ngIf="buttonLabel"
            [label]="buttonLabel"
            icon="pi pi-arrow-right"
            [outlined]="true"
            (onClick)="onButtonClick()"
            styleClass="flex-1"
          />

          <ng-content select="[slot='actions']"></ng-content>
        </div>
      </ng-template>
    </p-card>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .info-card {
      transition: transform 0.2s, box-shadow 0.2s;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .info-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .card-header-image {
      position: relative;
      overflow: hidden;
      border-radius: 8px 8px 0 0;
      aspect-ratio: 16 / 9;
      background: var(--surface-100);
    }

    .card-header-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .info-card:hover .card-header-image img {
      transform: scale(1.05);
    }

    .card-body {
      flex: 1;
    }

    .card-title {
      margin: 0 0 0.75rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-color);
      line-height: 1.4;
    }

    .card-subtitle {
      margin: 0;
      font-size: 0.9375rem;
      line-height: 1.6;
    }

    .card-footer {
      padding-top: 1rem;
      border-top: 1px solid var(--surface-border);
    }
  `]
})
export class InfoCardComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() image?: string;
  @Input() buttonLabel?: string;
  @Input() cardType?: string;  // 'curiosidade' | 'pedagogia'
  @Input() cardId?: number | string;

  @Output() buttonClick = new EventEmitter<{ type?: string; id?: number | string }>();

  onButtonClick(): void {
    this.buttonClick.emit({
      type: this.cardType,
      id: this.cardId
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/placeholder.jpg';
  }
}
