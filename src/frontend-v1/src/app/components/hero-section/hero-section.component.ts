/**
 * Hero Section Component
 * Seção principal da landing page com chamada para ação
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  template: `
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">
          <i class="pi pi-globe"></i>
          <span>Educação Ambiental</span>
        </div>

        <h1 class="hero-title">
          Explore os
          <span class="hero-highlight">Biomas Brasileiros</span>
        </h1>

        <p class="hero-description">
          Descubra a rica biodiversidade do Brasil através de conteúdos educacionais
          interativos sobre os seis biomas brasileiros: Amazônia, Cerrado, Mata Atlântica,
          Caatinga, Pampa e Pantanal.
        </p>

        <div class="hero-actions">
          <a href="#biomas" class="hero-link-button">
            <p-button
              label="Explorar Biomas"
              icon="pi pi-compass"
              size="large"
              styleClass="hero-btn-primary"
            />
          </a>
          <a href="#recursos" class="hero-link-button">
            <p-button
              label="Ver Recursos"
              icon="pi pi-book"
              [outlined]="true"
              size="large"
              styleClass="hero-btn-secondary"
            />
          </a>
        </div>

        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">6</span>
            <span class="stat-label">Biomas</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">40+</span>
            <span class="stat-label">Temas</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">100%</span>
            <span class="stat-label">Gratuito</span>
          </div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="hero-pattern"></div>
        <div class="hero-shape shape-1"></div>
        <div class="hero-shape shape-2"></div>
        <div class="hero-shape shape-3"></div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      position: relative;
      min-height: 700px;
      display: flex;
      align-items: center;
      padding: 6rem 2rem;
      overflow: hidden;
      background: transparent;
    }

    .hero-content {
      position: relative;
      max-width: 1200px;
      margin: 0 auto;
      z-index: 2;
      text-align: center;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border-radius: 24px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 2rem;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      animation: fadeInDown 0.6s ease-out;
    }

    .hero-badge i {
      font-size: 1rem;
    }

    .hero-title {
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      font-weight: 800;
      line-height: 1.15;
      margin: 0 0 2rem 0;
      color: #1f2937;
      animation: fadeInUp 0.6s ease-out 0.2s backwards;
    }

    .hero-highlight {
      display: block;
      background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-top: 0.5rem;
      position: relative;
    }

    .hero-highlight::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 4px;
      background: linear-gradient(90deg, transparent, #10b981, transparent);
      border-radius: 2px;
    }

    .hero-description {
      font-size: 1.25rem;
      line-height: 1.8;
      color: #6b7280;
      max-width: 750px;
      margin: 0 auto 3rem auto;
      animation: fadeInUp 0.6s ease-out 0.4s backwards;
      font-weight: 400;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 3rem;
      animation: fadeInUp 0.6s ease-out 0.6s backwards;
    }

    .hero-link-button {
      text-decoration: none;
    }

    :host ::ng-deep .hero-btn-primary {
      background: linear-gradient(135deg, #059669, #10b981);
      border: none;
      color: white;
      font-weight: 600;
      padding: 0.75rem 2rem;
      font-size: 1.125rem;
      box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
      transition: all 0.3s ease;
    }

    :host ::ng-deep .hero-btn-primary:hover {
      background: linear-gradient(135deg, #047857, #059669);
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(16, 185, 129, 0.4);
    }

    :host ::ng-deep .hero-btn-secondary {
      border: 2px solid #10b981;
      color: #059669;
      background: white;
      font-weight: 600;
      padding: 0.75rem 2rem;
      font-size: 1.125rem;
      transition: all 0.3s ease;
    }

    :host ::ng-deep .hero-btn-secondary:hover {
      background: #f0fdf4;
      border-color: #059669;
      color: #047857;
      transform: translateY(-2px);
    }

    .hero-stats {
      display: flex;
      gap: 3rem;
      justify-content: center;
      align-items: center;
      padding: 2.5rem 3rem;
      background: white;
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      max-width: 650px;
      margin: 0 auto;
      animation: fadeInUp 0.6s ease-out 0.8s backwards;
      border: 1px solid #e5e7eb;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #059669, #10b981);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 600;
    }

    .stat-divider {
      width: 2px;
      height: 50px;
      background: linear-gradient(180deg, transparent, #d1d5db, transparent);
    }

    .hero-visual {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      pointer-events: none;
    }

    .hero-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.03;
      background-image:
        radial-gradient(circle at 1px 1px, var(--text-color) 1px, transparent 0);
      background-size: 40px 40px;
    }

    .hero-shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.15;
      animation: float 20s ease-in-out infinite;
    }

    .shape-1 {
      width: 500px;
      height: 500px;
      background: linear-gradient(135deg, #10b981, #34d399);
      top: -150px;
      right: -150px;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 400px;
      height: 400px;
      background: linear-gradient(135deg, #059669, #10b981);
      bottom: -50px;
      left: 10%;
      animation-delay: 5s;
    }

    .shape-3 {
      width: 350px;
      height: 350px;
      background: linear-gradient(135deg, #34d399, #6ee7b7);
      top: 50%;
      right: 10%;
      animation-delay: 10s;
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      33% {
        transform: translate(30px, -30px) scale(1.1);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.9);
      }
    }

    @media (max-width: 768px) {
      .hero-section {
        min-height: auto;
        padding: 3rem 1.5rem;
      }

      .hero-actions {
        flex-direction: column;
        width: 100%;
      }

      .hero-actions ::ng-deep .p-button {
        width: 100%;
      }

      .hero-stats {
        flex-direction: column;
        gap: 1.5rem;
        padding: 1.5rem;
      }

      .stat-divider {
        width: 100px;
        height: 1px;
      }

      .hero-description {
        font-size: 1rem;
      }
    }
  `]
})
export class HeroSectionComponent {
  @Input() title?: string;
  @Input() description?: string;
}
