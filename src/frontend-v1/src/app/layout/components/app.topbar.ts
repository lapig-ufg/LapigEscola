import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '@/layout/service/layout.service';
import { environment } from '@/environments/environment';

@Component({
    selector: '[app-topbar]',
    standalone: true,
    imports: [CommonModule],
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

                <div class="topbar-title">
                    <h1 class="m-0 text-xl font-semibold text-primary">
                        {{ appTitle }}
                    </h1>
                    <span class="text-sm text-600">
                        {{ appSubtitle }}
                    </span>
                </div>
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
        .topbar-title {
            display: flex;
            flex-direction: column;
            margin-left: 1rem;
        }

        .topbar-theme-toggle {
            font-size: 1.25rem;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.2s;
        }

        .topbar-theme-toggle:hover {
            background: var(--surface-hover);
        }

        @media (max-width: 768px) {
            .topbar-title span {
                display: none;
            }
            .topbar-title h1 {
                font-size: 1rem;
            }
        }
    `]
})
export class AppTopbar {
    appTitle = environment.appTitle;
    appSubtitle = environment.appSubtitle;

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
