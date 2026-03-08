/* ============================================================
   ACTIVA 90 — Central Configuration
   Module manifest + Supabase credentials
   ============================================================
   SETUP: Replace the Supabase values below with your project's
   URL and anon key from: supabase.com > Project Settings > API
   ============================================================ */

const SUPABASE_URL  = 'https://vtsebkjaipjbxcjlfvrk.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0c2Via2phaXBqYnhjamxmdnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NjA2NzYsImV4cCI6MjA4ODQzNjY3Nn0.SlaygQ3R0GQZE7wi-isl8LxWm3AST5TR7ILMtle_ERY';

/* Base path to parent directory where all course files live.
   When served from the Activa 90-2026/ parent folder via HTTP,
   files resolve to: http://localhost:8080/FILENAME              */
const ASSETS_BASE = '../';

/* PPTX files larger than this (MB) use download-only mode      */
const PPTX_EMBED_MAX_MB = 15;

/* ── Module Manifest ──────────────────────────────────────── */
const MODULES = [
  {
    id:       '0',
    number:   0,
    title:    'Introducción al Programa',
    subtitle: 'El punto de partida de tu transformación profesional',
    icon:     '🎯',
    tabs: {
      clinica:      null,
      presentacion: [
        {
          label:  'El Programa',
          file:   ASSETS_BASE + '0.3.1 Presentación.El Programa que transforma asesores en productores de alto rendimiento.pptx',
          sizeMB: 13
        },
        {
          label:  'Presentación a Liderazgo',
          file:   ASSETS_BASE + '0.3.2Presentación a Liderazgo.pptx',
          sizeMB: 2
        }
      ],
      workbook: {
        file:  ASSETS_BASE + '0.2 CARTA DE COMPROMISO Activa90.docx',
        label: 'Carta de Compromiso'
      },
      evaluacion: {
        embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfjMMiglkh0OC1YL9HgYXkjwBycbPWlL27YcvurIdzLRH9yoA/viewform?embedded=true',
        label: 'Evaluación del Módulo'
      }
    }
  },
  {
    id:       '2',
    number:   2,
    title:    'Entendiendo Tu Mente',
    subtitle: 'Psicología aplicada al éxito en bienes raíces',
    icon:     '🧠',
    tabs: {
      clinica: {
        file:  ASSETS_BASE + '2.1 Clínica Entendiendo tu mente.docx',
        label: 'Clínica: Entendiendo Tu Mente'
      },
      presentacion: [
        {
          label:  'Clínica Entendiendo tu mente',
          embedUrl: 'https://gamma.app/embed/67j42p5741vccl1',
          sizeMB: 0
        }
      ],
      workbook:     null,
      evaluacion: {
        embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfjMMiglkh0OC1YL9HgYXkjwBycbPWlL27YcvurIdzLRH9yoA/viewform?embedded=true',
        label: 'Evaluación del Módulo'
      }
    }
  },
  {
    id:       '3',
    number:   3,
    title:    'Atendiendo Clientes',
    subtitle: 'Consultoría inmobiliaria de alto nivel y perfiles psicológicos',
    icon:     '🤝',
    tabs: {
      clinica: {
        file:  ASSETS_BASE + '3.0 CLINICA_ Atendiendo clientes como Consultor Inmobiliario.docx',
        label: 'Clínica: Atendiendo Clientes como Consultor'
      },
      presentacion: [
        {
          label:  'Atendiendo Clientes como Consultor Inmobiliario',
          file:   ASSETS_BASE + '3.3 Atendiendo Clientes como Consultor Inmobiliario.pptx',
          sizeMB: 35,
          embedUrl: 'https://docs.google.com/presentation/d/1fdvEX1w6ubSmM_tLmmRE3cvvQcIQfWEmziVX-y09Tsw/embed?start=false&loop=false&delayms=3000'
        }
      ],
      workbook: {
        file:  ASSETS_BASE + '3.2 WORKBOOK DEL ASESOR comunicación asertiva.docx',
        label: 'Workbook del Asesor'
      },
      evaluacion: {
        embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfjMMiglkh0OC1YL9HgYXkjwBycbPWlL27YcvurIdzLRH9yoA/viewform?embedded=true',
        label: 'Evaluación del Módulo'
      }
    }
  },
  {
    id:       '4',
    number:   4,
    title:    'Comunicación Asertiva',
    subtitle: 'Negociación, exclusivas y cierres efectivos',
    icon:     '💬',
    tabs: {
      clinica: {
        file:  ASSETS_BASE + '4.0-Comunicación Asertiva_.docx',
        label: 'Clínica: Comunicación Asertiva'
      },
      presentacion: [
        {
          label:  'Comunicación Asertiva para Negociación de Contratos, Exclusivas y Cierres',
          file:   ASSETS_BASE + '4.3 Comunicación Asertiva para Negociación de Contratos, Exclusivas y Cierres.pptx',
          sizeMB: 16,
          embedUrl: 'https://docs.google.com/presentation/d/1AcdsczhjWNa7JX0dZuyReVJSjNuRYkYPCofPiGmnfsI/embed?start=false&loop=false&delayms=3000'
        }
      ],
      workbook: {
        file:  ASSETS_BASE + '4.1Workbook - GUÍA DEL INSTRUCTOR Comunicación Asertiva.docx',
        label: 'Guía del Instructor'
      },
      evaluacion: {
        embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfjMMiglkh0OC1YL9HgYXkjwBycbPWlL27YcvurIdzLRH9yoA/viewform?embedded=true',
        label: 'Evaluación del Módulo'
      }
    }
  },
  {
    id:       '5',
    number:   5,
    title:    'Clínica Avanzada de Listados',
    subtitle: 'Dominando el inventario y la captación de propiedades',
    icon:     '🏠',
    tabs: {
      clinica: {
        file:  ASSETS_BASE + '5.1 Clinica, Listados Manual del Instructor.docx',
        label: 'Manual del Instructor: Clínica de Listados'
      },
      presentacion: [
        {
          label:  'Clínica Avanzada de Listados',
          file:   ASSETS_BASE + '5.3 Clínica Avanzada de Listados.pptx',
          sizeMB: 53,
          embedUrl: 'https://docs.google.com/presentation/d/19fWnMOD879dB56hxhhB4bsDEovf_UWer7a3nDzGJ43Y/embed?start=false&loop=false&delayms=3000'
        }
      ],
      workbook: {
        file:  ASSETS_BASE + '5.2 Workbook Clínica Avanzada de Listados.docx',
        label: 'Workbook de Listados'
      },
      evaluacion: {
        embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfjMMiglkh0OC1YL9HgYXkjwBycbPWlL27YcvurIdzLRH9yoA/viewform?embedded=true',
        label: 'Evaluación del Módulo'
      }
    }
  },
  {
    id:       '6',
    number:   6,
    title:    'El Poder del Seguimiento',
    subtitle: 'Sistemas que convierten contactos en cierres',
    icon:     '📈',
    tabs: {
      clinica: {
        file:  ASSETS_BASE + '6.0 Clinica-EL PODER DEL SEGUIMIENTO.docx',
        label: 'Clínica: El Poder del Seguimiento'
      },
      presentacion: null,
      workbook:     null,
      evaluacion: {
        embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfjMMiglkh0OC1YL9HgYXkjwBycbPWlL27YcvurIdzLRH9yoA/viewform?embedded=true',
        label: 'Evaluación del Módulo'
      }
    }
  }
];

/* ── Resources Manifest ───────────────────────────────────── */
const RESOURCES = [
  {
    id:          'scoreboard',
    title:       'Scoreboard Activa 90',
    description: 'Plantilla de puntuación para PC y TL. Registra métricas y desempeño del equipo en tiempo real.',
    file:        ASSETS_BASE + 'ACTIVA90_Scoreboard_PC_TL_Template.xlsx',
    icon:        '🏆',
    category:    'Métricas',
    color:       '#A8001C'
  },
  {
    id:          'integrantes',
    title:       'Integrantes Activa 90',
    description: 'Directorio completo de participantes del programa cohorte 2026.',
    file:        ASSETS_BASE + 'Integrantes Activa 90.xlsx',
    icon:        '👥',
    category:    'Equipo',
    color:       '#5C5C5C'
  },
  {
    id:          'kw-activa',
    title:       'KW Activa 90',
    description: 'Información y datos de la oficina Keller Williams vinculada al programa.',
    file:        ASSETS_BASE + 'Kw Activa 90.xlsx',
    icon:        '🏢',
    category:    'Organización',
    color:       '#5C5C5C'
  },
  {
    id:          'metricas',
    title:       'Métricas Activa 90',
    description: 'Hoja de seguimiento de métricas de rendimiento individual y grupal del programa.',
    file:        ASSETS_BASE + 'Metricas Activa 90.xlsx',
    icon:        '📊',
    category:    'Métricas',
    color:       '#A8001C'
  },
  {
    id:          'formulario-evaluacion',
    title:       'Formulario de Evaluación',
    description: 'Formulario en línea para evaluaciones, feedback y seguimiento del programa Activa 90.',
    file:        'https://docs.google.com/forms/d/e/1FAIpQLSfjMMiglkh0OC1YL9HgYXkjwBycbPWlL27YcvurIdzLRH9yoA/viewform?usp=sharing&ouid=102840559391006658903',
    icon:        '📝',
    category:    'Evaluación',
    color:       '#A8001C'
  }
];

/* ── Manual de Orientación ────────────────────────────────── */
const MANUAL_DOC = {
  file:     ASSETS_BASE + 'Final Manual_Maestro_ACTIVA90_modulos_separados.docx',
  title:    'Manual de Orientación del Estudiante',
  subtitle: 'KW Activa 90 — Guía Completa 2026'
};

/* ── Tab Labels ───────────────────────────────────────────── */
const TAB_LABELS = {
  clinica:      { label: 'Clínica',       icon: '📋' },
  presentacion: { label: 'Presentación',  icon: '📊' },
  workbook:     { label: 'Workbook',      icon: '📝' },
  evaluacion:   { label: 'Evaluación',    icon: '✅' }
};
