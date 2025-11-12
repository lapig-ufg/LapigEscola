// src/app/directives/map-embed.directive.ts
import {
  Directive,
  ElementRef,
  OnInit,
  OnDestroy,
  inject,
  ViewContainerRef,
  ComponentRef,
  Renderer2,
  AfterViewInit
} from '@angular/core';
import { DynamicMapComponent } from '@/components/dynamic-map/dynamic-map.component';

@Directive({
  selector: '[appMapEmbed]',
  standalone: true
})
export class MapEmbedDirective implements OnInit, OnDestroy, AfterViewInit {
  private readonly el = inject(ElementRef);
  private readonly vcr = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);

  private mapComponent?: ComponentRef<DynamicMapComponent>;
  private observer?: MutationObserver;

  ngOnInit(): void {
    console.log('🗺️ MapEmbedDirective inicializada');
  }

  ngAfterViewInit(): void {
    // Processa elementos existentes
    setTimeout(() => {
      this.processMapEmbeds();
      this.observeChanges();
    }, 100);
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  /**
   * Processa todos os elementos .map-embed no container
   */
  private processMapEmbeds(): void {
    const container = this.el.nativeElement;
    const mapEmbeds = container.querySelectorAll('.map-embed');

    console.log(`📍 Processando ${mapEmbeds.length} elementos .map-embed`);

    mapEmbeds.forEach((embed: HTMLElement, index: number) => {
      this.processMapEmbed(embed, index);
    });
  }

  /**
   * Processa um elemento .map-embed individual
   */
  private processMapEmbed(element: HTMLElement, index: number): void {
    try {
      // Extrai dados do elemento
      const mapSlug = element.getAttribute('data-map-slug');
      const mapId = element.getAttribute('data-map-id');
      const showHeader = element.getAttribute('data-show-header') !== 'false';
      const height = element.getAttribute('data-height');
      const headerTheme = element.getAttribute('data-header-theme') || 'primary';

      console.log(`📍 Criando mapa dinâmico ${index + 1}:`, {
        slug: mapSlug,
        id: mapId,
        showHeader,
        height,
        headerTheme
      });

      // Cria wrapper para o componente Angular
      const wrapper = this.renderer.createElement('div');
      this.renderer.addClass(wrapper, 'dynamic-map-wrapper-generated');

      // Preserva classes de alinhamento do elemento original
      const classList = element.classList;
      if (classList.contains('align-left')) {
        this.renderer.addClass(wrapper, 'align-left');
      }
      if (classList.contains('align-right')) {
        this.renderer.addClass(wrapper, 'align-right');
      }
      if (classList.contains('align-center')) {
        this.renderer.addClass(wrapper, 'align-center');
      }

      // Cria componente Angular
      const componentRef = this.vcr.createComponent(DynamicMapComponent);

      // Define inputs
      if (mapSlug) componentRef.instance.mapSlug = mapSlug;
      if (mapId) componentRef.instance.mapId = parseInt(mapId);
      componentRef.instance.showHeader = showHeader;
      if (height) componentRef.instance.height = height;
      componentRef.instance.headerTheme = headerTheme as any;

      // Anexa componente ao wrapper
      this.renderer.appendChild(wrapper, componentRef.location.nativeElement);

      // Substitui elemento original pelo wrapper
      this.renderer.insertBefore(
        element.parentNode,
        wrapper,
        element
      );
      this.renderer.removeChild(element.parentNode, element);

      // Detecta mudanças
      componentRef.changeDetectorRef.detectChanges();

      console.log(`✅ Mapa ${index + 1} renderizado com sucesso`);

    } catch (error) {
      console.error(`❌ Erro ao processar mapa ${index + 1}:`, error);

      // Fallback: mostra informações básicas
      this.createFallbackMapDisplay(element, index);
    }
  }

  /**
   * Cria display de fallback quando há erro na renderização
   */
  private createFallbackMapDisplay(element: HTMLElement, index: number): void {
    const mapTitle = element.getAttribute('data-map-title') || 'Mapa';
    const mapSlug = element.getAttribute('data-map-slug') || '';

    const fallback = this.renderer.createElement('div');
    this.renderer.addClass(fallback, 'map-fallback');
    this.renderer.setStyle(fallback, 'padding', '20px');
    this.renderer.setStyle(fallback, 'border', '2px dashed #ccc');
    this.renderer.setStyle(fallback, 'border-radius', '8px');
    this.renderer.setStyle(fallback, 'text-align', 'center');
    this.renderer.setStyle(fallback, 'color', '#666');
    this.renderer.setStyle(fallback, 'margin', '20px 0');

    fallback.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 10px;">🗺️</div>
      <h3 style="margin: 0 0 5px 0; color: #333;">${mapTitle}</h3>
      <p style="margin: 0; font-size: 14px;">Slug: ${mapSlug}</p>
      <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
        Mapa será carregado quando a página for totalmente processada
      </p>
    `;

    this.renderer.insertBefore(
      element.parentNode,
      fallback,
      element
    );
    this.renderer.removeChild(element.parentNode, element);
  }

  /**
   * Observa mudanças no DOM para novos elementos .map-embed
   */
  private observeChanges(): void {
    this.observer = new MutationObserver((mutations) => {
      let shouldProcess = false;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            if (element.classList?.contains('map-embed') ||
                element.querySelector?.('.map-embed')) {
              shouldProcess = true;
            }
          }
        });
      });

      if (shouldProcess) {
        console.log('🔄 Novos elementos .map-embed detectados');
        setTimeout(() => this.processMapEmbeds(), 200);
      }
    });

    this.observer.observe(this.el.nativeElement, {
      childList: true,
      subtree: true
    });

    console.log('👀 Observer de mudanças ativo');
  }

  /**
   * Limpa recursos
   */
  private cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
    }

    if (this.mapComponent) {
      this.mapComponent.destroy();
    }

    console.log('🧹 MapEmbedDirective destruída');
  }
}