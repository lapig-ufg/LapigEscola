/**
 * Footer Home Component
 * Rodapé da landing page com informações institucionais
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginaService } from '@/services';
import { MenuItemSchema } from '@/models';

@Component({
  selector: 'footer-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer-home">
      <div class="footer-container">
        <!-- Top Section -->
        <div class="footer-top">
          <div class="footer-about">
            <img
              src="/layout/images/lapig_escola.png"
              alt="LapigEscola"
              class="footer-logo"
            />
            <p class="footer-description">
              Plataforma educacional sobre biodiversidade e biomas brasileiros,
              desenvolvida pelo LAPIG/UFG para promover a educação ambiental.
            </p>
            <div class="footer-social">
              <a href="#" class="social-link" aria-label="Facebook">
                <i class="pi pi-facebook"></i>
              </a>
              <a href="#" class="social-link" aria-label="Twitter">
                <i class="pi pi-twitter"></i>
              </a>
              <a href="#" class="social-link" aria-label="Instagram">
                <i class="pi pi-instagram"></i>
              </a>
              <a href="#" class="social-link" aria-label="GitHub">
                <i class="pi pi-github"></i>
              </a>
            </div>
          </div>

          <div class="footer-links">
            <div class="footer-column">
              <h4 class="footer-column-title">Navegação</h4>
              <ul class="footer-link-list">
                <li><a [routerLink]="['/']">Home</a></li>
                <li><a [routerLink]="['/app/biomas']">Explorar Biomas</a></li>
              </ul>
            </div>

            <div class="footer-column">
              <h4 class="footer-column-title">Biomas</h4>
              <ul class="footer-link-list">
                <li><a [routerLink]="['/bioma/amazonia']">Amazônia</a></li>
                <li><a [routerLink]="['/bioma/cerrado']">Cerrado</a></li>
                <li><a [routerLink]="['/bioma/mata-atlantica']">Mata Atlântica</a></li>
                <li><a [routerLink]="['/bioma/caatinga']">Caatinga</a></li>
                <li><a [routerLink]="['/bioma/pantanal']">Pantanal</a></li>
                <li><a [routerLink]="['/bioma/pampa']">Pampa</a></li>
              </ul>
            </div>

            <div class="footer-column" *ngIf="iniciativaItems.length > 0">
              <h4 class="footer-column-title">A Iniciativa</h4>
              <ul class="footer-link-list">
                <li *ngFor="let item of iniciativaItems">
                  <a [routerLink]="['/page', item.slug || item.anchor_id]">
                    {{ item.label }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Bottom Section -->
        <div class="footer-bottom">
          <p class="footer-copyright">
            © {{ currentYear }} LapigEscola - LAPIG/UFG. Todos os direitos reservados.
          </p>
          <div class="footer-credits">
            <span>Desenvolvido com</span>
            <i class="pi pi-heart text-red-500"></i>
            <span>para educação ambiental</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-home {
      background: var(--surface-900);
      color: var(--surface-0);
      margin-top: 6rem;
    }

    .footer-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 4rem 2rem 2rem 2rem;
    }

    .footer-top {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3rem;
      margin-bottom: 3rem;
    }

    @media (min-width: 768px) {
      .footer-top {
        grid-template-columns: 1.5fr 2fr;
        gap: 4rem;
      }
    }

    .footer-about {
      max-width: 400px;
    }

    .footer-logo {
      width: 10rem;
      height: auto;
      max-width: 100%;
      object-fit: contain;
      margin-bottom: 1.5rem;
      filter: brightness(1.2);
    }

    .footer-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      color: var(--primary-color);
    }

    .footer-description {
      color: var(--surface-300);
      line-height: 1.6;
      margin: 0 0 1.5rem 0;
    }

    .footer-social {
      display: flex;
      gap: 1rem;
    }

    .social-link {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface-800);
      border-radius: 50%;
      color: var(--surface-100);
      transition: all 0.3s;
      font-size: 1.125rem;
    }

    .social-link:hover {
      background: var(--primary-color);
      color: white;
      transform: translateY(-2px);
    }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 2rem;
    }

    .footer-column-title {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
      color: var(--surface-0);
    }

    .footer-link-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-link-list li {
      margin-bottom: 0.75rem;
    }

    .footer-link-list a {
      color: var(--surface-400);
      text-decoration: none;
      transition: color 0.2s;
      font-size: 0.9375rem;
    }

    .footer-link-list a:hover {
      color: var(--primary-color);
    }

    .footer-bottom {
      border-top: 1px solid var(--surface-800);
      padding-top: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      text-align: center;
    }

    @media (min-width: 768px) {
      .footer-bottom {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
      }
    }

    .footer-copyright {
      color: var(--surface-400);
      margin: 0;
      font-size: 0.875rem;
    }

    .footer-credits {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--surface-400);
      font-size: 0.875rem;
    }

    @media (max-width: 767px) {
      .footer-container {
        padding: 3rem 1rem 1.5rem 1rem;
      }

      .footer-title {
        font-size: 1.25rem;
      }

      .footer-links {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FooterHomeComponent implements OnInit {
  private readonly paginaService = inject(PaginaService);

  currentYear = new Date().getFullYear();
  iniciativaItems: MenuItemSchema[] = [];

  ngOnInit(): void {
    this.loadIniciativaItems();
  }

  private loadIniciativaItems(): void {
    this.paginaService.getMenu().subscribe({
      next: (items: MenuItemSchema[]) => {
        this.iniciativaItems = items.sort((a, b) => a.order - b.order);
      },
      error: (err: any) => {
        console.error('Erro ao carregar itens da iniciativa:', err);
        this.iniciativaItems = [];
      }
    });
  }
}
