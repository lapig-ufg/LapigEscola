import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    NavigationEnd,
    Router,
    RouterModule,
} from '@angular/router';

import { BehaviorSubject, filter } from 'rxjs';

interface Breadcrumb {
    label: string;
    url?: string;
}

@Component({
    selector: '[app-breadcrumb]',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `<nav class="layout-breadcrumb">
        <ol>
            <ng-template
                ngFor
                let-item
                let-last="last"
                [ngForOf]="breadcrumbs$ | async"
            >
                <li>
                    <a *ngIf="item.url && !last" [routerLink]="item.url" class="breadcrumb-link">
                        {{ item.label }}
                    </a>
                    <span *ngIf="!item.url || last" class="breadcrumb-current">
                        {{ item.label }}
                    </span>
                </li>
                <li *ngIf="!last" class="layout-breadcrumb-chevron">/</li>
            </ng-template>
        </ol>
    </nav> `,
    styles: [`
        .breadcrumb-link {
            color: var(--text-color-secondary);
            text-decoration: none;
            transition: color 0.2s;
        }

        .breadcrumb-link:hover {
            color: var(--primary-color);
            text-decoration: underline;
        }

        .breadcrumb-current {
            color: var(--text-color);
            font-weight: 500;
        }
    `]
})
export class AppBreadcrumb {
    private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
    readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

    constructor(private router: Router) {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                const breadcrumbs = this.buildBreadcrumbs();
                this._breadcrumbs$.next(breadcrumbs);
            });

        // Build initial breadcrumbs
        const breadcrumbs = this.buildBreadcrumbs();
        this._breadcrumbs$.next(breadcrumbs);
    }

    private buildBreadcrumbs(): Breadcrumb[] {
        const breadcrumbs: Breadcrumb[] = [];
        const url = this.router.url;

        // Se estiver fora de /app, não mostra breadcrumb
        if (!url.startsWith('/app')) {
            return breadcrumbs;
        }

        // Parse da URL para construir hierarquia
        const segments = url.split('/').filter(s => s);

        // Remove 'app' do início
        if (segments[0] === 'app') {
            segments.shift();
        }

        // Sempre adiciona "Biomas" como raiz
        breadcrumbs.push({
            label: 'Biomas',
            url: '/app/biomas'
        });

        // Processa os segmentos para construir hierarquia
        if (segments.length > 0 && segments[0] === 'bioma' && segments[1]) {
            // Extrai o slug do bioma e formata
            const biomaSlug = segments[1];
            const biomaLabel = this.formatSlug(biomaSlug);
            breadcrumbs.push({
                label: biomaLabel,
                url: `/app/bioma/${biomaSlug}`
            });

            // Se tem tema
            if (segments.length > 2 && segments[2] === 'tema' && segments[3]) {
                const temaSlug = segments[3];
                const temaLabel = this.formatSlug(temaSlug);
                breadcrumbs.push({
                    label: temaLabel,
                    url: `/app/bioma/${biomaSlug}/tema/${temaSlug}`
                });

                // Se tem detalhe (curiosidade ou pedagogia)
                if (segments.length > 4) {
                    const detailSegment = segments[4];
                    const match = detailSegment.match(/^(curiosidade|pedagogia)-(\d+)$/);
                    if (match) {
                        const type = match[1];
                        const label = type === 'curiosidade' ? 'Curiosidade' : 'Recurso Pedagógico';
                        breadcrumbs.push({
                            label: label,
                            url: `/app/bioma/${biomaSlug}/tema/${temaSlug}/${detailSegment}`
                        });
                    }
                }
            }
        } else if (segments.length > 0 && segments[0] === 'page' && segments[1]) {
            // Página estática
            breadcrumbs.push({
                label: this.formatSlug(segments[1]),
                url: `/app/page/${segments[1]}`
            });
        }

        return breadcrumbs;
    }

    /**
     * Formata um slug para exibição
     * Exemplos:
     *   "cerrado" → "Cerrado"
     *   "vegetacao-cerrado" → "Vegetação Cerrado"
     *   "mata-atlantica" → "Mata Atlântica"
     */
    private formatSlug(slug: string): string {
        if (!slug) return '';

        return slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}
