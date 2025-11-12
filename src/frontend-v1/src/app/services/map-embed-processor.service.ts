// src/app/services/map-embed-processor.service.ts
import { Injectable, ComponentFactoryResolver, ViewContainerRef, ComponentRef, inject, ApplicationRef, EmbeddedViewRef } from '@angular/core';
import { DynamicMapComponent } from '@/components/dynamic-map/dynamic-map.component';

@Injectable({
  providedIn: 'root'
})
export class MapEmbedProcessorService {
  private readonly appRef = inject(ApplicationRef);
  private activeComponents: ComponentRef<DynamicMapComponent>[] = [];

  /**
   * Processa elementos .map-embed no DOM e os substitui por componentes Angular
   */
  processMapEmbeds(container: HTMLElement = document.body): void {
    console.log('🗺️ Processando elementos .map-embed...');

    // Limpa componentes anteriores
    this.cleanupComponents();

    // Encontra todos os elementos .map-embed
    const mapEmbeds = container.querySelectorAll('.map-embed');

    console.log(`📍 Encontrados ${mapEmbeds.length} elementos .map-embed`);

    mapEmbeds.forEach((embed, index) => {
      this.processMapEmbed(embed as HTMLElement, index);
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
      const mapTitle = element.getAttribute('data-map-title');
      const showHeader = element.getAttribute('data-show-header') !== 'false';
      const height = element.getAttribute('data-height');

      console.log(`📍 Processando mapa ${index + 1}:`, {
        slug: mapSlug,
        id: mapId,
        title: mapTitle,
        showHeader,
        height
      });

      // Cria componente Angular dinamicamente
      const componentRef = this.createDynamicMapComponent({
        mapSlug: mapSlug || undefined,
        mapId: mapId ? parseInt(mapId) : undefined,
        showHeader,
        height: height || undefined
      });

      if (componentRef) {
        // Substitui elemento HTML pelo componente Angular
        const componentElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0];
        element.parentNode?.replaceChild(componentElement, element);

        // Armazena referência para limpeza posterior
        this.activeComponents.push(componentRef);

        console.log(`✅ Mapa ${index + 1} renderizado com sucesso`);
      }

    } catch (error) {
      console.error(`❌ Erro ao processar mapa ${index + 1}:`, error);
    }
  }

  /**
   * Cria componente DynamicMapComponent dinamicamente
   */
  private createDynamicMapComponent(inputs: {
    mapSlug?: string;
    mapId?: number;
    showHeader?: boolean;
    height?: string;
  }): ComponentRef<DynamicMapComponent> | null {
    try {
      // Cria component ref
      const componentRef = this.appRef.bootstrap(DynamicMapComponent);

      // Define inputs
      if (inputs.mapSlug !== undefined) {
        componentRef.instance.mapSlug = inputs.mapSlug;
      }
      if (inputs.mapId !== undefined) {
        componentRef.instance.mapId = inputs.mapId;
      }
      if (inputs.showHeader !== undefined) {
        componentRef.instance.showHeader = inputs.showHeader;
      }
      if (inputs.height !== undefined) {
        componentRef.instance.height = inputs.height;
      }

      // Detecta mudanças
      componentRef.changeDetectorRef.detectChanges();

      return componentRef;

    } catch (error) {
      console.error('❌ Erro ao criar componente dinâmico:', error);
      return null;
    }
  }

  /**
   * Limpa componentes criados dinamicamente
   */
  private cleanupComponents(): void {
    this.activeComponents.forEach(componentRef => {
      try {
        componentRef.destroy();
      } catch (error) {
        console.warn('⚠️ Erro ao destruir componente:', error);
      }
    });
    this.activeComponents = [];
  }

  /**
   * Observa mudanças no DOM para processar novos elementos .map-embed
   */
  observeMapEmbeds(container: HTMLElement = document.body): MutationObserver {
    const observer = new MutationObserver((mutations) => {
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
        console.log('🔄 Novos elementos .map-embed detectados, processando...');
        setTimeout(() => this.processMapEmbeds(container), 100);
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true
    });

    console.log('👀 Observer de .map-embed ativo');
    return observer;
  }

  /**
   * Destrói todos os componentes e limpa recursos
   */
  destroy(): void {
    this.cleanupComponents();
  }
}