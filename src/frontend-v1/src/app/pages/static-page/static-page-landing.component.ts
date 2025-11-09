/**
 * Static Page Landing Component
 * Wrapper para páginas estáticas usando o layout da landing page
 * Rota: /page/:slug
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarHomeComponent } from '@/pages/landing-home/components/topbar-home.component';
import { FooterHomeComponent } from '@/pages/landing-home/components/footer-home.component';
import { StaticPageComponent } from './static-page.component';

@Component({
  selector: 'app-static-page-landing',
  standalone: true,
  imports: [
    CommonModule,
    TopbarHomeComponent,
    FooterHomeComponent,
    StaticPageComponent
  ],
  template: `
    <div class="static-page-landing">
      <!-- Topbar -->
      <topbar-home />

      <!-- Main Content -->
      <main class="static-page-main">
        <app-static-page />
      </main>

      <!-- Footer -->
      <footer-home />
    </div>
  `,
  styles: [`
    .static-page-landing {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: var(--surface-ground);
    }

    .static-page-main {
      flex: 1;
      padding: 4rem 0;
    }

    /* Dark mode compatibility */
    :host-context(.app-dark) .static-page-landing {
      background: var(--surface-ground);
    }

    @media (max-width: 768px) {
      .static-page-main {
        padding: 2rem 0;
      }
    }
  `]
})
export class StaticPageLandingComponent {}
