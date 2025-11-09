import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-notfound',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule],
    template: `
        <div class="notfound-container">
            <!-- Background decorativo com ondas -->
            <svg viewBox="0 0 960 540" xmlns="http://www.w3.org/2000/svg" class="notfound-background" preserveAspectRatio="none">
                <rect x="0" y="0" width="960" height="540" class="bg-base"></rect>

                <!-- Onda 3 (fundo) -->
                <path
                    d="M0 380L26.7 373.3C53.3 366.7 106.7 353.3 160 346.7C213.3 340 266.7 340 320 346.7C373.3 353.3 426.7 366.7 480 373.3C533.3 380 586.7 380 640 373.3C693.3 366.7 746.7 353.3 800 346.7C853.3 340 906.7 340 933.3 340L960 340L960 541L933.3 541C906.7 541 853.3 541 800 541C746.7 541 693.3 541 640 541C586.7 541 533.3 541 480 541C426.7 541 373.3 541 320 541C266.7 541 213.3 541 160 541C106.7 541 53.3 541 26.7 541L0 541Z"
                    class="wave-3"
                    stroke-linecap="round"
                    stroke-linejoin="miter"
                ></path>

                <!-- Onda 2 (meio) -->
                <path
                    d="M0 350L26.7 356.7C53.3 363.3 106.7 376.7 160 383.3C213.3 390 266.7 390 320 383.3C373.3 376.7 426.7 363.3 480 356.7C533.3 350 586.7 350 640 356.7C693.3 363.3 746.7 376.7 800 383.3C853.3 390 906.7 390 933.3 390L960 390L960 541L933.3 541C906.7 541 853.3 541 800 541C746.7 541 693.3 541 640 541C586.7 541 533.3 541 480 541C426.7 541 373.3 541 320 541C266.7 541 213.3 541 160 541C106.7 541 53.3 541 26.7 541L0 541Z"
                    class="wave-2"
                    stroke-linecap="round"
                    stroke-linejoin="miter"
                ></path>

                <!-- Onda 1 (frente) -->
                <path
                    d="M0 331L26.7 321C53.3 311 106.7 291 160 291C213.3 291 266.7 311 320 329.5C373.3 348 426.7 365 480 373.2C533.3 381.3 586.7 380.7 640 373.8C693.3 367 746.7 354 800 341.2C853.3 328.3 906.7 315.7 933.3 309.3L960 303L960 541L933.3 541C906.7 541 853.3 541 800 541C746.7 541 693.3 541 640 541C586.7 541 533.3 541 480 541C426.7 541 373.3 541 320 541C266.7 541 213.3 541 160 541C106.7 541 53.3 541 26.7 541L0 541Z"
                    class="wave-1"
                    stroke-linecap="round"
                    stroke-linejoin="miter"
                ></path>
            </svg>

            <!-- Conteúdo principal -->
            <div class="notfound-content">
                <div class="notfound-icon">
                    <i class="pi pi-compass"></i>
                </div>

                <h1 class="notfound-title">404</h1>

                <h2 class="notfound-subtitle">
                    Ops! Página não encontrada
                </h2>

                <p class="notfound-message">
                    Parece que você se perdeu na floresta digital.<br/>
                    Esta página não existe ou foi movida.
                </p>

                <div class="notfound-actions">
                    <p-button
                        [routerLink]="['/']"
                        label="Voltar para Início"
                        icon="pi pi-home"
                        styleClass="p-button-lg"
                    ></p-button>

                    <p-button
                        [routerLink]="['/app/biomas']"
                        label="Explorar Biomas"
                        icon="pi pi-globe"
                        severity="secondary"
                        styleClass="p-button-lg p-button-outlined"
                    ></p-button>
                </div>

                <div class="notfound-suggestions">
                    <p class="text-sm text-500 mb-3">
                        <i class="pi pi-lightbulb mr-2"></i>
                        Você pode estar procurando por:
                    </p>
                    <div class="suggestion-links">
                        <a [routerLink]="['/app/biomas']" class="suggestion-link">
                            <i class="pi pi-map-marker"></i>
                            Biomas Brasileiros
                        </a>
                        <a [routerLink]="['/']" class="suggestion-link">
                            <i class="pi pi-home"></i>
                            Página Inicial
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .notfound-container {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            overflow: hidden;
        }

        .notfound-background {
            position: fixed;
            left: 0;
            bottom: -10rem;
            min-height: 100vh;
            min-width: 100vw;
            z-index: 0;
        }

        /* Background e ondas com cores do template */
        .notfound-background .bg-base {
            fill: var(--surface-ground);
        }

        /* Onda 1 (frente) - cor primária */
        .notfound-background .wave-1 {
            fill: var(--primary-color);
            opacity: 0.9;
        }

        /* Onda 2 (meio) - cor primária mais clara */
        .notfound-background .wave-2 {
            fill: var(--primary-color);
            opacity: 0.6;
        }

        /* Onda 3 (fundo) - cor primária bem clara */
        .notfound-background .wave-3 {
            fill: var(--primary-color);
            opacity: 0.3;
        }

        /* Dark mode - ajuste de cores */
        :host-context(.app-dark) .notfound-background .wave-1 {
            fill: var(--primary-400);
            opacity: 0.7;
        }

        :host-context(.app-dark) .notfound-background .wave-2 {
            fill: var(--primary-500);
            opacity: 0.5;
        }

        :host-context(.app-dark) .notfound-background .wave-3 {
            fill: var(--primary-600);
            opacity: 0.3;
        }

        .notfound-content {
            position: relative;
            z-index: 10;
            text-align: center;
            max-width: 600px;
            width: 100%;
        }

        .notfound-icon {
            font-size: 5rem;
            color: var(--green-500);
            margin-bottom: 1.5rem;
            animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }

        .notfound-title {
            font-size: 8rem;
            font-weight: 800;
            color: var(--text-color);
            margin: 0 0 1rem 0;
            line-height: 1;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .notfound-subtitle {
            font-size: 2rem;
            font-weight: 600;
            color: var(--text-color);
            margin: 0 0 1rem 0;
        }

        .notfound-message {
            font-size: 1.125rem;
            color: var(--text-color-secondary);
            line-height: 1.6;
            margin: 0 0 2.5rem 0;
        }

        .notfound-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 3rem;
        }

        .notfound-suggestions {
            padding-top: 2rem;
            border-top: 1px solid var(--surface-border);
        }

        .suggestion-links {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        .suggestion-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: var(--surface-card);
            border: 1px solid var(--surface-border);
            border-radius: 8px;
            color: var(--text-color);
            text-decoration: none;
            font-weight: 500;
            transition: all 0.2s;
        }

        .suggestion-link:hover {
            background: var(--surface-hover);
            border-color: var(--green-500);
            color: var(--green-600);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .suggestion-link i {
            font-size: 1.125rem;
        }

        /* Dark mode adjustments */
        :host-context(.app-dark) .notfound-title,
        :host-context(.app-dark) .notfound-subtitle {
            color: var(--surface-0);
        }

        :host-context(.app-dark) .notfound-icon {
            color: var(--green-400);
        }

        :host-context(.app-dark) .suggestion-link:hover {
            color: var(--green-400);
        }

        /* Responsive */
        @media (max-width: 768px) {
            .notfound-container {
                padding: 1rem;
            }

            .notfound-icon {
                font-size: 3rem;
            }

            .notfound-title {
                font-size: 5rem;
            }

            .notfound-subtitle {
                font-size: 1.5rem;
            }

            .notfound-message {
                font-size: 1rem;
            }

            .notfound-actions {
                flex-direction: column;
            }

            .notfound-actions :deep(.p-button) {
                width: 100%;
            }

            .suggestion-links {
                flex-direction: column;
            }

            .suggestion-link {
                width: 100%;
                justify-content: center;
            }
        }

        @media (max-width: 480px) {
            .notfound-title {
                font-size: 4rem;
            }

            .notfound-subtitle {
                font-size: 1.25rem;
            }
        }
    `]
})
export class Notfound {}
