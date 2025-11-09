/**
 * Features Section Component
 * Seção de funcionalidades e recursos educacionais
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Recursos Educacionais Completos</h2>
          <p class="section-description">
            Uma plataforma completa para ensino e aprendizagem sobre biodiversidade brasileira
          </p>
        </div>

        <div class="features-grid">
          <div
            *ngFor="let feature of features; let i = index"
            class="feature-card"
            [style.animation-delay]="(i * 0.1) + 's'"
          >
            <div class="feature-icon" [style.background]="feature.color">
              <i [class]="'pi ' + feature.icon"></i>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .features-section {
      padding: 5rem 2rem;
      background: transparent;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 0 0 1rem 0;
    }

    .section-description {
      font-size: 1.125rem;
      color: var(--text-color-secondary);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.7;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      text-align: center;
      padding: 2rem 1.5rem;
      background: var(--surface-card);
      border-radius: 16px;
      border: 1px solid var(--surface-border);
      transition: all 0.3s ease;
      animation: fadeInUp 0.6s ease-out backwards;
    }

    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
      border-color: var(--primary-200);
    }

    .feature-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem auto;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }

    .feature-card:hover .feature-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .feature-icon i {
      font-size: 2.5rem;
      color: white;
    }

    .feature-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 0.75rem 0;
    }

    .feature-description {
      font-size: 0.9375rem;
      color: var(--text-color-secondary);
      line-height: 1.6;
      margin: 0;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .features-section {
        padding: 3rem 1rem;
      }

      .section-header {
        margin-bottom: 2rem;
      }

      .section-title {
        font-size: 2rem;
      }

      .section-description {
        font-size: 1rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }
  `]
})
export class FeaturesSectionComponent {
  features: Feature[] = [
    {
      icon: 'pi-book',
      title: 'Conteúdo Educacional',
      description: 'Textos didáticos sobre aspectos físicos, biológicos e sociais de cada bioma.',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: 'pi-images',
      title: 'Galeria de Imagens',
      description: 'Fotografias de alta qualidade da fauna, flora e paisagens dos biomas.',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: 'pi-video',
      title: 'Vídeos Educativos',
      description: 'Material audiovisual para enriquecer o aprendizado sobre biodiversidade.',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: 'pi-lightbulb',
      title: 'Curiosidades',
      description: 'Fatos interessantes e surpreendentes sobre os biomas brasileiros.',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      icon: 'pi-file-pdf',
      title: 'Recursos Pedagógicos',
      description: 'Materiais didáticos prontos para uso em sala de aula.',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      icon: 'pi-map-marker',
      title: 'Mapas Interativos',
      description: 'Visualização geoespacial dos biomas e suas características.',
      color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    }
  ];
}
