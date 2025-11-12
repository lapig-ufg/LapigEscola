import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * Interface para eventos customizados do Google Analytics
 */
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

/**
 * Interface para parâmetros de página
 */
export interface PageViewParams {
  page_title?: string;
  page_location?: string;
  page_path?: string;
}

/**
 * Interface para eventos de interação com biomas
 */
export interface BiomaEvent {
  bioma_slug: string;
  bioma_name: string;
  action: 'view' | 'explore' | 'download' | 'share';
}

/**
 * Interface para eventos de interação com temas
 */
export interface TemaEvent {
  bioma_slug: string;
  tema_slug: string;
  tema_name: string;
  action: 'view' | 'interact' | 'filter' | 'export';
}

/**
 * Interface para eventos de interação com mapas
 */
export interface MapEvent {
  action: 'zoom' | 'pan' | 'layer_toggle' | 'measure' | 'print';
  layer_name?: string;
  zoom_level?: number;
  coordinates?: string;
}

/**
 * Interface para eventos de busca
 */
export interface SearchEvent {
  search_term: string;
  results_count?: number;
  filter_applied?: string;
}

/**
 * Serviço de integração com Google Analytics
 * Encapsula todas as interações com gtag.js
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly router = inject(Router);
  private readonly GA_ID = 'G-XRLYBPBSBF';
  private initialized = false;

  constructor() {
    // Aguarda o gtag estar disponível
    this.waitForGtag();
  }

  /**
   * Aguarda o gtag estar disponível (com retry)
   */
  private waitForGtag(): void {
    if (typeof window === 'undefined') {
      console.warn('[Analytics] Window não disponível (SSR?)');
      return;
    }

    const checkGtag = () => {
      if (typeof (window as any).gtag === 'function') {
        this.initialized = true;
        console.log('[Analytics] ✓ Google Analytics inicializado com sucesso');
        return true;
      }
      return false;
    };

    // Tenta imediatamente
    if (checkGtag()) return;

    // Retry após 100ms, 500ms, 1s, 2s
    const delays = [100, 500, 1000, 2000];
    delays.forEach(delay => {
      setTimeout(() => {
        if (!this.initialized && checkGtag()) {
          console.log(`[Analytics] ✓ gtag carregado após ${delay}ms`);
        }
      }, delay);
    });

    // Aviso final se não carregar
    setTimeout(() => {
      if (!this.initialized) {
        console.warn('[Analytics] ⚠ Google Analytics não foi carregado após 3.6s');
      }
    }, 3600);
  }

  /**
   * Inicializa o rastreamento automático de navegação
   * Deve ser chamado no AppComponent ou AppLayout
   */
  initializePageTracking(): void {
    console.log('[Analytics] 🚀 Inicializando rastreamento de páginas...');

    // Aguarda gtag estar disponível antes de configurar tracking
    const setupTracking = () => {
      if (!this.initialized) {
        console.warn('[Analytics] ⏳ Aguardando gtag ficar disponível...');
        setTimeout(setupTracking, 200);
        return;
      }

      console.log('[Analytics] ✓ Configurando tracking de navegação');

      this.router.events
        .pipe(
          filter((event): event is NavigationEnd => event instanceof NavigationEnd)
        )
        .subscribe((event: NavigationEnd) => {
          this.trackPageView({
            page_path: event.urlAfterRedirects,
            page_location: window.location.href,
            page_title: document.title
          });
        });
    };

    setupTracking();
  }

  /**
   * Rastreia visualização de página
   */
  trackPageView(params?: PageViewParams): void {
    if (!this.initialized) {
      console.warn('[Analytics] Tentando rastrear page_view mas gtag não está disponível');
      return;
    }

    try {
      const eventData = {
        page_path: params?.page_path || window.location.pathname,
        page_location: params?.page_location || window.location.href,
        page_title: params?.page_title || document.title
      };

      console.log('[Analytics] 📄 page_view:', eventData.page_path);
      gtag('event', 'page_view', eventData);
    } catch (error) {
      console.error('[Analytics] Erro ao rastrear page view:', error);
    }
  }

  /**
   * Rastreia evento customizado genérico
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.initialized) {
      console.warn('[Analytics] Tentando rastrear evento mas gtag não está disponível:', event.action);
      return;
    }

    try {
      console.log(`[Analytics] 📊 ${event.action}:`, event.category, '-', event.label || '');
      gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      });
    } catch (error) {
      console.error('[Analytics] Erro ao rastrear evento:', error);
    }
  }

  /**
   * Rastreia interação com bioma
   */
  trackBiomaInteraction(event: BiomaEvent): void {
    this.trackEvent({
      action: `bioma_${event.action}`,
      category: 'Biomas',
      label: `${event.bioma_name} (${event.bioma_slug})`
    });
  }

  /**
   * Rastreia interação com tema
   */
  trackTemaInteraction(event: TemaEvent): void {
    this.trackEvent({
      action: `tema_${event.action}`,
      category: 'Temas',
      label: `${event.bioma_slug}/${event.tema_slug} - ${event.tema_name}`
    });
  }

  /**
   * Rastreia interação com mapa
   */
  trackMapInteraction(event: MapEvent): void {
    const label = event.layer_name
      ? `${event.action} - ${event.layer_name}`
      : event.action;

    this.trackEvent({
      action: `map_${event.action}`,
      category: 'Mapas',
      label,
      value: event.zoom_level
    });
  }

  /**
   * Rastreia busca realizada
   */
  trackSearch(event: SearchEvent): void {
    this.trackEvent({
      action: 'search',
      category: 'Busca',
      label: event.search_term,
      value: event.results_count
    });
  }

  /**
   * Rastreia download de conteúdo
   */
  trackDownload(fileName: string, fileType: string, category: string = 'Downloads'): void {
    this.trackEvent({
      action: 'download',
      category,
      label: `${fileName} (${fileType})`
    });
  }

  /**
   * Rastreia compartilhamento de conteúdo
   */
  trackShare(platform: 'facebook' | 'twitter' | 'whatsapp' | 'email' | 'link', contentType: string): void {
    this.trackEvent({
      action: 'share',
      category: 'Compartilhamento',
      label: `${platform} - ${contentType}`
    });
  }

  /**
   * Rastreia clique em link externo
   */
  trackOutboundLink(url: string, label?: string): void {
    this.trackEvent({
      action: 'click',
      category: 'Links Externos',
      label: label || url
    });
  }

  /**
   * Rastreia erros da aplicação
   */
  trackError(errorMessage: string, errorLocation: string, severity: 'low' | 'medium' | 'high' = 'medium'): void {
    this.trackEvent({
      action: 'error',
      category: 'Erros',
      label: `[${severity.toUpperCase()}] ${errorLocation}: ${errorMessage}`
    });
  }

  /**
   * Rastreia tempo gasto em uma página/componente
   */
  trackTiming(category: string, variable: string, timeMs: number, label?: string): void {
    if (!this.initialized) return;

    try {
      gtag('event', 'timing_complete', {
        name: variable,
        value: timeMs,
        event_category: category,
        event_label: label
      });
    } catch (error) {
      console.error('[Analytics] Erro ao rastrear timing:', error);
    }
  }

  /**
   * Define propriedades do usuário (não identificáveis)
   */
  setUserProperties(properties: Record<string, any>): void {
    if (!this.initialized) return;

    try {
      gtag('set', 'user_properties', properties);
    } catch (error) {
      console.error('[Analytics] Erro ao definir user properties:', error);
    }
  }

  /**
   * Rastreia exceções
   */
  trackException(description: string, fatal: boolean = false): void {
    if (!this.initialized) return;

    try {
      gtag('event', 'exception', {
        description,
        fatal
      });
    } catch (error) {
      console.error('[Analytics] Erro ao rastrear exceção:', error);
    }
  }

  /**
   * Rastreia engajamento com vídeos
   */
  trackVideoInteraction(action: 'play' | 'pause' | 'complete' | 'progress', videoTitle: string, progress?: number): void {
    this.trackEvent({
      action: `video_${action}`,
      category: 'Vídeos',
      label: videoTitle,
      value: progress
    });
  }

  /**
   * Rastreia interação com formulários
   */
  trackFormInteraction(action: 'start' | 'submit' | 'error', formName: string, errorMessage?: string): void {
    this.trackEvent({
      action: `form_${action}`,
      category: 'Formulários',
      label: errorMessage ? `${formName} - ${errorMessage}` : formName
    });
  }
}

/**
 * Declaração global do gtag para TypeScript
 */
declare global {
  function gtag(
    command: 'config' | 'set' | 'event',
    targetId: string | object,
    config?: object
  ): void;
}
