# 📋 PLAN MAESTRO: VideoTrack Admin Dashboard

**Fecha:** 2025-05-15
**Estado:** En ejecución
**Objetivo:** Login Google + Dashboard Admin + Acortador + PDF Reports + Live Stats

---

## 🎯 FASES DEL PROYECTO

### FASE 0: Reducción del Build (ACTUAL)
- Eliminar ~350 archivos no esenciales del build
- Reducir build time de 45min a <15min
- Mantener archivos localmente (git rm --cached)

### FASE 1: Deploy Exitoso
- Build en Vercel < 15 minutos
- App funcional en producción
- Variables de entorno configuradas

### FASE 2: Login Google + Admin Dashboard
- Google OAuth configurado
- Dashboard de control de links
- CRUD completo de links
- Acortador de URLs funcional

### FASE 3: Estadísticas + PDF Reports
- Live stats con SWR (60s refresh)
- PDF reports con @react-pdf/renderer
- Exportación de datos

---

## 📁 ESTRUCTURA FINAL DEL MVP

```
apps/web/
├── app/
│   ├── [domain]/
│   │   ├── [key]/              # Redirect handler
│   │   ├── notfound/           # 404 page
│   │   └── expired/            # Expired link page
│   ├── (admin)/
│   │   └── admin.dub.co/
│   │       ├── login/          # Admin login
│   │       └── (dashboard)/
│   │           ├── page.tsx    # Admin home
│   │           ├── links/      # Link management
│   │           └── stats/      # Live statistics
│   └── api/
│       ├── auth/[...nextauth]/ # Auth handler
│       ├── links/              # Link CRUD API
│       └── analytics/          # Analytics API
├── lib/
│   ├── auth/                   # Auth config
│   ├── links/                  # Link utilities
│   └── analytics/              # Analytics
└── ui/
    ├── auth/                   # Login components
    ├── links/                  # Link components
    └── analytics/              # Stats components
```

---

## 🔧 DEPENDENCIAS ESENCIALES

### Mantener
- next, react, react-dom
- @prisma/client, @neondatabase/serverless
- next-auth (Google provider)
- swr (data fetching)
- @react-pdf/renderer (reports)
- tailwindcss, lucide-react
- @dub/prisma, @dub/utils, @dub/ui

### Remover Temporalmente
- stripe, @stripe/stripe-js
- @upstash/qstash, @upstash/workflow
- @team-plain/typescript-sdk
- @tiptap/* (editor)
- @boxyhq/saml-jackson
- @veriff/incontext-sdk
- @mendable/firecrawl-js
- @slack/web-api
- svix, dub (SDK)
- @ai-sdk/* (AI features)
- frimousse, unsplash-js
- react-pdf-tailwind (mantener para reports)

---

## 📊 MÉTRICAS DE ÉXITO

| Métrica | Objetivo | Actual |
|---------|----------|--------|
| Build time | < 15 min | 45 min |
| Páginas generadas | < 50 | 282 |
| Tamaño bundle | < 50MB | ~200MB |
| Deploy exitoso | ✅ | ❌ |

---

## 🔄 PLAN DE RE-AGREGACIÓN (POST-MVP)

### Semana 1-2
- Analytics avanzados
- User management
- Domain management

### Semana 3-4
- Partner system (si necesario)
- Payment processing (si necesario)
- Cron jobs selectivos

### Semana 5+
- Integraciones externas
- Fraud detection
- SAML SSO

---

## ⚠️ NOTAS IMPORTANTES

1. **NO eliminar archivos del directorio local**
2. **NO modificar schema.prisma** (solo comentar si es crítico)
3. **Mantener todas las variables de entorno**
4. **Git history preserva todo** (fácil revertir)
5. **Build time es la prioridad #1**
