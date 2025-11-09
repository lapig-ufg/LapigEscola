/**
 * Bioma Content Component
 * Container com tabs dinâmicas para exibir diferentes tipos de conteúdo de um tema
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface TabConfig {
  header: string;
  value: string;
  content: any;
  visible: boolean;
}

@Component({
  selector: 'app-bioma-content',
  standalone: true,
  imports: [CommonModule, Tabs, TabList, Tab, TabPanels, TabPanel],
  template: `
    <p-tabs *ngIf="visibleTabs.length > 0" [(value)]="activeTab">
      <p-tablist>
        <p-tab *ngFor="let tab of visibleTabs" [value]="tab.value">
          {{ tab.header }}
        </p-tab>
      </p-tablist>

      <p-tabpanels>
        <p-tabpanel *ngIf="hasConteudo" value="conteudo">
          <div class="content-wrapper" [innerHTML]="textoContent"></div>
        </p-tabpanel>

        <p-tabpanel *ngIf="hasImagens" value="imagens">
          <ng-content select="[slot='imagens']"></ng-content>
        </p-tabpanel>

        <p-tabpanel *ngIf="hasVideos" value="videos">
          <ng-content select="[slot='videos']"></ng-content>
        </p-tabpanel>

        <p-tabpanel *ngIf="hasCuriosidades" value="curiosidades">
          <ng-content select="[slot='curiosidades']"></ng-content>
        </p-tabpanel>

        <p-tabpanel *ngIf="hasPedagogia" value="pedagogia">
          <ng-content select="[slot='pedagogia']"></ng-content>
        </p-tabpanel>
      </p-tabpanels>
    </p-tabs>

    <div *ngIf="visibleTabs.length === 0" class="no-content-message">
      <i class="pi pi-info-circle text-4xl text-400"></i>
      <p class="text-600 mt-3">Nenhum conteúdo disponível para este tema.</p>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    /* Estilos do CKEditor 5 estão definidos globalmente em styles.scss */
    /* Mantido apenas o estilo específico deste componente */

    .no-content-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }
  `]
})
export class BiomaContentComponent implements OnChanges {
  @Input() texto?: string;
  @Input() imagensContent?: any;
  @Input() videosContent?: any;
  @Input() curiosidadesContent?: any;
  @Input() pedagogiaContent?: any;

  textoContent?: SafeHtml;
  visibleTabs: TabConfig[] = [];
  activeTab = 'conteudo';

  get hasConteudo(): boolean {
    return !!this.texto;
  }

  get hasImagens(): boolean {
    return !!this.imagensContent;
  }

  get hasVideos(): boolean {
    return !!this.videosContent;
  }

  get hasCuriosidades(): boolean {
    return !!this.curiosidadesContent;
  }

  get hasPedagogia(): boolean {
    return !!this.pedagogiaContent;
  }

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['texto'] && this.texto) {
      this.textoContent = this.sanitizer.bypassSecurityTrustHtml(this.texto);
    }

    this.updateVisibleTabs();
  }

  private updateVisibleTabs(): void {
    const allTabs: TabConfig[] = [
      {
        header: 'Conteúdo',
        value: 'conteudo',
        content: this.textoContent,
        visible: this.hasConteudo
      },
      {
        header: 'Imagens',
        value: 'imagens',
        content: this.imagensContent,
        visible: this.hasImagens
      },
      {
        header: 'Vídeos',
        value: 'videos',
        content: this.videosContent,
        visible: this.hasVideos
      },
      {
        header: 'Curiosidades',
        value: 'curiosidades',
        content: this.curiosidadesContent,
        visible: this.hasCuriosidades
      },
      {
        header: 'Recursos Pedagógicos',
        value: 'pedagogia',
        content: this.pedagogiaContent,
        visible: this.hasPedagogia
      }
    ];

    this.visibleTabs = allTabs.filter(tab => tab.visible);

    // Define primeira tab visível como ativa
    if (this.visibleTabs.length > 0) {
      this.activeTab = this.visibleTabs[0].value;
    }
  }
}
