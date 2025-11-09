import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '@/layout/service/layout.service';
import { AppBreadcrumb } from './app.breadcrumb';

@Component({
    selector: '[app-topbar]',
    standalone: true,
    imports: [CommonModule, AppBreadcrumb],
    template: `
        <div class="layout-topbar">
            <div class="topbar-start">
                <button
                    #menubutton
                    type="button"
                    class="topbar-menubutton p-link p-trigger"
                    (click)="layoutService.onMenuToggle()"
                >
                    <i class="pi pi-bars"></i>
                </button>

                <div app-breadcrumb class="topbar-breadcrumb"></div>
            </div>

            <div class="topbar-end">
                <button
                    #topbarmenubutton
                    type="button"
                    class="topbar-theme-toggle p-link"
                    (click)="toggleTheme()"
                    [title]="isDarkTheme ? 'Tema Claro' : 'Tema Escuro'"
                >
                    <i [class]="isDarkTheme ? 'pi pi-sun' : 'pi pi-moon'"></i>
                </button>
            </div>
        </div>
    `,
    styles: [`
        .topbar-breadcrumb {
            margin-left: 1rem;
            flex: 1;
        }

        .topbar-theme-toggle {
            font-size: 1.25rem;
            border-radius: 50%;
            transition: all 0.2s;
        }

        .topbar-theme-toggle:hover {
            background: var(--surface-hover);
        }

        @media (max-width: 768px) {
            .topbar-breadcrumb {
                margin-left: 0.5rem;
            }
        }
    `]
})
export class AppTopbar {
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    constructor(public layoutService: LayoutService) {}

    get isDarkTheme(): boolean {
        return this.layoutService.layoutConfig().darkTheme ?? false;
    }

    toggleTheme(): void {
        this.layoutService.layoutConfig.update((config) => ({
            ...config,
            darkTheme: !config.darkTheme
        }));
    }
}
