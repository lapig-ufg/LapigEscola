import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuitem } from './app.menuitem';
import { BiomaService, PaginaService } from '@/services';
import { BiomaSchema, MenuItemSchema } from '@/models';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
        <ul class="layout-menu" *ngIf="!loading">
            <ng-container *ngFor="let item of model; let i = index">
                <li
                    app-menuitem
                    *ngIf="!item.separator"
                    [item]="item"
                    [index]="i"
                    [root]="true"
                ></li>
                <li *ngIf="item.separator" class="menu-separator"></li>
            </ng-container>
        </ul>

        <div *ngIf="loading" class="flex align-items-center justify-content-center p-4">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        </div>
    `,
})
export class AppMenu implements OnInit {
    private readonly biomaService = inject(BiomaService);
    private readonly paginaService = inject(PaginaService);

    model: any[] = [];
    loading = true;

    ngOnInit() {
        this.loadMenu();
    }

    /**
     * Carrega menu dinamicamente da API
     */
    private loadMenu(): void {
        // Carrega biomas e páginas em paralelo
        Promise.all([
            this.biomaService.listBiomas().toPromise(),
            this.paginaService.getMenu().toPromise()
        ]).then(([biomas, menuItems]) => {
            this.buildMenu(biomas || [], menuItems || []);
            this.loading = false;
        }).catch(error => {
            console.error('Erro ao carregar menu:', error);
            this.buildFallbackMenu();
            this.loading = false;
        });
    }

    /**
     * Constrói estrutura do menu com dados da API
     */
    private buildMenu(biomas: BiomaSchema[], menuItems: MenuItemSchema[]): void {
        this.model = [];

        // 1. Seção "A Iniciativa" - Páginas estáticas
        if (menuItems.length > 0) {
            this.model.push({
                label: 'A Iniciativa',
                icon: 'pi pi-info-circle',
                items: menuItems
                    .sort((a, b) => a.order - b.order)
                    .map(item => ({
                        label: item.label,
                        icon: item.icon || 'pi pi-fw pi-file',
                        routerLink: [`/app/page/${item.slug || item.anchor_id}`]
                    }))
            });

            // Separador
            this.model.push({ separator: true });
        }

        // 2. Seção "Biomas Brasileiros" - Hierárquico
        if (biomas.length > 0) {
            this.model.push({
                label: 'Biomas Brasileiros',
                icon: 'pi pi-globe',
                items: biomas.map(bioma => ({
                    label: bioma.nome,
                    icon: 'pi pi-fw pi-map',
                    items: bioma.temas
                        .sort((a, b) => a.order - b.order)
                        .map(tema => ({
                            label: tema.nome,
                            icon: 'pi pi-fw pi-angle-right',
                            routerLink: [`/app/bioma/${bioma.slug}/tema/${tema.slug}`]
                        }))
                }))
            });
        }
    }

    /**
     * Menu fallback se API falhar
     */
    private buildFallbackMenu(): void {
        this.model = [
            {
                label: 'Dashboard',
                icon: 'pi pi-home',
                routerLink: ['/app/biomas']
            },
            {
                label: 'Erro ao carregar menu',
                icon: 'pi pi-exclamation-triangle',
                badge: 'Offline',
                badgeClass: 'p-badge-danger'
            }
        ];
    }
}
