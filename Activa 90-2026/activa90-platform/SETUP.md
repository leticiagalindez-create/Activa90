# Activa 90 Platform — Setup Guide

## 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratuita
2. Crea un nuevo proyecto
3. Ve a **Project Settings → API** y copia:
   - `Project URL` (formato: `https://xxxxx.supabase.co`)
   - `anon public key` (clave larga que empieza con `eyJ...`)

## 2. Configurar credenciales

Abre `js/config.js` y reemplaza:

```javascript
const SUPABASE_URL  = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON = 'YOUR_ANON_PUBLIC_KEY';
```

Con tus valores reales.

## 3. Crear tablas en Supabase

En tu proyecto de Supabase, ve a **SQL Editor** y ejecuta el siguiente script:

```sql
-- Tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT,
  email      TEXT,
  cohort     TEXT DEFAULT '2026',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Función que crea un perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Tabla de progreso por módulo
CREATE TABLE public.user_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id       TEXT NOT NULL,
  completed       BOOLEAN DEFAULT FALSE,
  completed_at    TIMESTAMPTZ,
  tabs_visited    TEXT[] DEFAULT '{}',
  last_visited_at TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_progress_unique UNIQUE (user_id, module_id)
);

-- Seguridad de filas (RLS)
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own profile select"  ON public.profiles      FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own profile update"  ON public.profiles      FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "own progress select" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own progress insert" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own progress update" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);
```

## 4. Iniciar el servidor local

**Opción A — Python (recomendado, no requiere instalación adicional):**

Desde la carpeta `Activa 90-2026`, ejecuta:
```
python -m http.server 8080
```
Abre: [http://localhost:8080/activa90-platform/](http://localhost:8080/activa90-platform/)

**Opción B — VS Code Live Server:**

1. Instala la extensión "Live Server" en VS Code
2. Abre la carpeta `Activa 90-2026` en VS Code
3. Click derecho en `activa90-platform/index.html` → "Open with Live Server"

**Opción C — Node.js http-server:**
```
npx http-server . -p 8080
```

## 5. Acceder a la plataforma

- **Landing page:** http://localhost:8080/activa90-platform/index.html
- **Dashboard:** http://localhost:8080/activa90-platform/dashboard.html (requiere login)

## Estructura de archivos

```
Activa 90-2026/          ← Archivos del curso (DOCX, PPTX, XLSX)
├── activa90-platform/   ← La plataforma web
│   ├── index.html       ← Landing page
│   ├── dashboard.html   ← Panel del estudiante
│   ├── module.html      ← Vista de módulo
│   ├── resources.html   ← Recursos descargables
│   ├── css/             ← Estilos
│   └── js/              ← Lógica
└── .claude/
    └── launch.json      ← Config del servidor de desarrollo
```

## Notas importantes

- Los archivos DOCX se renderizan con **Mammoth.js** directamente en el navegador
- Los archivos PPTX (35–53 MB) se ofrecen como **descarga** (no pueden renderizarse en el navegador sin un servidor)
- El servidor **debe** iniciarse desde `Activa 90-2026/` (no desde `activa90-platform/`) para que los archivos del curso sean accesibles
