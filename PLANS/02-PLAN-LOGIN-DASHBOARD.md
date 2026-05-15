# 📋 PLAN: Login Google + Admin Dashboard + Acortador

**Estética:** Inspiria Studios (Dark studio, neon green #00FF99, minimal depth via borders)

---

## 🎨 BRAND GUIDELINES - INSPIRIA STUDIOS

### Paleta de Colores
```css
--bg-primary: #0A0A0A        /* Fondo principal */
--bg-secondary: #141414      /* Cards, modals */
--bg-tertiary: #1A1A1A       /* Inputs, hover */
--border: #2A2A2A            /* Bordes sutiles */
--accent: #00FF99            /* Neon green - acentos */
--accent-hover: #00CC7A      /* Hover state */
--text-primary: #FFFFFF      /* Texto principal */
--text-secondary: #A0A0A0    /* Texto secundario */
--text-muted: #666666        /* Texto muted */
--error: #FF4444             /* Errores */
--success: #00FF99           /* Éxito (mismo que accent) */
--warning: #FFB800           /* Advertencias */
```

### Tipografía
- **Display:** Inter o Geist (sans-serif)
- **Body:** Inter, 14px base
- **Monospace:** JetBrains Mono (códigos, slugs)

### Estilo Visual
- Dark studio aesthetic
- Minimal depth (bordes, no sombras)
- Neon accent green (#00FF99)
- Flat design con bordes sutiles
- Hover states con glow sutil

---

## 🔐 PARTE 1: LOGIN GOOGLE ADMIN

### 1.1 Configurar Google Cloud Console

**Pasos:**
1. Ir a https://console.cloud.google.com/
2. Crear proyecto "VideoTrack Admin"
3. APIs & Services → Credentials
4. Create OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs:
   - `http://localhost:8888/api/auth/callback/google` (dev)
   - `https://TU-DOMAIN.vercel.app/api/auth/callback/google` (prod)
7. Copiar CLIENT_ID y CLIENT_SECRET

### 1.2 Variables de Entorno

**Archivo:** `apps/web/.env.local`

```env
# Google OAuth
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret

# NextAuth
NEXTAUTH_SECRET=generar-con-node-e-console.log-require('crypto').randomBytes(32).toString('base64')
NEXTAUTH_URL=http://localhost:8888

# Admin
DUB_WORKSPACE_ID=admin-workspace-id
```

### 1.3 Restricción de Dominio (Opcional)

**Archivo:** `lib/auth/options.ts`

```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  allowDangerousEmailAccountLinking: true,
  // Restringir a dominio específico
  authorization: {
    params: { hd: 'inspiria.studios' } // Solo @inspiria.studios
  }
})
```

### 1.4 Crear Usuario Admin Inicial

**Script SQL (Neon Console):**
```sql
-- Insertar usuario
INSERT INTO "User" (id, name, email, "emailVerified", "createdAt")
VALUES (gen_random_uuid()::text, 'Admin Inspiria', 'admin@inspiria.studios', NOW(), NOW());

-- Obtener el ID generado
SELECT id FROM "User" WHERE email = 'admin@inspiria.studios';

-- Insertar cuenta Google (después del primer login)
-- El Account se crea automáticamente con NextAuth
```

---

## 🎛️ PARTE 2: ADMIN DASHBOARD

### 2.1 Estructura de Rutas

```
app/(admin)/admin.dub.co/
├── layout.tsx                    # Layout con sidebar
├── page.tsx                      # Home dashboard
├── links/
│   ├── page.tsx                  # Lista de links
│   └── new/page.tsx              # Crear link
└── stats/
    └── page.tsx                  # Estadísticas en vivo
```

### 2.2 Layout del Dashboard

**Archivo:** `app/(admin)/admin.dub.co/layout.tsx`

```tsx
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/ui/admin/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }
  
  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
```

### 2.3 Sidebar Component

**Archivo:** `ui/admin/admin-sidebar.tsx`

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@dub/utils';

const navItems = [
  { name: 'Dashboard', href: '/admin.dub.co', icon: 'LayoutDashboard' },
  { name: 'Links', href: '/admin.dub.co/links', icon: 'Link' },
  { name: 'Estadísticas', href: '/admin.dub.co/stats', icon: 'BarChart3' },
  { name: 'Configuración', href: '/admin.dub.co/settings', icon: 'Settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  
  return (
    <aside className="w-64 border-r border-[#2A2A2A] bg-[#0A0A0A]">
      <div className="p-6">
        <h1 className="text-xl font-bold text-[#00FF99]">VideoTrack</h1>
        <p className="text-xs text-[#666]">Admin Panel</p>
      </div>
      
      <nav className="px-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname === item.href
                ? "bg-[#141414] text-[#00FF99]"
                : "text-[#A0A0A0] hover:bg-[#1A1A1A] hover:text-white"
            )}
          >
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

### 2.4 Dashboard Home

**Archivo:** `app/(admin)/admin.dub.co/page.tsx`

```tsx
import { prisma } from "@dub/prisma";
import { StatsCard } from "@/ui/admin/stats-card";
import { RecentLinks } from "@/ui/admin/recent-links";

export default async function AdminDashboard() {
  const [totalLinks, totalClicks, recentLinks] = await Promise.all([
    prisma.link.count(),
    prisma.link.aggregate({ _sum: { clicks: true } }),
    prisma.link.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        domain: true,
        key: true,
        url: true,
        clicks: true,
        createdAt: true,
      }
    })
  ]);
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-[#A0A0A0] mt-1">Resumen de tu cuenta</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Links"
          value={totalLinks.toLocaleString()}
          icon="Link"
        />
        <StatsCard
          title="Total Clicks"
          value={totalClicks._sum.clicks?.toLocaleString() || '0'}
          icon="MousePointerClick"
        />
        <StatsCard
          title="Links Hoy"
          value={recentLinks.filter(l => 
            new Date(l.createdAt) > new Date(Date.now() - 86400000)
          ).length.toString()}
          icon="Calendar"
        />
      </div>
      
      <RecentLinks links={recentLinks} />
    </div>
  );
}
```

### 2.5 Stats Card Component

**Archivo:** `ui/admin/stats-card.tsx`

```tsx
import { LucideIcon, Link, MousePointerClick, Calendar } from 'lucide-react';

const iconMap = { Link, MousePointerClick, Calendar };

interface StatsCardProps {
  title: string;
  value: string;
  icon: keyof typeof iconMap;
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
  const Icon = iconMap[icon];
  
  return (
    <div className="border border-[#2A2A2A] bg-[#141414] rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#A0A0A0]">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className="p-3 bg-[#1A1A1A] rounded-lg">
          <Icon className="w-6 h-6 text-[#00FF99]" />
        </div>
      </div>
    </div>
  );
}
```

---

## 🔗 PARTE 3: ACORTADOR DE LINKS

### 3.1 Lista de Links

**Archivo:** `app/(admin)/admin.dub.co/links/page.tsx`

```tsx
import { prisma } from "@dub/prisma";
import { LinkTable } from "@/ui/admin/link-table";
import { Button } from "@dub/ui";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function LinksPage() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      domain: true,
      key: true,
      url: true,
      clicks: true,
      createdAt: true,
    }
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Links</h1>
          <p className="text-[#A0A0A0] mt-1">{links.length} links creados</p>
        </div>
        <Link href="/admin.dub.co/links/new">
          <Button className="bg-[#00FF99] text-black hover:bg-[#00CC7A]">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Link
          </Button>
        </Link>
      </div>
      
      <LinkTable links={links} />
    </div>
  );
}
```

### 3.2 Link Table Component

**Archivo:** `ui/admin/link-table.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Copy, ExternalLink, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Link {
  id: string;
  domain: string;
  key: string;
  url: string;
  clicks: number;
  createdAt: Date;
}

export function LinkTable({ links }: { links: Link[] }) {
  const [search, setSearch] = useState('');
  
  const filtered = links.filter(l => 
    l.url.toLowerCase().includes(search.toLowerCase()) ||
    l.key.toLowerCase().includes(search.toLowerCase())
  );
  
  const copyToClipboard = (shortLink: string) => {
    navigator.clipboard.writeText(shortLink);
    toast.success('Link copiado al portapapeles');
  };
  
  return (
    <div className="border border-[#2A2A2A] rounded-lg overflow-hidden">
      <div className="p-4 border-b border-[#2A2A2A]">
        <input
          type="text"
          placeholder="Buscar links..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#00FF99]"
        />
      </div>
      
      <table className="w-full">
        <thead className="bg-[#141414]">
          <tr>
            <th className="text-left px-6 py-3 text-sm font-medium text-[#A0A0A0]">Short Link</th>
            <th className="text-left px-6 py-3 text-sm font-medium text-[#A0A0A0]">Destination</th>
            <th className="text-right px-6 py-3 text-sm font-medium text-[#A0A0A0]">Clicks</th>
            <th className="text-right px-6 py-3 text-sm font-medium text-[#A0A0A0]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2A2A2A]">
          {filtered.map((link) => (
            <tr key={link.id} className="hover:bg-[#1A1A1A]">
              <td className="px-6 py-4">
                <code className="text-[#00FF99] font-mono text-sm">
                  {link.domain}/{link.key}
                </code>
              </td>
              <td className="px-6 py-4">
                <span className="text-[#A0A0A0] text-sm truncate max-w-md block">
                  {link.url}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-white font-medium">{link.clicks.toLocaleString()}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => copyToClipboard(`https://${link.domain}/${link.key}`)}
                    className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4 text-[#A0A0A0]" />
                  </button>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
                    title="Open"
                  >
                    <ExternalLink className="w-4 h-4 text-[#A0A0A0]" />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 3.3 Crear Link Form

**Archivo:** `app/(admin)/admin.dub.co/links/new/page.tsx`

```tsx
import { CreateLinkForm } from "@/ui/admin/create-link-form";

export default function NewLinkPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Crear Nuevo Link</h1>
        <p className="text-[#A0A0A0] mt-1">Acorta una URL larga</p>
      </div>
      
      <CreateLinkForm />
    </div>
  );
}
```

### 3.4 Create Link Form Component

**Archivo:** `ui/admin/create-link-form.tsx`

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label } from '@dub/ui';
import { toast } from 'sonner';
import { createLink } from '@/app/(admin)/admin.dub.co/links/actions';

export function CreateLinkForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await createLink(formData);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      setGeneratedLink(result.shortLink);
      toast.success('Link creado exitosamente');
      router.refresh();
    }
    
    setLoading(false);
  };
  
  if (generatedLink) {
    return (
      <div className="border border-[#2A2A2A] bg-[#141414] rounded-lg p-8 text-center space-y-4">
        <p className="text-[#A0A0A0]">Tu link acortado:</p>
        <code className="text-2xl font-bold text-[#00FF99] font-mono">
          {generatedLink}
        </code>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigator.clipboard.writeText(generatedLink)}
            className="bg-[#00FF99] text-black hover:bg-[#00CC7A]"
          >
            Copiar
          </Button>
          <Button
            onClick={() => setGeneratedLink('')}
            variant="secondary"
          >
            Crear Otro
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="url">URL Destino</Label>
        <Input
          id="url"
          name="url"
          type="url"
          placeholder="https://ejemplo.com/pagina-muy-larga"
          required
          className="bg-[#1A1A1A] border-[#2A2A2A] text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="key">Custom Slug (opcional)</Label>
        <Input
          id="key"
          name="key"
          type="text"
          placeholder="mi-link"
          className="bg-[#1A1A1A] border-[#2A2A2A] text-white font-mono"
        />
        <p className="text-xs text-[#666]">Si lo dejas vacío, se generará automáticamente</p>
      </div>
      
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#00FF99] text-black hover:bg-[#00CC7A]"
      >
        {loading ? 'Creando...' : 'Crear Link'}
      </Button>
    </form>
  );
}
```

### 3.5 Server Action para Crear Link

**Archivo:** `app/(admin)/admin.dub.co/links/actions.ts`

```tsx
'use server';

import { prisma } from "@dub/prisma";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function createLink(formData: FormData) {
  try {
    const url = formData.get('url') as string;
    const key = (formData.get('key') as string) || nanoid(6);
    const domain = 'dub.sh'; // Default domain
    
    // Validar URL
    try {
      new URL(url);
    } catch {
      return { error: 'URL inválida' };
    }
    
    // Verificar si el key ya existe
    const existing = await prisma.link.findUnique({
      where: { domain_key: { domain, key } }
    });
    
    if (existing) {
      return { error: 'Este slug ya está en uso' };
    }
    
    // Crear link
    const link = await prisma.link.create({
      data: {
        url,
        key,
        domain,
        shortLink: `https://${domain}/${key}`,
      }
    });
    
    revalidatePath('/admin.dub.co/links');
    
    return { success: true, shortLink: link.shortLink };
  } catch (error) {
    return { error: 'Error al crear el link' };
  }
}
```

---

## 📊 PARTE 4: ESTADÍSTICAS EN VIVO

### 4.1 Stats Page

**Archivo:** `app/(admin)/admin.dub.co/stats/page.tsx`

```tsx
import { prisma } from "@dub/prisma";
import { LiveStats } from "@/ui/admin/live-stats";

export default async function StatsPage() {
  const totalClicks = await prisma.link.aggregate({
    _sum: { clicks: true }
  });
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Estadísticas</h1>
        <p className="text-[#A0A0A0] mt-1">Datos en tiempo real</p>
      </div>
      
      <LiveStats />
    </div>
  );
}
```

### 4.2 Live Stats Component

**Archivo:** `ui/admin/live-stats.tsx`

```tsx
'use client';

import useSWR from 'swr';
import { fetcher } from '@dub/utils';

export function LiveStats() {
  const { data, isLoading } = useSWR('/api/analytics', fetcher, {
    refreshInterval: 60000, // 60 segundos
    revalidateOnFocus: true,
  });
  
  if (isLoading) {
    return <div className="text-[#A0A0A0]">Cargando estadísticas...</div>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="border border-[#2A2A2A] bg-[#141414] rounded-lg p-6">
        <h3 className="text-sm text-[#A0A0A0] mb-2">Clicks Totales</h3>
        <p className="text-4xl font-bold text-[#00FF99]">
          {data?.totalClicks?.toLocaleString() || '0'}
        </p>
      </div>
      
      <div className="border border-[#2A2A2A] bg-[#141414] rounded-lg p-6">
        <h3 className="text-sm text-[#A0A0A0] mb-2">Links Activos</h3>
        <p className="text-4xl font-bold text-[#00FF99]">
          {data?.totalLinks?.toLocaleString() || '0'}
        </p>
      </div>
    </div>
  );
}
```

---

## 📄 PARTE 5: PDF REPORTS

### 5.1 PDF Report Template

**Archivo:** `ui/reports/analytics-report-pdf.tsx`

```tsx
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: '#0A0A0A' },
  header: { marginBottom: 20, borderBottom: 2, borderColor: '#00FF99', paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#00FF99' },
  subtitle: { fontSize: 12, color: '#A0A0A0', marginTop: 5 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 10 },
  row: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#2A2A2A' },
  cell: { flex: 1, fontSize: 10, color: '#A0A0A0' },
  cellValue: { flex: 1, fontSize: 10, color: '#FFFFFF', textAlign: 'right' },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center' },
  footerText: { fontSize: 8, color: '#666666' },
});

interface ReportData {
  totalLinks: number;
  totalClicks: number;
  topLinks: Array<{ key: string; clicks: number; url: string }>;
  generatedAt: string;
}

export const AnalyticsReport = ({ data }: { data: ReportData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>VideoTrack Analytics Report</Text>
        <Text style={styles.subtitle}>Generado el {data.generatedAt}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen</Text>
        <View style={styles.row}>
          <Text style={styles.cell}>Total Links</Text>
          <Text style={styles.cellValue}>{data.totalLinks.toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Total Clicks</Text>
          <Text style={styles.cellValue}>{data.totalClicks.toLocaleString()}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Links</Text>
        {data.topLinks.map((link, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.cell}>{link.key}</Text>
            <Text style={styles.cellValue}>{link.clicks} clicks</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>VideoTrack - Inspiria Studios</Text>
      </View>
    </Page>
  </Document>
);
```

### 5.2 PDF Download Button

**Archivo:** `ui/reports/report-download-button.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@dub/ui';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { pdf } from '@react-pdf/renderer';
import { AnalyticsReport } from './analytics-report-pdf';

interface ReportDownloadButtonProps {
  data: {
    totalLinks: number;
    totalClicks: number;
    topLinks: Array<{ key: string; clicks: number; url: string }>;
  };
}

export function ReportDownloadButton({ data }: ReportDownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  
  const handleDownload = async () => {
    setLoading(true);
    try {
      const report = (
        <AnalyticsReport
          data={{
            ...data,
            generatedAt: new Date().toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          }}
        />
      );
      
      const blob = await pdf(report).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `videotrack-report-${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Reporte descargado');
    } catch {
      toast.error('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      className="bg-[#00FF99] text-black hover:bg-[#00CC7A]"
    >
      <Download className="w-4 h-4 mr-2" />
      {loading ? 'Generando...' : 'Descargar PDF'}
    </Button>
  );
}
```

---

## 🚀 CRONOGRAMA

| Fase | Tareas | Duración |
|------|--------|----------|
| 1. Reducción Build | Git rm, .vercelignore, next.config | 2-3 horas |
| 2. Deploy Exitoso | Push, monitorear build | 15-30 min |
| 3. Google OAuth | Config, env vars, test login | 1-2 horas |
| 4. Admin Dashboard | Layout, sidebar, home | 2-3 horas |
| 5. Link Manager | CRUD, table, form | 3-4 horas |
| 6. Live Stats | SWR, components | 1-2 horas |
| 7. PDF Reports | Template, download | 2-3 horas |
| **Total** | | **12-17 horas** |

---

## ✅ CRITERIOS DE ACEPTACIÓN

- [ ] Login con Google funciona
- [ ] Dashboard muestra stats básicos
- [ ] Crear links nuevos
- [ ] Lista de links con búsqueda
- [ ] Copiar short link al clipboard
- [ ] Estadísticas actualizan cada 60s
- [ ] Descargar PDF report
- [ ] Estética Inspiria Studios aplicada
