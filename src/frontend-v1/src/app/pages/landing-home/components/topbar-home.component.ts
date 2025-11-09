/**
 * Topbar Home Component
 * Menu de navegação da landing page com itens carregados da API
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { PaginaService } from '@/services';
import { MenuItemSchema } from '@/models';

@Component({
  selector: 'topbar-home',
  standalone: true,
  imports: [CommonModule, RouterModule, StyleClassModule, ButtonModule, RippleModule],
  template: `
    <div class="topbar-home">
      <div class="topbar-container">
        <!-- Logo -->
        <a class="topbar-logo" (click)="scrollToTop()">
          <img
            src="/layout/images/lapig_escola.png"
            alt="LapigEscola"
            class="logo-image"
          />
        </a>

        <!-- Mobile Menu Toggle -->
        <i
          pStyleClass="@next"
          enterFromClass="hidden"
          leaveToClass="hidden"
          [hideOnOutsideClick]="true"
          class="pi pi-bars topbar-menu-toggle"
        ></i>

        <!-- Menu -->
        <div id="menu" class="topbar-menu">
          <!-- Close button (mobile) -->
          <a
            pRipple
            class="topbar-menu-close"
            pStyleClass="@grandparent"
            enterFromClass="hidden"
            leaveToClass="hidden"
          >
            <i class="pi pi-times"></i>
          </a>

          <ul class="topbar-menu-list">
            <!-- Home link -->
            <li>
              <a
                [routerLink]="['/']"
                pStyleClass="#menu"
                enterFromClass="hidden"
                leaveToClass="hidden"
                pRipple
                class="topbar-menu-item"
              >
                <i class="pi pi-home"></i>
                <span>Home</span>
              </a>
            </li>

            <!-- Menu items from API -->
            <li *ngFor="let item of menuItems">
              <a
                (click)="navigate(item)"
                pStyleClass="#menu"
                enterFromClass="hidden"
                leaveToClass="hidden"
                pRipple
                class="topbar-menu-item"
              >
                <i *ngIf="item.icon" [class]="'pi ' + item.icon"></i>
                <span>{{ item.label }}</span>
              </a>
            </li>

            <!-- Entrar button -->
            <li class="topbar-menu-action">
              <button
                pButton
                pRipple
                type="button"
                label="Entrar"
                icon="pi pi-sign-in"
                [routerLink]="['/app']"
                class="topbar-btn"
              ></button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .topbar-home {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--surface-0);
      //border-bottom: 1px solid var(--surface-border);
    }

    .topbar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .topbar-logo {
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: opacity 0.2s;
    }

    .topbar-logo:hover {
      opacity: 0.8;
    }

    .logo-image {
      width: 8rem;
      height: auto;
      max-width: 100%;
      object-fit: contain;
    }

    .topbar-menu-toggle {
      font-size: 2rem;
      cursor: pointer;
      color: var(--text-color);
      display: block;
    }

    @media (min-width: 768px) {
      .topbar-menu-toggle {
        display: none;
      }
    }

    .topbar-menu {
      flex-grow: 1;
      display: none;
    }

    @media (min-width: 768px) {
      .topbar-menu {
        display: flex;
        position: static;
        width: auto;
        background: transparent;
        box-shadow: none;
      }
    }

    @media (max-width: 767px) {
      .topbar-menu {
        position: absolute;
        top: 80px;
        right: 0;
        width: 100%;
        background: var(--surface-0);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 30;
        animation: fadeIn 0.3s;
      }

      .topbar-menu.hidden {
        display: none;
      }
    }

    .topbar-menu-close {
      display: block;
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      cursor: pointer;
      color: var(--text-color);
      font-size: 1.5rem;
      z-index: 5;
    }

    @media (min-width: 768px) {
      .topbar-menu-close {
        display: none;
      }
    }

    .topbar-menu-list {
      list-style: none;
      padding: 1rem;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-left: auto;
    }

    @media (min-width: 768px) {
      .topbar-menu-list {
        flex-direction: row;
        align-items: center;
        padding: 0;
        gap: 0;
      }
    }

    .topbar-menu-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      color: var(--text-color);
      font-weight: 500;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.2s;
    }

    @media (min-width: 768px) {
      .topbar-menu-item {
        padding: 0.5rem 1rem;
        margin-left: 2rem;
      }
    }

    .topbar-menu-item:hover {
      color: var(--primary-color);
      background: var(--surface-hover);
    }

    .topbar-menu-action {
      display: flex;
      align-items: center;
    }

    @media (min-width: 768px) {
      .topbar-menu-action {
        margin-left: 2rem;
      }
    }

    .topbar-btn {
      width: 100%;
      margin-top: 1rem;
    }

    @media (min-width: 768px) {
      .topbar-btn {
        width: auto;
        margin-top: 0;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Dark Mode Support */
    :host-context(.app-dark) .topbar-home {
      background: var(--surface-card);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 767px) {
      :host-context(.app-dark) .topbar-menu {
        background: var(--surface-card);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      }
    }
  `]
})
export class TopbarHomeComponent implements OnInit {
  private readonly paginaService = inject(PaginaService);
  private readonly router = inject(Router);

  menuItems: MenuItemSchema[] = [];

  ngOnInit(): void {
    this.loadMenu();
  }

  private loadMenu(): void {
    this.paginaService.getMenu().subscribe({
      next: (items: MenuItemSchema[]) => {
        this.menuItems = items.sort((a, b) => a.order - b.order);
      },
      error: (err: any) => {
        console.error('Erro ao carregar menu:', err);
        // Menu padrão em caso de erro
        this.menuItems = [
          { label: 'Início', anchor_id: '#home', order: 1 },
          { label: 'Biomas', anchor_id: '#biomas', order: 2 },
          { label: 'Recursos', anchor_id: '#recursos', order: 3 },
        ];
      }
    });
  }

  navigate(item: MenuItemSchema): void {
    if (item.slug) {
      // Se tem slug, navega para a página estática com layout da landing
      this.router.navigate(['/page', item.slug]);
    } else if (item.anchor_id) {
      // Se tem anchor_id, faz scroll suave
      this.smoothScroll(item.anchor_id);
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private smoothScroll(id: string): void {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}
