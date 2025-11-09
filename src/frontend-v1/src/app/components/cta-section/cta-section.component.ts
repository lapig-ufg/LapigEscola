/**
 * CTA Section Component
 * Call to Action para engajamento dos usuários
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  template: `
    <section class="cta-section">
      <div class="cta-container">
        <div class="cta-content">
          <div class="cta-icon">
            <i class="pi pi-book"></i>
          </div>

          <h2 class="cta-title">
            Comece sua Jornada de Aprendizado
          </h2>

          <p class="cta-description">
            Acesse conteúdos educacionais gratuitos sobre os biomas brasileiros,
            com textos, imagens, vídeos e recursos pedagógicos para todas as idades.
          </p>

          <div class="cta-features">
            <div class="feature-item">
              <i class="pi pi-check-circle feature-icon"></i>
              <span>Conteúdo 100% gratuito</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle feature-icon"></i>
              <span>Recursos pedagógicos</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle feature-icon"></i>
              <span>Material multimídia</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle feature-icon"></i>
              <span>Atualizado constantemente</span>
            </div>
          </div>

          <div class="cta-actions">
            <a href="#biomas" class="cta-link-button">
              <p-button
                label="Explorar Agora"
                icon="pi pi-play"
                size="large"
                styleClass="cta-btn-primary"
              />
            </a>
            <a href="#recursos" class="cta-link-button">
              <p-button
                label="Ver Recursos"
                icon="pi pi-book"
                [outlined]="true"
                size="large"
                styleClass="cta-btn-secondary"
              />
            </a>
          </div>
        </div>

        <div class="cta-visual">
          <div class="visual-card card-1">
            <i class="pi pi-globe card-icon"></i>
            <span class="card-text">Biodiversidade</span>
          </div>
          <div class="visual-card card-2">
            <i class="pi pi-image card-icon"></i>
            <span class="card-text">Galeria</span>
          </div>
          <div class="visual-card card-3">
            <i class="pi pi-video card-icon"></i>
            <span class="card-text">Vídeos</span>
          </div>
          <div class="visual-card card-4">
            <i class="pi pi-file-pdf card-icon"></i>
            <span class="card-text">Materiais</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .cta-section {
      padding: 6rem 2rem;
      background: linear-gradient(135deg, #047857 0%, #059669 35%, #10b981 70%, #34d399 100%);
      position: relative;
      overflow: hidden;
    }

    .cta-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image:
        radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.1) 1px, transparent 0);
      background-size: 40px 40px;
      opacity: 0.3;
    }

    .cta-container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .cta-content {
      color: white;
    }

    .cta-icon {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .cta-icon i {
      font-size: 2.5rem;
      color: white;
    }

    .cta-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .cta-description {
      font-size: 1.125rem;
      line-height: 1.7;
      margin: 0 0 2rem 0;
      opacity: 0.95;
    }

    .cta-features {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9375rem;
    }

    .feature-icon {
      color: var(--green-300);
      font-size: 1.25rem;
    }

    .cta-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .cta-link-button {
      text-decoration: none;
    }

    :host ::ng-deep .cta-btn-primary {
      background: #fbbf24;
      border-color: #fbbf24;
      color: #065f46;
      font-weight: 600;
    }

    :host ::ng-deep .cta-btn-primary:hover {
      background: #f59e0b;
      border-color: #f59e0b;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(251, 191, 36, 0.4);
    }

    :host ::ng-deep .cta-btn-secondary {
      border-color: rgba(255, 255, 255, 0.5);
      color: white;
      background: transparent;
    }

    :host ::ng-deep .cta-btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: white;
    }

    .cta-visual {
      position: relative;
      height: 400px;
    }

    .visual-card {
      position: absolute;
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      color: white;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      animation: float 6s ease-in-out infinite;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .visual-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
    }

    .card-icon {
      font-size: 2rem;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }

    .card-text {
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    /* Biodiversidade - Verde */
    .card-1 {
      top: 20px;
      left: 50px;
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(22, 163, 74, 0.25));
      border: 1px solid rgba(34, 197, 94, 0.4);
      animation-delay: 0s;
    }

    .card-1 .card-icon {
      color: var(--green-200);
    }

    /* Galeria - Azul */
    .card-2 {
      top: 120px;
      right: 40px;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.25));
      border: 1px solid rgba(59, 130, 246, 0.4);
      animation-delay: 1.5s;
    }

    .card-2 .card-icon {
      color: var(--blue-200);
    }

    /* Vídeos - Roxo */
    .card-3 {
      bottom: 100px;
      left: 30px;
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(147, 51, 234, 0.25));
      border: 1px solid rgba(168, 85, 247, 0.4);
      animation-delay: 3s;
    }

    .card-3 .card-icon {
      color: var(--purple-200);
    }

    /* Materiais - Laranja */
    .card-4 {
      bottom: 40px;
      right: 80px;
      background: linear-gradient(135deg, rgba(251, 146, 60, 0.3), rgba(249, 115, 22, 0.25));
      border: 1px solid rgba(251, 146, 60, 0.4);
      animation-delay: 4.5s;
    }

    .card-4 .card-icon {
      color: var(--orange-200);
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      25% {
        transform: translateY(-10px) rotate(2deg);
      }
      50% {
        transform: translateY(0) rotate(-2deg);
      }
      75% {
        transform: translateY(10px) rotate(2deg);
      }
    }

    @media (max-width: 992px) {
      .cta-container {
        grid-template-columns: 1fr;
        gap: 3rem;
      }

      .cta-visual {
        height: 300px;
      }

      .visual-card {
        padding: 1rem;
      }

      .card-icon {
        font-size: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .cta-section {
        padding: 4rem 1.5rem;
      }

      .cta-title {
        font-size: 2rem;
      }

      .cta-description {
        font-size: 1rem;
      }

      .cta-features {
        grid-template-columns: 1fr;
      }

      .cta-actions {
        flex-direction: column;
        width: 100%;
      }

      .cta-actions ::ng-deep .p-button {
        width: 100%;
      }

      .cta-visual {
        display: none;
      }
    }
  `]
})
export class CtaSectionComponent {
  @Input() title?: string;
  @Input() description?: string;
}
