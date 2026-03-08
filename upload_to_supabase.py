#!/usr/bin/env python3
"""
Activa 90 — Upload course files to Supabase Storage bucket "docs"
Run: python3 upload_to_supabase.py
"""

import os
import sys
import mimetypes
import urllib.parse
import urllib.request
import warnings

warnings.filterwarnings('ignore')

SUPABASE_URL    = 'https://vtsebkjaipjbxcjlfvrk.supabase.co'
BUCKET          = 'docs'
DOCS_DIR        = os.path.join(os.path.dirname(__file__), 'Activa 90-Doc 2026')

FILES_TO_UPLOAD = [
    '0.2 CARTA DE COMPROMISO Activa90.docx',
    '2.1 Clínica Entendiendo tu mente.docx',
    '3.0 CLINICA_ Atendiendo clientes como Consultor Inmobiliario.docx',
    '3.2 WORKBOOK DEL ASESOR comunicación asertiva.docx',
    '3.3 Atendiendo Clientes como Consultor Inmobiliario.pptx',
    '4.0-Comunicación Asertiva_.docx',
    '4.1Workbook - GUÍA DEL INSTRUCTOR Comunicación Asertiva.docx',
    '4.3 Comunicación Asertiva para Negociación de Contratos, Exclusivas y Cierres.pptx',
    '5.1 Clinica, Listados Manual del Instructor.docx',
    '5.2 Workbook Clínica Avanzada de Listados.docx',
    '5.3 Clínica Avanzada de Listados.pptx',
    '6.0 Clinica-EL PODER DEL SEGUIMIENTO.docx',
    'ACTIVA90_Scoreboard_PC_TL_Template.xlsx',
    'Integrantes Activa 90.xlsx',
    'Metricas Activa 90.xlsx',
    'Final Manual_Maestro_ACTIVA90_modulos_separados.docx',
]

MIME_MAP = {
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.pdf':  'application/pdf',
}

def upload_file(service_key, filename):
    filepath = os.path.join(DOCS_DIR, filename)
    if not os.path.exists(filepath):
        print(f'  ⚠️  No encontrado: {filename}')
        return False

    ext      = os.path.splitext(filename)[1].lower()
    mimetype = MIME_MAP.get(ext, 'application/octet-stream')
    encoded  = urllib.parse.quote(filename)
    url      = f'{SUPABASE_URL}/storage/v1/object/{BUCKET}/{encoded}'

    with open(filepath, 'rb') as f:
        data = f.read()

    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('Authorization', f'Bearer {service_key}')
    req.add_header('apikey', service_key)
    req.add_header('Content-Type', mimetype)
    req.add_header('x-upsert', 'true')  # overwrite if exists

    try:
        with urllib.request.urlopen(req) as resp:
            size_mb = len(data) / (1024 * 1024)
            print(f'  ✅  {filename} ({size_mb:.1f} MB)')
            return True
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f'  ❌  {filename} → HTTP {e.code}: {body[:120]}')
        return False

def main():
    print('╔══════════════════════════════════════════════════════╗')
    print('║   Activa 90 — Subida a Supabase Storage              ║')
    print('╚══════════════════════════════════════════════════════╝')
    print()
    print('Necesitas la SERVICE ROLE KEY de tu proyecto Supabase.')
    print('La encuentras en: Dashboard → Project Settings → API')
    print()
    service_key = input('Pega tu service_role key aquí: ').strip()
    if not service_key or not service_key.startswith('eyJ'):
        print('❌ Clave inválida. Asegúrate de copiar la service_role key completa.')
        sys.exit(1)

    print()
    print(f'📦 Subiendo {len(FILES_TO_UPLOAD)} archivos al bucket "{BUCKET}"...')
    print()

    ok = fail = skip = 0
    for filename in FILES_TO_UPLOAD:
        result = upload_file(service_key, filename)
        if result is True:  ok   += 1
        elif result is False and not os.path.exists(os.path.join(DOCS_DIR, filename)): skip += 1
        else: fail += 1

    print()
    print(f'Resultado: ✅ {ok} subidos  |  ❌ {fail} errores  |  ⚠️ {skip} no encontrados')
    print()
    if fail == 0 and ok > 0:
        print('✅ ¡Listo! Recarga la plataforma y los archivos deberían cargarse desde Supabase.')
    else:
        print('Revisa los errores anteriores.')

if __name__ == '__main__':
    main()
