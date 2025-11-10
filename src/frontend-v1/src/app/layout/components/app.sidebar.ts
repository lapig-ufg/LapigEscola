import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppMenu } from './app.menu';
import { LayoutService } from '@/layout/service/layout.service';
import { RouterModule } from '@angular/router';
import { AssetService } from '../../../services/asset.service'
@Component({
    selector: '[app-sidebar]',
    standalone: true,
    imports: [AppMenu, RouterModule],
    template: ` <div
        class="layout-sidebar"
        (mouseenter)="onMouseEnter()"
        (mouseleave)="onMouseLeave()"
    >
        <div class="sidebar-header">
            <a [routerLink]="['/']" class="app-logo">
                <img
                    [src]="asset.url('layout/images/lapig_escola.png')"
                    alt="LapigEscola"
                    class="logo-image"
                />
            </a>
            <button
                class="layout-sidebar-anchor p-link z-2 hover:cursor-pointer"
                type="button"
                (click)="anchor()"
            ></button>
        </div>

        <div #menuContainer class="layout-menu-container">
            <app-menu></app-menu>
        </div>
    </div>`,
})
export class AppSidebar {
    timeout: any = null;

    @ViewChild('menuContainer') menuContainer!: ElementRef;
    constructor(
        public layoutService: LayoutService,
        public el: ElementRef,
        public asset: AssetService
    ) {}

    onMouseEnter() {
        if (!this.layoutService.layoutState().anchored) {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }

            this.layoutService.layoutState.update((state) => {
                if (!state.sidebarActive) {
                    return {
                        ...state,
                        sidebarActive: true,
                    };
                }
                return state;
            });
        }
    }

    onMouseLeave() {
        if (!this.layoutService.layoutState().anchored) {
            if (!this.timeout) {
                this.timeout = setTimeout(() => {
                    this.layoutService.layoutState.update((state) => {
                        if (state.sidebarActive) {
                            return {
                                ...state,
                                sidebarActive: false,
                            };
                        }
                        return state;
                    });
                }, 300);
            }
        }
    }

    anchor() {
        this.layoutService.layoutState.update((state) => ({
            ...state,
            anchored: !state.anchored,
        }));
    }
}
