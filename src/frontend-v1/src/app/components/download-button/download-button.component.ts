/**
 * Download Button Component
 * Botão inteligente que detecta tipo de arquivo e abre ou baixa conforme apropriado
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-download-button',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="download-button-container">
      <p-button
        [label]="buttonLabel"
        [icon]="buttonIcon"
        [severity]="isViewable ? 'secondary' : 'primary'"
        (onClick)="handleClick()"
        styleClass="w-full"
      />
      <small class="file-info text-600 mt-2 block text-center">
        {{ fileExtension.toUpperCase() }} {{ isViewable ? '• Abrir' : '• Baixar' }}
      </small>
    </div>
  `,
  styles: [`
    .download-button-container {
      margin: 1.5rem 0;
      padding: 1rem;
      background: var(--surface-50);
      border-radius: 8px;
    }

    .file-info {
      font-size: 0.875rem;
    }
  `]
})
export class DownloadButtonComponent {
  @Input() title: string = 'Arquivo';
  @Input() file?: string;

  // Extensões que podem ser visualizadas no navegador
  private readonly viewableExtensions = [
    'pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg',
    'txt', 'html', 'mp4', 'webm', 'ogg', 'mp3', 'wav'
  ];

  get fileExtension(): string {
    if (!this.file) return '';
    const parts = this.file.split('.');
    return parts[parts.length - 1].toLowerCase();
  }

  get isViewable(): boolean {
    return this.viewableExtensions.includes(this.fileExtension);
  }

  get buttonLabel(): string {
    if (this.isViewable) {
      return `Visualizar ${this.title}`;
    }
    return `Baixar ${this.title}`;
  }

  get buttonIcon(): string {
    if (this.isViewable) {
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(this.fileExtension)) {
        return 'pi pi-image';
      }
      if (this.fileExtension === 'pdf') {
        return 'pi pi-file-pdf';
      }
      if (['mp4', 'webm', 'ogg'].includes(this.fileExtension)) {
        return 'pi pi-video';
      }
      if (['mp3', 'wav'].includes(this.fileExtension)) {
        return 'pi pi-volume-up';
      }
      return 'pi pi-eye';
    }
    return 'pi pi-download';
  }

  handleClick(): void {
    if (!this.file) return;

    if (this.isViewable) {
      // Abre em nova aba
      window.open(this.file, '_blank');
    } else {
      // Força download
      const link = document.createElement('a');
      link.href = this.file;
      link.download = this.title + '.' + this.fileExtension;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
