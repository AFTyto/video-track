# 📋 PLAN: Reducción del Build para Vercel

**Objetivo:** Reducir build time de 45min a <15min eliminando ~350 archivos no esenciales.

**Principio:** Archivos se mantienen localmente, solo se remueven del git repo y build.

---

## PASO 1: Crear .vercelignore

**Archivo:** `apps/web/.vercelignore`

Excluir del build de Vercel:
- Partner system completo
- Cron jobs (80+ endpoints)
- Payment processing
- Admin avanzado
- Integraciones externas
- E2E testing
- Mock endpoints

---

## PASO 2: Modificar next.config.mjs

Agregar `outputFileTracingExcludes` para excluir rutas del trace de Next.js.

---

## PASO 3: Git RM --cached

Remover del repo (sin borrar localmente):

### Partner System (~150 archivos)
```
git rm --cached -r apps/web/app/\(ee\)/partners.dub.co
git rm --cached -r apps/web/app/\(ee\)/api/partners
git rm --cached -r apps/web/app/\(ee\)/api/programs
git rm --cached -r apps/web/app/\(ee\)/api/bounties
git rm --cached -r apps/web/app/\(ee\)/api/campaigns
git rm --cached -r apps/web/app/\(ee\)/api/commissions
```

### Cron Jobs (~80 archivos)
```
git rm --cached -r apps/web/app/\(ee\)/api/cron
```

### Payments (~40 archivos)
```
git rm --cached -r apps/web/app/\(ee\)/api/stripe
git rm --cached -r apps/web/app/\(ee\)/api/paypal
git rm --cached -r apps/web/app/\(ee\)/app.dub.co/invoices
```

### Admin Avanzado (~50 archivos)
```
git rm --cached -r apps/web/app/\(ee\)/admin.dub.co/\(dashboard\)/analytics
git rm --cached -r apps/web/app/\(ee\)/admin.dub.co/\(dashboard\)/commissions
git rm --cached -r apps/web/app/\(ee\)/admin.dub.co/\(dashboard\)/partners
git rm --cached -r apps/web/app/\(ee\)/admin.dub.co/\(dashboard\)/payouts
git rm --cached -r apps/web/app/\(ee\)/admin.dub.co/\(dashboard\)/programs
git rm --cached -r apps/web/app/\(ee\)/admin.dub.co/\(dashboard\)/revenue
git rm --cached -r apps/web/app/\(ee\)/admin.dub.co/\(dashboard\)/events
```

### Integraciones (~30 archivos)
```
git rm --cached -r apps/web/app/\(ee\)/api/hubspot
git rm --cached -r apps/web/app/\(ee\)/api/shopify
git rm --cached -r apps/web/app/\(ee\)/api/slack
git rm --cached -r apps/web/app/\(ee\)/api/singular
git rm --cached -r apps/web/app/\(ee\)/api/appsflyer
git rm --cached -r apps/web/app/\(ee\)/api/scim
```

### E2E y Mock (~20 archivos)
```
git rm --cached -r apps/web/app/\(ee\)/api/e2e
git rm --cached -r apps/web/app/\(ee\)/api/mock
```

### Features no esenciales
```
git rm --cached -r apps/web/app/\(ee\)/api/audit-logs
git rm --cached -r apps/web/app/\(ee\)/api/fraud
git rm --cached -r apps/web/app/\(ee\)/api/embed
git rm --cached -r apps/web/app/\(ee\)/api/network
git rm --cached -r apps/web/app/\(ee\)/api/workflows
git rm --cached -r apps/web/app/\(ee\)/api/rewards
git rm --cached -r apps/web/app/\(ee\)/api/groups
git rm --cached -r apps/web/app/\(ee\)/api/discount-codes
git rm --cached -r apps/web/app/\(ee\)/api/email-domains
git rm --cached -r apps/web/app/\(ee\)/api/domains/register
git rm --cached -r apps/web/app/\(ee\)/api/domains/status
git rm --cached -r apps/web/app/\(ee\)/api/messages
git rm --cached -r apps/web/app/\(ee\)/api/customers/export
git rm --cached -r apps/web/app/\(ee\)/api/partner-profile
git rm --cached -r apps/web/app/\(ee\)/api/track
```

---

## PASO 4: Comentar Imports en Archivos Clave

### lib/auth/options.ts
- Comentar SAML provider
- Comentar GitHub provider (opcional)
- Mantener Google y Email

### middleware.ts
- Simplificar rutas protegidas
- Remover checks de partners.dub.co
- Remover checks de admin avanzado

### packages/prisma/schema/schema.prisma
- NO modificar (requiere regenerar cliente)

---

## PASO 5: Commit y Push

```bash
git add -A
git commit -m "chore: Temporarily remove non-essential features for MVP deploy

Removed from git (kept locally):
- Partner/affiliate system (~150 files)
- Cron jobs (~80 files)
- Payment processing (~40 files)
- Advanced admin features (~50 files)
- Third-party integrations (~30 files)
- E2E testing and mock endpoints (~20 files)
- Other non-essential APIs (~50 files)

Total: ~420 files removed from build

Keeping for MVP:
- Link shortening and redirect handling
- Basic analytics and tracking
- Google auth and admin login
- PDF reports generation
- Admin link management dashboard
- Live statistics with SWR

Build time expected: 7-15 minutes (was 45+ minutes)
"
git push
```

---

## PASO 6: Verificar Deploy

1. Push a master trigger deploy automático
2. Monitorear build logs
3. Verificar build time < 15 min
4. Verificar app funcional

---

## REVERTIR (si es necesario)

```bash
# Restaurar un directorio específico
git checkout HEAD~1 -- apps/web/app/\(ee\)/partners.dub.co
git commit -m "revert: Restore partner system"
git push
```

---

## ESTIMACIÓN

| Categoría | Archivos | Build Time Reduction |
|-----------|----------|---------------------|
| Partner system | ~150 | -15 min |
| Cron jobs | ~80 | -10 min |
| Payments | ~40 | -5 min |
| Admin avanzado | ~50 | -5 min |
| Integraciones | ~30 | -3 min |
| E2E/Mock | ~20 | -2 min |
| Otros | ~50 | -5 min |
| **TOTAL** | **~420** | **-45 min** |

**Build time estimado:** 5-10 minutos ✅
