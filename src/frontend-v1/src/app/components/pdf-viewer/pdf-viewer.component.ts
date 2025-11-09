/**
 * PDF Viewer Component
 * Visualizador de PDF inline com suporte a zoom e navegação
 */

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="pdf-viewer-container">
      <div class="pdf-viewer-header">
        <h3 class="pdf-viewer-title">
          <i class="pi pi-file-pdf text-red-500 mr-2"></i>
          {{ title }}
        </h3>
        <div class="pdf-viewer-actions">
          <button
            pButton
            type="button"
            icon="pi pi-download"
            label="Baixar PDF"
            class="p-button-outlined p-button-sm"
            (click)="downloadPdf()"
          ></button>
          <a
            [href]="fileUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="p-button p-button-outlined p-button-sm"
          >
            <i class="pi pi-external-link mr-2"></i>
            Abrir em Nova Aba
          </a>
        </div>
      </div>

      <div class="pdf-viewer-frame">
        <iframe
          [src]="safeUrl"
          type="application/pdf"
          width="100%"
          height="100%"
          frameborder="0"
        >
          <p>
            Seu navegador não suporta visualização de PDF inline.
            <a [href]="fileUrl" target="_blank">Clique aqui para baixar o PDF</a>
          </p>
        </iframe>
      </div>

      <div class="pdf-viewer-footer">
        <span class="text-sm text-500">
          <i class="pi pi-info-circle mr-1"></i>
          Visualizador de PDF - Use as ferramentas do navegador para zoom e navegação
        </span>
      </div>
    </div>
  `,
  styles: [`
    .pdf-viewer-container {
      background: var(--surface-card);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      margin: 2rem 0;
    }

    .pdf-viewer-header {
      padding: 1.5rem;
      background: var(--surface-ground);
      border-bottom: 1px solid var(--surface-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .pdf-viewer-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-color);
      display: flex;
      align-items: center;
    }

    .pdf-viewer-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .pdf-viewer-frame {
      width: 100%;
      height: 800px;
      background: var(--surface-100);
      position: relative;
    }

    .pdf-viewer-frame iframe {
      border: none;
    }

    .pdf-viewer-footer {
      padding: 1rem 1.5rem;
      background: var(--surface-ground);
      border-top: 1px solid var(--surface-border);
      text-align: center;
    }

    /* Dark mode adjustments */
    :host-context(.app-dark) .pdf-viewer-container {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 768px) {
      .pdf-viewer-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .pdf-viewer-actions {
        width: 100%;
      }

      .pdf-viewer-actions > * {
        flex: 1;
        min-width: 140px;
      }

      .pdf-viewer-frame {
        height: 600px;
      }
    }

    @media (max-width: 480px) {
      .pdf-viewer-frame {
        height: 500px;
      }
    }
  `]
})
export class PdfViewerComponent implements OnInit {
  @Input() fileUrl!: string;
  @Input() title: string = 'Documento PDF';

  safeUrl?: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (this.fileUrl) {
      // Adiciona #view=FitH para melhor visualização
      const urlWithParams = this.fileUrl.includes('?')
        ? `${this.fileUrl}&view=FitH`
        : `${this.fileUrl}#view=FitH`;

      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urlWithParams);
    }
  }

  downloadPdf(): void {
    const link = document.createElement('a');
    link.href = this.fileUrl;
    link.download = this.title + '.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}