import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Button,
  Img,
  Hr,
  Tailwind,
  pixelBasedPreset,
  Font,
} from '@react-email/components';

interface ModuleCompleteEmailProps {
  name: string;
  moduleName: string;
  moduleNumber: number;
  totalModules: number;
  nextModuleName?: string;
  nextModuleUrl?: string;
  dashboardUrl: string;
}

const logoUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://leticiagalindez-create.github.io/Activa90/KWLogo.png'
    : '/static/KWLogo.png';

export default function ModuleCompleteEmail({
  name,
  moduleName,
  moduleNumber,
  totalModules,
  nextModuleName,
  nextModuleUrl,
  dashboardUrl,
}: ModuleCompleteEmailProps) {
  const isLastModule = moduleNumber === totalModules;
  const progressPercent = Math.round((moduleNumber / totalModules) * 100);
  const progressWidth = `${progressPercent}%`;

  return (
    <Html lang="es">
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Head>
          <Font
            fontFamily="Montserrat"
            fallbackFontFamily="Arial"
            webFont={{
              url: 'https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXo.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
          <Font
            fontFamily="Montserrat"
            fallbackFontFamily="Arial"
            webFont={{
              url: 'https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w5aXo.woff2',
              format: 'woff2',
            }}
            fontWeight={700}
            fontStyle="normal"
          />
        </Head>
        <Preview>{`¡Módulo ${moduleNumber} completado! Sigue avanzando en Activa 90`}</Preview>

        <Body style={{ backgroundColor: '#f2f2f2', fontFamily: 'Montserrat, Arial, sans-serif', margin: 0, padding: '40px 0' }}>
          <Container style={{ maxWidth: '600px', margin: '0 auto' }}>

            {/* ── Header ── */}
            <Section style={{ backgroundColor: '#A8001C', padding: '28px 40px', borderRadius: '8px 8px 0 0', textAlign: 'center' }}>
              <Img src={logoUrl} alt="Keller Williams" width="52" height="52" style={{ margin: '0 auto 10px', display: 'block' }} />
              <Text style={{ color: '#ffffff', fontWeight: 700, fontSize: '22px', margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>
                Activa 90
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', margin: '2px 0 0', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Keller Williams
              </Text>
            </Section>

            {/* ── Achievement banner ── */}
            <Section style={{ backgroundColor: '#EAF5EE', padding: '16px 48px' }}>
              <Row>
                <Column style={{ width: '36px', verticalAlign: 'middle', paddingRight: '12px' }}>
                  <Text style={{ fontSize: '24px', margin: 0 }}>✅</Text>
                </Column>
                <Column style={{ verticalAlign: 'middle' }}>
                  <Text style={{ color: '#1A7A40', fontWeight: 700, fontSize: '14px', margin: '0 0 2px' }}>
                    ¡Módulo {moduleNumber} de {totalModules} completado!
                  </Text>
                  <Text style={{ color: '#1A7A40', fontSize: '13px', margin: 0 }}>
                    {progressPercent}% del programa completado
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* ── Body ── */}
            <Section style={{ backgroundColor: '#ffffff', padding: '40px 48px' }}>
              <Heading style={{ color: '#0D0D0D', fontSize: '26px', fontWeight: 700, margin: '0 0 16px', lineHeight: 1.2 }}>
                ¡Lo lograste, {name}!
              </Heading>

              <Text style={{ color: '#5C5C5C', fontSize: '14px', margin: '0 0 8px' }}>
                Completaste el módulo:
              </Text>

              {/* Module highlight */}
              <Section style={{ backgroundColor: 'rgba(168,0,28,0.07)', borderLeft: '4px solid #A8001C', borderRadius: '4px', padding: '12px 18px', marginBottom: '24px' }}>
                <Text style={{ color: '#A8001C', fontWeight: 700, fontSize: '15px', margin: 0 }}>
                  Módulo {moduleNumber}: {moduleName}
                </Text>
              </Section>

              <Text style={{ color: '#5C5C5C', fontSize: '15px', lineHeight: 1.7, margin: '0 0 32px' }}>
                Cada módulo que terminas te acerca más a convertirte en un productor de alto
                rendimiento. Tu consistencia y dedicación marcan la diferencia.
              </Text>

              {/* Progress bar */}
              <Text style={{ color: '#0D0D0D', fontWeight: 700, fontSize: '12px', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Tu progreso
              </Text>
              <Section style={{ backgroundColor: '#E4DDD6', borderRadius: '4px', height: '8px', overflow: 'hidden', marginBottom: '8px' }}>
                <Section style={{ backgroundColor: '#A8001C', borderRadius: '4px', height: '8px', width: progressWidth }} />
              </Section>
              <Text style={{ color: '#9B9B9B', fontSize: '12px', margin: '0 0 32px' }}>
                {moduleNumber} de {totalModules} módulos · {progressPercent}% completado
              </Text>

              <Hr style={{ border: 'none', borderTop: '1px solid #E4DDD6', margin: '0 0 32px' }} />

              {/* Next step */}
              {isLastModule ? (
                <Section style={{ textAlign: 'center' }}>
                  <Text style={{ color: '#5C5C5C', fontSize: '15px', lineHeight: 1.7, margin: '0 0 24px' }}>
                    Este fue tu último módulo. ¡Estás a un paso de completar todo el programa!
                  </Text>
                  <Button
                    href={dashboardUrl}
                    style={{
                      backgroundColor: '#A8001C',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '15px',
                      padding: '14px 40px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      display: 'block',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                    }}
                  >
                    Ver mi progreso final
                  </Button>
                </Section>
              ) : (
                <Section>
                  <Text style={{ color: '#0D0D0D', fontWeight: 700, fontSize: '14px', margin: '0 0 6px' }}>
                    Siguiente módulo:
                  </Text>
                  <Text style={{ color: '#5C5C5C', fontSize: '15px', margin: '0 0 24px', lineHeight: 1.6 }}>
                    {nextModuleName
                      ? `Módulo ${moduleNumber + 1}: ${nextModuleName}`
                      : `Módulo ${moduleNumber + 1}`}
                  </Text>
                  <Button
                    href={nextModuleUrl || dashboardUrl}
                    style={{
                      backgroundColor: '#A8001C',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '15px',
                      padding: '14px 40px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      display: 'block',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                    }}
                  >
                    Continuar con el siguiente módulo →
                  </Button>
                </Section>
              )}
            </Section>

            {/* ── Footer ── */}
            <Section style={{ backgroundColor: '#F5F0EB', padding: '24px 48px', borderRadius: '0 0 8px 8px' }}>
              <Text style={{ color: '#9B9B9B', fontSize: '12px', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
                Activa 90 — Programa de Entrenamiento Inmobiliario · Keller Williams 2026
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

ModuleCompleteEmail.PreviewProps = {
  name: 'Leticia Galindez',
  moduleName: 'Fundamentos del Agente Productivo',
  moduleNumber: 3,
  totalModules: 10,
  nextModuleName: 'Prospección y Generación de Leads',
  nextModuleUrl: 'https://leticiagalindez-create.github.io/Activa90/module.html',
  dashboardUrl: 'https://leticiagalindez-create.github.io/Activa90/dashboard.html',
} satisfies ModuleCompleteEmailProps;

export { ModuleCompleteEmail };
