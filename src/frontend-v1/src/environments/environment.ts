/**
 * Environment Configuration - Development
 *
 * O proxy está configurado em proxy.conf.json para redirecionar
 * requisições de /api/* para https://escola.lapig.iesa.ufg.br/api/*
 */

export const environment = {
    production: false,
    apiBaseUrl: '/api/v1',
     appTitle: 'LapigEscolaDEV',
    appSubtitle: 'Educação Ambiental e Biomas Brasileiros',
    assetPrefix: '/',
};
