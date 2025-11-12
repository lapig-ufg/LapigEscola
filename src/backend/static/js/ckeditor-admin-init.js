// static/js/ckeditor-admin-init.js

(function() {
    'use strict';

    console.log('🚀 Inicializando MapInsertPlugin no Django Admin...');

    let pluginRegistered = false;

    function registerPlugin() {
        if (pluginRegistered) return;

        // Tenta registrar no CKEditor5 global
        if (window.CKEditor5 && window.CKEditor5.builtinPlugins && window.MapInsertPlugin) {
            if (!window.CKEditor5.builtinPlugins.includes(window.MapInsertPlugin)) {
                window.CKEditor5.builtinPlugins.push(window.MapInsertPlugin);
                console.log('✅ MapInsertPlugin registrado nos builtinPlugins do CKEditor5');
                pluginRegistered = true;
            }
        }

        // Tenta registrar no ClassicEditor
        if (window.ClassicEditor && window.ClassicEditor.builtinPlugins && window.MapInsertPlugin) {
            if (!window.ClassicEditor.builtinPlugins.includes(window.MapInsertPlugin)) {
                window.ClassicEditor.builtinPlugins.push(window.MapInsertPlugin);
                console.log('✅ MapInsertPlugin registrado no ClassicEditor');
                pluginRegistered = true;
            }
        }
    }

    // Função para injetar o plugin em editores já existentes
    function injectIntoExistingEditors() {
        if (!window.editors) return;

        Object.keys(window.editors).forEach(editorId => {
            const editor = window.editors[editorId];
            console.log(`🔍 Verificando editor ${editorId}:`, editor);

            // Verifica se o editor tem o método add do plugins
            if (editor && editor.plugins && typeof editor.plugins.add === 'function') {
                if (!editor.plugins.has('MapInsert')) {
                    try {
                        editor.plugins.add('MapInsert', window.MapInsertPlugin);
                        console.log(`✅ MapInsertPlugin injetado no editor ${editorId}`);
                    } catch (error) {
                        console.warn(`⚠️ Erro ao injetar no editor ${editorId}:`, error);
                    }
                }
            } else {
                console.log(`ℹ️ Editor ${editorId} não tem plugins.add, usando abordagem alternativa`);
                // Abordagem alternativa: recriar o editor
                recreateEditorWithPlugin(editorId);
            }
        });
    }

    // Abordagem alternativa: recriar o editor com o plugin
    function recreateEditorWithPlugin(editorId) {
        const textarea = document.getElementById(editorId);
        if (!textarea) return;

        const configScript = document.getElementById(`${editorId}_script`);
        if (!configScript) return;

        try {
            const config = JSON.parse(configScript.textContent);

            // Adiciona o plugin à configuração
            if (!config.extraPlugins) {
                config.extraPlugins = [];
            }
            config.extraPlugins.push('MapInsert');

            // Atualiza o script de configuração
            configScript.textContent = JSON.stringify(config);
            console.log(`✅ Configuração atualizada para o editor ${editorId}`);
        } catch (error) {
            console.warn(`⚠️ Não foi possível atualizar configuração do editor ${editorId}:`, error);
        }
    }

    // Usa o callback do django-ckeditor-5 para novos editores
    if (window.ckeditorRegisterCallback) {
        window.ckeditorRegisterCallback('*', function(editor, editorId) {
            console.log(`🎯 Novo editor carregado: ${editorId}`);
            registerPlugin();
        });
    }

    // Inicialização principal
    function init() {
        console.log('🔧 Iniciando MapInsertPlugin...');

        // Registra o plugin primeiro
        registerPlugin();

        // Aguarda um pouco e tenta injetar nos editores existentes
        setTimeout(() => {
            injectIntoExistingEditors();
        }, 1000);

        // Tenta novamente após mais tempo (para editores que carregam mais tarde)
        setTimeout(() => {
            if (!pluginRegistered) {
                registerPlugin();
                injectIntoExistingEditors();
            }
        }, 3000);
    }

    // Inicia quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
