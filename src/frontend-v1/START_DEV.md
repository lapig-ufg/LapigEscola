# 🚀 Guia Rápido - Iniciar Desenvolvimento

## ⚡ Comandos Essenciais

### 1. **Parar o servidor atual** (se estiver rodando)
```bash
# Pressione Ctrl+C no terminal onde o ng serve está rodando
```

### 2. **Limpar cache do navegador**
```bash
# No navegador: Ctrl+Shift+Delete ou Ctrl+Shift+R
```

### 3. **Iniciar servidor com proxy**
```bash
cd /home/tharles/projects_lapig/LapigEscola/src/frontend-v1
npm start
```

### 4. **Verificar se proxy está ativo**
Você deve ver logs no terminal como:
```
[PROXY] GET /api/v1/bioma/list -> /api/v1/bioma/list
[PROXY] 200 /api/v1/bioma/list
```

### 5. **Abrir navegador**
```
http://localhost:4200
```

## ✅ Checklist de Verificação

Antes de começar, certifique-se:

- [x] `proxy.conf.js` existe na raiz do projeto ✅
- [x] `angular.json` aponta para `proxy.conf.js` ✅
- [x] `environment.ts` usa `apiBaseUrl: '/api/v1'` ✅
- [ ] **Servidor ng serve foi REINICIADO após as mudanças** ⚠️

## 🔍 Como Verificar se Proxy Está Funcionando

### No Terminal:
Procure por linhas como:
```
[PROXY] GET /api/v1/pages/get/home -> /api/v1/pages/get/home
[PROXY] 200 /api/v1/pages/get/home
```

### No DevTools (F12 → Network → XHR):
- ✅ **CORRETO:** `http://localhost:4200/api/v1/bioma/list`
- ❌ **ERRADO:** `https://escola.lapig.iesa.ufg.br/api/v1/bioma/list`

Se você vê a URL `escola.lapig.iesa.ufg.br`, o proxy NÃO está ativo!

## 🐛 Se Ainda Não Funcionar

### Opção 1: Reiniciar tudo
```bash
# 1. Pare o servidor (Ctrl+C)
# 2. Limpe node_modules (opcional)
rm -rf node_modules/.cache

# 3. Inicie novamente
npm start
```

### Opção 2: Verificar porta
Se a porta 4200 estiver ocupada:
```bash
# Especificar porta diferente
ng serve --port 4300
```

### Opção 3: Modo verbose
```bash
# Ver todos os logs
ng serve --verbose
```

## 📋 Resumo da Configuração

| Arquivo | Configuração | Status |
|---------|--------------|--------|
| `proxy.conf.js` | Proxy ativo com logs | ✅ Criado |
| `angular.json` | Aponta para proxy.conf.js | ✅ Configurado |
| `environment.ts` | apiBaseUrl: '/api/v1' | ✅ Configurado |
| `environment.prod.ts` | URL completa da API | ✅ Configurado |

## 🎯 Próximos Passos

1. **REINICIAR** o servidor ng serve
2. Abrir `http://localhost:4200`
3. Verificar Network tab no DevTools
4. Se funcionar: começar a desenvolver! 🎉
5. Se não funcionar: verificar checklist acima

---

**💡 Dica:** Sempre que alterar arquivos de configuração (proxy, angular.json, tsconfig), **REINICIE** o servidor!
