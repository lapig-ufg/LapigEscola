// static/js/ckeditor-map-plugin.js

import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';
import { toWidget } from '@ckeditor/ckeditor5-widget';

export default class MapInsertPlugin extends Plugin {
    static get requires() {
        return ['Widget'];
    }

    static get pluginName() {
        return 'MapInsert';
    }

    init() {
        console.log('🗺️ MapInsertPlugin inicializado!');

        const editor = this.editor;

        this._defineSchema();
        this._defineConverters();
        this._defineUI();
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('mapEmbed', {
            inheritAllFrom: '$blockObject',
            allowAttributes: ['mapSlug', 'mapId', 'mapTitle', 'showHeader', 'height']
        });
    }

    _defineConverters() {
        const editor = this.editor;
        const conversion = editor.conversion;

        // Upcast: HTML -> Model
        conversion.for('upcast').elementToElement({
            view: {
                name: 'div',
                classes: 'map-embed'
            },
            model: (viewElement, { writer }) => {
                return writer.createElement('mapEmbed', {
                    mapSlug: viewElement.getAttribute('data-map-slug') || '',
                    mapId: viewElement.getAttribute('data-map-id') || '',
                    mapTitle: viewElement.getAttribute('data-map-title') || '',
                    showHeader: viewElement.getAttribute('data-show-header') !== 'false',
                    height: viewElement.getAttribute('data-height') || ''
                });
            }
        });

        // Downcast: Model -> Data
        conversion.for('dataDowncast').elementToElement({
            model: 'mapEmbed',
            view: (modelElement, { writer }) => {
                const attrs = { class: 'map-embed' };

                const mapSlug = modelElement.getAttribute('mapSlug');
                const mapId = modelElement.getAttribute('mapId');
                const mapTitle = modelElement.getAttribute('mapTitle');
                const showHeader = modelElement.getAttribute('showHeader');
                const height = modelElement.getAttribute('height');

                if (mapSlug) attrs['data-map-slug'] = mapSlug;
                if (mapId) attrs['data-map-id'] = mapId;
                if (mapTitle) attrs['data-map-title'] = mapTitle;
                if (showHeader === false) attrs['data-show-header'] = 'false';
                if (height) attrs['data-height'] = height;

                return writer.createContainerElement('div', attrs);
            }
        });

        // Downcast: Model -> Editing
        conversion.for('editingDowncast').elementToElement({
            model: 'mapEmbed',
            view: (modelElement, { writer }) => {
                const mapTitle = modelElement.getAttribute('mapTitle') || 'Mapa';
                const mapSlug = modelElement.getAttribute('mapSlug');
                const mapId = modelElement.getAttribute('mapId');

                const container = writer.createContainerElement('div', {
                    class: 'ck-map-embed-preview'
                });

                const iconWrapper = writer.createContainerElement('div', {
                    class: 'ck-map-icon'
                });
                writer.insert(writer.createPositionAt(iconWrapper, 0), writer.createText('🗺️'));

                const titleElement = writer.createContainerElement('div', {
                    class: 'ck-map-title'
                });
                writer.insert(writer.createPositionAt(titleElement, 0), writer.createText(mapTitle));

                const idElement = writer.createContainerElement('div', {
                    class: 'ck-map-id'
                });
                const idText = mapSlug || (mapId ? `ID: ${mapId}` : 'Sem identificador');
                writer.insert(writer.createPositionAt(idElement, 0), writer.createText(idText));

                writer.insert(writer.createPositionAt(container, 0), iconWrapper);
                writer.insert(writer.createPositionAt(container, 1), titleElement);
                writer.insert(writer.createPositionAt(container, 2), idElement);

                return toWidget(container, writer, { label: 'Mapa incorporado' });
            }
        });
    }

    _defineUI() {
        const editor = this.editor;

        editor.ui.componentFactory.add('insertMap', locale => {
            const buttonView = new ButtonView(locale);

            buttonView.set({
                label: 'Inserir Mapa',
                icon: `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L20 6v9l-8 5-8-5V6z" fill="none" stroke="currentColor" stroke-width="1.5"/>
                    <circle cx="10" cy="10" r="2" fill="currentColor"/>
                </svg>`,
                tooltip: true
            });

            buttonView.on('execute', () => {
                this._showMapDialog();
            });

            return buttonView;
        });
    }

    async _showMapDialog() {
        try {
            const response = await fetch('/api/v1/maps/list-for-editor');
            if (!response.ok) throw new Error('Erro ao carregar mapas');

            const maps = await response.json();
            if (!maps || maps.length === 0) {
                alert('Nenhum mapa disponível no momento.');
                return;
            }

            const result = await this._createMapSelectionModal(maps);
            if (result) {
                this._insertMap(result.slug, result.id, result.titulo, result.showHeader, result.height);
            }
        } catch (error) {
            console.error('Erro ao carregar mapas:', error);
            alert('Erro ao carregar lista de mapas disponíveis');
        }
    }

    _createMapSelectionModal(maps) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'ck-map-modal-overlay';

            const modal = document.createElement('div');
            modal.className = 'ck-map-modal';
            modal.innerHTML = `
                <div class="ck-map-modal-header">
                    <h3>Selecionar Mapa</h3>
                    <button class="ck-map-modal-close" type="button" aria-label="Fechar">&times;</button>
                </div>
                <div class="ck-map-modal-body">
                    <div class="ck-map-search">
                        <input type="text" placeholder="Buscar mapa..." id="mapSearchInput">
                    </div>
                    <div class="ck-map-list" id="mapList"></div>
                </div>
                <div class="ck-map-modal-footer">
                    <div class="ck-map-options">
                        <label>
                            <input type="checkbox" id="showHeaderCheckbox" checked>
                            Mostrar cabeçalho
                        </label>
                        <div class="ck-map-height">
                            <label for="mapHeight">Altura:</label>
                            <input type="text" id="mapHeight" placeholder="ex: 400px">
                        </div>
                    </div>
                    <button type="button" class="ck-map-modal-cancel">Cancelar</button>
                </div>
            `;

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            const mapList = modal.querySelector('#mapList');
            const renderMaps = (filteredMaps) => {
                mapList.innerHTML = filteredMaps.map(map => `
                    <div class="ck-map-item" data-slug="${map.slug}" data-id="${map.id}" data-title="${this._escapeHtml(map.titulo)}">
                        <div class="ck-map-item-icon">🗺️</div>
                        <div class="ck-map-item-content">
                            <div class="ck-map-item-title">${this._escapeHtml(map.titulo)}</div>
                            <div class="ck-map-item-meta">
                                <span class="ck-map-item-slug">${this._escapeHtml(map.slug)}</span>
                                ${map.layers_count ? `<span class="ck-map-item-layers">${map.layers_count} camadas</span>` : ''}
                            </div>
                            ${map.descricao ? `<div class="ck-map-item-desc">${this._escapeHtml(map.descricao)}</div>` : ''}
                        </div>
                    </div>
                `).join('');

                mapList.querySelectorAll('.ck-map-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const showHeader = modal.querySelector('#showHeaderCheckbox').checked;
                        const height = modal.querySelector('#mapHeight').value.trim();

                        resolve({
                            slug: item.dataset.slug,
                            id: item.dataset.id,
                            titulo: item.dataset.title,
                            showHeader: showHeader,
                            height: height || null
                        });
                        document.body.removeChild(overlay);
                    });
                });
            };

            renderMaps(maps);

            const searchInput = modal.querySelector('#mapSearchInput');
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = maps.filter(map =>
                    map.titulo.toLowerCase().includes(term) ||
                    map.slug.toLowerCase().includes(term) ||
                    (map.descricao && map.descricao.toLowerCase().includes(term))
                );
                renderMaps(filtered);
            });

            const close = () => {
                document.body.removeChild(overlay);
                resolve(null);
            };

            modal.querySelector('.ck-map-modal-close').addEventListener('click', close);
            modal.querySelector('.ck-map-modal-cancel').addEventListener('click', close);
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) close();
            });
        });
    }

    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    _insertMap(mapSlug, mapId, mapTitle, showHeader, height) {
        const editor = this.editor;

        editor.model.change(writer => {
            const attributes = {
                mapSlug: mapSlug || '',
                mapId: mapId || '',
                mapTitle: mapTitle || 'Mapa',
                showHeader: showHeader
            };

            if (height) {
                attributes.height = height;
            }

            const mapEmbed = writer.createElement('mapEmbed', attributes);
            editor.model.insertContent(mapEmbed, editor.model.document.selection);
        });
    }
}
