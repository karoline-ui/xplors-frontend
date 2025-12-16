# 🎨 Xplors Frontend - Design Profissional

Frontend moderno e responsivo do sistema Xplors de análise de documentos com IA.

## ✨ Features

- 🎯 **Login com bolinhas animadas** - Design único e moderno
- 📊 **Dashboard profissional** - Gráficos interativos com Recharts
- ⬆️ **Upload drag & drop** - Interface intuitiva
- 📜 **Histórico com tabela** - Visualização organizada
- ⚙️ **Configurações completas** - Perfil, notificações, segurança, tema
- 🎨 **Design roxo/ciano** - Cores da marca Xplors
- 📱 **Totalmente responsivo** - Funciona em todos os dispositivos

## 🚀 Instalação Rápida

### 1. Instalar dependências:

```bash
npm install
```

### 2. Configurar variáveis de ambiente:

```bash
cp .env.local.example .env.local
```

### 3. Rodar em desenvolvimento:

```bash
npm run dev
```

Acesse: http://localhost:3000

## 📦 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos interativos
- **Lucide React** - Ícones modernos
- **Supabase** - Backend e autenticação
- **Framer Motion** - Animações

## 🎨 Páginas

### Login (`/`)
- Bolinhas flutuantes animadas
- Gradiente roxo/azul/ciano
- Form moderno com validação
- Toggle mostrar/esconder senha
- Link para criar conta

### Dashboard (`/dashboard`)
- 4 cards de estatísticas
- Gráfico de área (análises ao longo do tempo)
- Gráfico de pizza (tipos de documento)
- Documentos recentes
- CTA para novo upload

### Upload (`/upload`)
- Drag & drop area
- Validação de arquivo
- Barra de progresso animada
- Feedback visual
- Cards explicativos

### Histórico (`/historico`)
- Tabela profissional
- Busca e filtros
- Stats cards
- Ações (ver, download, excluir)

### Configurações (`/configuracoes`)
- Perfil (nome, email)
- Notificações (toggles)
- Segurança (senha, 2FA)
- Aparência (tema claro/escuro/sistema)

## 🎨 Cores

```css
Primary (Roxo): #8b5cf6
Secondary (Ciano): #14b8a6
Dark: #1e1b4b
```

## 📱 Responsividade

- **Desktop**: Layout completo com sidebar
- **Tablet**: Layout adaptado
- **Mobile**: Hamburger menu

## 🔧 Estrutura

```
src/
├── app/
│   ├── page.tsx              # Login
│   ├── dashboard/            # Dashboard
│   ├── upload/               # Upload
│   ├── historico/            # Histórico
│   ├── configuracoes/        # Configurações
│   ├── layout.tsx            # Layout principal
│   └── globals.css           # Estilos globais
├── components/
│   └── Sidebar.tsx           # Sidebar roxa
└── lib/
    ├── supabase.ts           # Cliente Supabase
    └── api.ts                # Helper API
```

## 🚀 Deploy

### Vercel (Recomendado):

```bash
npm run build
vercel --prod
```

### Outras plataformas:

```bash
npm run build
npm start
```

## ✅ Checklist

- [x] Login com bolinhas animadas
- [x] Dashboard com gráficos
- [x] Upload drag & drop
- [x] Histórico com tabela
- [x] Configurações completas
- [x] Sidebar responsiva
- [x] Tema claro/escuro
- [x] Animações suaves
- [x] Integração Supabase
- [x] Integração Backend

## 📞 Suporte

Desenvolvido com ❤️ por Claude

---

**Pronto para impressionar! 🎉**
