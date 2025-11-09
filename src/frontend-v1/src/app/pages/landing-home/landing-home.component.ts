/**
 * Landing Home Component
 * Página inicial isolada do layout principal da aplicação
 * Apresenta os biomas brasileiros de forma moderna e educacional
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarHomeComponent } from './components/topbar-home.component';
import { FooterHomeComponent } from './components/footer-home.component';
import { HeroSectionComponent } from '@/components/hero-section/hero-section.component';
import { FeaturesSectionComponent } from '@/components/features-section/features-section.component';
import { BiomasGridComponent } from '@/components/biomas-grid/biomas-grid.component';
import { CtaSectionComponent } from '@/components/cta-section/cta-section.component';

@Component({
  selector: 'app-landing-home',
  standalone: true,
  imports: [
    CommonModule,
    TopbarHomeComponent,
    FooterHomeComponent,
    HeroSectionComponent,
    FeaturesSectionComponent,
    BiomasGridComponent,
    CtaSectionComponent
  ],
  template: `
    <div class="landing-home">
      <!-- Topbar Navigation -->
      <topbar-home />

      <!-- Main Content -->
      <main class="landing-main">
        <!-- Hero Section -->
        <section id="home">
          <app-hero-section />
        </section>

        <!-- Features Section -->
        <section id="recursos">
          <app-features-section />
        </section>

        <!-- Biomas Grid -->
        <section id="biomas">
          <app-biomas-grid />
        </section>

        <!-- CTA Section -->
        <section id="cta">
          <app-cta-section />
        </section>
      </main>

      <!-- Footer -->
      <footer-home />
    </div>
  `,
  styles: [`
    .landing-home {
      position: relative;
      overflow: hidden;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: linear-gradient(135deg,
        #ecfdf5 0%,
        #f0fdf4 25%,
        #ffffff 50%,
        #f0fdf4 75%,
        #ecfdf5 100%);
    }

    .landing-main {
      flex: 1;
      position: relative;
      z-index: 1;
    }

    section {
      scroll-margin-top: 80px; /* Offset para scroll suave com topbar fixo */
    }

    /* Dark Mode Styles */
    :host-context(.app-dark) .landing-home {
      background: linear-gradient(135deg,
        #0c1a14 0%,
        #0f2419 25%,
        #0a1612 50%,
        #0f2419 75%,
        #0c1a14 100%);
    }
  `]
})
export class LandingHomeComponent {}
