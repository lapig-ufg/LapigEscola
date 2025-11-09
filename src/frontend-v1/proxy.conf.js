/**
 * Proxy Configuration para desenvolvimento
 *
 * Redireciona requisições de /api/* para https://escola.lapig.iesa.ufg.br/api/*
 * Resolve problemas de CORS durante o desenvolvimento
 */

const PROXY_CONFIG = {
  "/api": {
    target: "https://escola.lapig.iesa.ufg.br",
    secure: true,
    changeOrigin: true,
    logLevel: "debug",
    headers: {
      "Origin": "https://escola.lapig.iesa.ufg.br",
      "Referer": "https://escola.lapig.iesa.ufg.br/"
    },
    onProxyReq: function(proxyReq, req, res) {
      console.log(`[PROXY] ${req.method} ${req.url} -> ${proxyReq.path}`);
    },
    onProxyRes: function(proxyRes, req, res) {
      console.log(`[PROXY] ${proxyRes.statusCode} ${req.url}`);
    },
    onError: function(err, req, res) {
      console.error('[PROXY ERROR]', err);
    }
  }
};

module.exports = PROXY_CONFIG;
