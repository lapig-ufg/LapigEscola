/**
 * Static Page Component
 * Página estática genérica carregada por slug
 * Rota: /page/:slug
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PaginaService } from '@/services';
import { PaginaEstatica } from '@/models';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-static-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="static-page-container">
      <!-- Loading State -->
      <div *ngIf="loading" class="flex align-items-center justify-content-center p-8">
        <i class="pi pi-spin pi-spinner" style="font-size: 3rem"></i>
      </div>

      <!-- Error State -->
      <div *ngIf="error && !loading" class="error-message">
        <i class="pi pi-exclamation-triangle text-6xl text-orange-500"></i>
        <h2 class="mt-4">Página não encontrada</h2>
        <p class="text-600">{{ error }}</p>
      </div>

      <!-- Content -->
      <div *ngIf="pageData && !loading" class="page-content">
        <div class="page-header">
          <h1 class="page-title">{{ pageData.titulo }}</h1>
          <p *ngIf="pageData.resumo" class="page-subtitle text-600">
            {{ pageData.resumo }}
          </p>
        </div>

        <div *ngIf="pageData.imagem" class="page-cover-image">
          <img [src]="pageData.imagem" [alt]="pageData.titulo" />
        </div>

        <div class="content-wrapper" [innerHTML]="sanitizedContent"></div>
      </div>
    </div>
  `,
  styles: [`
    .static-page-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--primary-color);
      margin: 0 0 1rem 0;
    }

    .page-subtitle {
      font-size: 1.25rem;
      line-height: 1.6;
    }

    .page-cover-image {
      margin: 2rem 0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .page-cover-image img {
      width: 100%;
      height: auto;
      display: block;
    }

    .content-wrapper {
      line-height: 1.8;
      font-size: 1.0625rem;
      color: var(--text-color);
    }

    .content-wrapper :deep(h2) {
      margin-top: 2rem;
      margin-bottom: 1rem;
      font-size: 1.75rem;
      font-weight: 600;
    }

    .content-wrapper :deep(h3) {
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .content-wrapper :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 1.5rem 0;
    }

    .error-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    @media (max-width: 768px) {
      .static-page-container {
        padding: 1rem;
      }

      .page-title {
        font-size: 2rem;
      }
    }
  `]
})
export class StaticPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly paginaService = inject(PaginaService);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly sanitizer = inject(DomSanitizer);

  pageData?: PaginaEstatica;
  sanitizedContent?: SafeHtml;
  loading = true;
  error?: string;
  slug?: string;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.slug = params['slug'];
      if (this.slug) {
        this.loadPage(this.slug);
      }
    });
  }

  private loadPage(slug: string): void {
    this.loading = true;
    this.error = undefined;

    this.paginaService.getPage(slug).subscribe({
      next: (data) => {
        this.pageData = data;
        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(data.conteudo);
        this.updateMetaTags();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || `Não foi possível carregar a página "${slug}"`;
        this.loading = false;
        console.error('Erro ao carregar página:', err);
      }
    });
  }

  private updateMetaTags(): void {
    if (!this.pageData) return;

    const title = `${this.pageData.titulo} | ${environment.appTitle}`;
    this.titleService.setTitle(title);

    this.metaService.updateTag({
      name: 'description',
      content: this.pageData.resumo || environment.appSubtitle
    });

    this.metaService.updateTag({
      property: 'og:title',
      content: this.pageData.titulo
    });

    if (this.pageData.imagem) {
      this.metaService.updateTag({
        property: 'og:image',
        content: this.pageData.imagem
      });
    }
  }
}
