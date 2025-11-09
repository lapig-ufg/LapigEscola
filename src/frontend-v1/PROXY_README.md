# Configuração de Proxy - LapigEscola Frontend

## 🎯 Objetivo

Resolver problemas de CORS durante o desenvolvimento, redirecionando requisições da API local para o servidor remoto.

## 📋 Como Funciona

Quando você roda `ng serve`, o proxy intercepta todas as requisições que começam com `/api` e as redireciona para `https://escola.lapig.iesa.ufg.br/api`.

**Exemplo:**
- Requisição do navegador: `http://localhost:4200/api/v1/bioma/list`
- Proxy redireciona para: `https://escola.lapig.iesa.ufg.br/api/v1/bioma/list`

## 🚀 Como Usar

### 1. **Iniciar o servidor de desenvolvimento**

```bash
npm start
# ou
ng serve
```

### 2. **Verificar logs do proxy**

No console onde você rodou `ng serve`, você verá logs como:

```
[PROXY] GET /api/v1/bioma/list -> /api/v1/bioma/list
[PROXY] 200 /api/v1/bioma/list
```

### 3. **Acessar a aplicação**

Abra o navegador em: `http://localhost:4200`

## 🔧 Arquivos de Configuração

### `proxy.conf.js` (Ativo)
Configuração em JavaScript com logs detalhados e controle de headers.

### `proxy.conf.json` (Backup)
Configuração alternativa em JSON (mais simples, mas menos flexível).

### `environment.ts`
```typescript
apiBaseUrl: '/api/v1'  // Usa proxy em desenvolvimento
```

### `environment.prod.ts`
```typescript
apiBaseUrl: 'https://escola.lapig.iesa.ufg.br/api/v1'  // URL direta em produção
```

## ⚠️ Importante

1. **Reiniciar o servidor**: Sempre que alterar o `proxy.conf.js`, você DEVE parar e reiniciar o `ng serve`

   ```bash
   # Pare com Ctrl+C
   # Inicie novamente
   ng serve
   ```

2. **Proxy funciona APENAS em desenvolvimento**: Em produção (`npm run build`), a aplicação usará a URL completa da API.

3. **CORS no backend**: O servidor backend DEVE permitir o domínio de produção nos headers CORS quando você fizer deploy.

## 🐛 Troubleshooting

### Problema: "ERR_CONNECTION_REFUSED"

**Solução:** Verifique se o servidor remoto está acessível:
```bash
curl https://escola.lapig.iesa.ufg.br/api/v1/bioma/list
```

### Problema: Proxy não está funcionando

**Checklist:**
1. ✅ Reiniciou o `ng serve` após alterar o proxy?
2. ✅ O arquivo `proxy.conf.js` está na raiz do projeto frontend?
3. ✅ O `angular.json` aponta para `"proxyConfig": "proxy.conf.js"`?
4. ✅ O `environment.ts` usa `apiBaseUrl: '/api/v1'`?

### Problema: CORS ainda aparece

Isso pode significar que:
- O proxy não está configurado corretamente
- Você esqueceu de reiniciar o servidor
- Há um cache do navegador (tente Ctrl+Shift+R para limpar)

## 📊 Verificar se o Proxy Está Ativo

Abra o DevTools do navegador (F12) → Network → XHR

Você deve ver requisições para:
- `http://localhost:4200/api/v1/...` (URL local)

E NÃO para:
- `https://escola.lapig.iesa.ufg.br/api/v1/...` (URL remota)

Se você vê a URL remota, o proxy NÃO está ativo!

## 🔄 Alternar Entre Proxy e URL Direta

### Usar Proxy (recomendado para desenvolvimento)
- Arquivo: `environment.ts`
- `apiBaseUrl: '/api/v1'`

### Usar URL Direta (bypass do proxy)
- Arquivo: `environment.ts`
- `apiBaseUrl: 'https://escola.lapig.iesa.ufg.br/api/v1'`

**Observação:** Se usar URL direta, você pode ter problemas de CORS caso o backend não permita `http://localhost:4200`.
