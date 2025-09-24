// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },


  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@primevue/nuxt-module'
  ],
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  },

  css: [
    'primeicons/primeicons.css', // Ícones do PrimeVue
    //'~/assets/css/primevue-custom.css' // Suas customizações
  ],
  // Configurações básicas
  ssr: false, // Desativa SSR para modo estático (recomendado)
  nitro: {
    static: true, // Gera arquivos estáticos quando usando 'nuxi generate'
    output: {
      dir: '../backend/nuxt-dist' // Pasta de saída
    }
  },


  // Configurações de roteamento
  app: {
    baseURL: '/', // Base path (importante para assets)
    buildAssetsDir: 'static', // Pasta de assets (deve coincidir com Django)


  },

  // Configurações de desenvolvimento
  devServer: {
    port: 3000 // Porta diferente do Django
  },

  // Configuração da API
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:8183/api/v1/',
      appTitle: process.env.APPTITLE || 'Titulo do app',
      appSubTile: process.env.APPSUBTITLE || '',
      appBaseImage: 'https://s3.lapig.iesa.ufg.br/public/assets/all/imgs/lapignaescola.png'
    }
  }

})
