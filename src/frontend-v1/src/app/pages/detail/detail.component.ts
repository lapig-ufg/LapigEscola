/**
 * Detail Component
 * Página de detalhe para Curiosidade ou Recurso Pedagógico
 * Rota: /bioma/:slug/tema/:temaSlug/:type-:id
 * Exemplos:
 *   - /bioma/cerrado/tema/vegetacao/curiosidade-123
 *   - /bioma/cerrado/tema/vegetacao/pedagogia-456
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ConteudoService } from '@/services';
import { Curiosidade, RecursoPedagogico } from '@/models';
import { environment } from '@/environments/environment';
import { DownloadButtonComponent } from '@/components';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, DownloadButtonComponent],
  template: `
    <div class="detail-container">
      <!-- Breadcrumb / Back Button -->
      <button
        *ngIf="!loading"
        class="back-button p-link flex align-items-center gap-2 mb-4"
        (click)="goBack()"
      >
        <i class="pi pi-arrow-left"></i>
        <span>Voltar</span>
      </button>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex align-items-center justify-content-center p-8">
        <i class="pi pi-spin pi-spinner" style="font-size: 3rem"></i>
      </div>

      <!-- Error State -->
      <div *ngIf="error && !loading" class="error-message">
        <i class="pi pi-exclamation-triangle text-6xl text-orange-500"></i>
        <h2 class="mt-4">Conteúdo não encontrado</h2>
        <p class="text-600">{{ error }}</p>
      </div>

      <!-- Content -->
      <div *ngIf="contentData && !loading" class="detail-content">
        <!-- Header -->
        <div class="detail-header">
          <div class="detail-type-badge" [class.curiosidade]="type === 'curiosidade'" [class.pedagogia]="type === 'pedagogia'">
            <i [class]="type === 'curiosidade' ? 'pi pi-star' : 'pi pi-book'"></i>
            <span>{{ type === 'curiosidade' ? 'Curiosidade' : 'Recurso Pedagógico' }}</span>
          </div>
          <h1 class="detail-title">{{ contentData.titulo }}</h1>
          <p *ngIf="contentData.resumo" class="detail-subtitle text-600">
            {{ contentData.resumo }}
          </p>
        </div>

        <!-- Cover Image -->
        <div *ngIf="contentData.imagem" class="detail-cover-image">
          <img [src]="contentData.imagem" [alt]="contentData.titulo" />
        </div>

        <!-- Download Button (só para pedagogia com arquivo) -->
        <app-download-button
          *ngIf="isPedagogia && getPedagogiaFile()"
          [title]="contentData.titulo"
          [file]="getPedagogiaFile()!"
        />

        <!-- External Link (só para pedagogia) -->
        <div *ngIf="isPedagogia && getPedagogiaLink()" class="external-link-card">
          <i class="pi pi-external-link text-primary text-2xl"></i>
          <div class="flex-1">
            <h3 class="m-0 mb-2">Link Externo</h3>
            <a [href]="getPedagogiaLink()" target="_blank" rel="noopener noreferrer" class="text-primary">
              {{ getPedagogiaLink() }}
              <i class="pi pi-arrow-up-right ml-1"></i>
            </a>
          </div>
        </div>

        <!-- Main Content (HTML from CKEditor) -->
        <div class="content-wrapper" [innerHTML]="sanitizedContent"></div>

        <!-- Tags (só para curiosidade) -->
        <div *ngIf="isCuriosidade && getCuriosidadeTags() && getCuriosidadeTags()!.length > 0" class="tags-section">
          <h3>Tags</h3>
          <div class="tags-list">
            <span *ngFor="let tag of getCuriosidadeTags()" class="tag">
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .back-button {
      color: var(--primary-color);
      font-weight: 500;
      transition: transform 0.2s;
    }

    .back-button:hover {
      transform: translateX(-4px);
    }

    .detail-header {
      margin-bottom: 2rem;
    }

    .detail-type-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .detail-type-badge.curiosidade {
      background: var(--orange-50);
      color: var(--orange-600);
    }

    .detail-type-badge.pedagogia {
      background: var(--blue-50);
      color: var(--blue-600);
    }

    .detail-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .detail-subtitle {
      font-size: 1.25rem;
      line-height: 1.6;
    }

    .detail-cover-image {
      margin: 2rem 0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .detail-cover-image img {
      width: 100%;
      height: auto;
      display: block;
    }

    .external-link-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--surface-50);
      border-left: 4px solid var(--primary-color);
      border-radius: 8px;
      margin: 2rem 0;
    }

    .external-link-card h3 {
      font-size: 1.125rem;
      font-weight: 600;
    }

    .content-wrapper {
      line-height: 1.8;
      font-size: 1.0625rem;
      color: var(--text-color);
      margin: 2rem 0;
    }

    .content-wrapper :deep(h2) {
      margin-top: 2rem;
      margin-bottom: 1rem;
      font-size: 1.75rem;
      font-weight: 600;
    }

    .content-wrapper :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 1.5rem 0;
    }

    .tags-section {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid var(--surface-border);
    }

    .tags-section h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: var(--surface-100);
      border-radius: 20px;
      font-size: 0.875rem;
      color: var(--text-color-secondary);
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
      .detail-container {
        padding: 1rem;
      }

      .detail-title {
        font-size: 2rem;
      }
    }
  `]
})
export class DetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly conteudoService = inject(ConteudoService);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly sanitizer = inject(DomSanitizer);

  contentData?: Curiosidade | RecursoPedagogico;
  sanitizedContent?: SafeHtml;
  loading = true;
  error?: string;
  type?: string;
  id?: number;

  get isCuriosidade(): boolean {
    return this.type === 'curiosidade';
  }

  get isPedagogia(): boolean {
    return this.type === 'pedagogia';
  }

  /**
   * Type guard para verificar se contentData é RecursoPedagogico
   */
  private isRecursoPedagogico(data: Curiosidade | RecursoPedagogico): data is RecursoPedagogico {
    return 'file' in data || 'link_externo' in data;
  }

  /**
   * Type guard para verificar se contentData é Curiosidade
   */
  private isCuriosidadeData(data: Curiosidade | RecursoPedagogico): data is Curiosidade {
    return 'tags' in data;
  }

  /**
   * Retorna arquivo de RecursoPedagogico se disponível
   */
  getPedagogiaFile(): string | undefined {
    if (this.contentData && this.isRecursoPedagogico(this.contentData)) {
      return this.contentData.file;
    }
    return undefined;
  }

  /**
   * Retorna link externo de RecursoPedagogico se disponível
   */
  getPedagogiaLink(): string | undefined {
    if (this.contentData && this.isRecursoPedagogico(this.contentData)) {
      return this.contentData.link_externo;
    }
    return undefined;
  }

  /**
   * Retorna tags de Curiosidade se disponível
   */
  getCuriosidadeTags(): number[] | undefined {
    if (this.contentData && this.isCuriosidadeData(this.contentData)) {
      return this.contentData.tags;
    }
    return undefined;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // Parse do formato "tipo-id" (ex: "curiosidade-123")
      const typeId = params['type'] + '-' + params['id'];
      const parts = typeId.split('-');

      if (parts.length >= 2) {
        this.type = parts[0]; // 'curiosidade' ou 'pedagogia'
        this.id = parseInt(parts[1], 10);

        if (this.id && !isNaN(this.id)) {
          this.loadContent();
        } else {
          this.error = 'ID inválido';
          this.loading = false;
        }
      } else {
        this.error = 'Formato de URL inválido';
        this.loading = false;
      }
    });
  }

  private loadContent(): void {
    if (!this.type || !this.id) return;

    this.loading = true;
    this.error = undefined;

    if (this.type === 'curiosidade') {
      this.conteudoService.getCuriosidadeDetail(this.id).subscribe({
        next: (data: Curiosidade) => {
          this.contentData = data;
          this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(data.texto);
          this.updateMetaTags();
          this.loading = false;
        },
        error: (err: any) => {
          this.error = err.message || 'Não foi possível carregar o conteúdo';
          this.loading = false;
          console.error('Erro ao carregar detalhe:', err);
        }
      });
    } else {
      this.conteudoService.getPedagogiaDetail(this.id).subscribe({
        next: (data: RecursoPedagogico) => {
          this.contentData = data;
          this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(data.texto);
          this.updateMetaTags();
          this.loading = false;
        },
        error: (err: any) => {
          this.error = err.message || 'Não foi possível carregar o conteúdo';
          this.loading = false;
          console.error('Erro ao carregar detalhe:', err);
        }
      });
    }
  }

  private updateMetaTags(): void {
    if (!this.contentData) return;

    const title = `${this.contentData.titulo} | ${environment.appTitle}`;
    this.titleService.setTitle(title);

    this.metaService.updateTag({
      name: 'description',
      content: this.contentData.resumo || ''
    });

    if (this.contentData.imagem) {
      this.metaService.updateTag({
        property: 'og:image',
        content: this.contentData.imagem
      });
    }
  }

  goBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
