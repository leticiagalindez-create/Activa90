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

interface CourseCompleteEmailProps {
  name: string;
  totalModules: number;
  certificateUrl?: string;
  dashboardUrl: string;
}

const logoUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://www.activa90.com/KWLogo.png'
    : '/static/KWLogo.png';

export default function CourseCompleteEmail({
  name,
  totalModules,
  certificateUrl,
  dashboardUrl,
}: CourseCompleteEmailProps) {
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
        <Preview>¡Felicidades! Completaste Activa 90 — Eres un Productor de Alto Rendimiento</Preview>

        <Body style={{ backgroundColor: '#f2f2f2', fontFamily: 'Montserrat, Arial, sans-serif', margin: 0, padding: '40px 0' }}>
          <Container style={{ maxWidth: '600px', margin: '0 auto' }}>

            {/* ── Hero Header ── */}
            <Section style={{ backgroundColor: '#A8001C', padding: '36px 40px', borderRadius: '8px 8px 0 0', textAlign: 'center' }}>
              <Text style={{ fontSize: '48px', margin: '0 0 12px' }}>🏆</Text>
              <Img src={logoUrl} alt="Keller Williams" width="52" height="52" style={{ margin: '0 auto 10px', display: 'block' }} />
              <Text style={{ color: '#ffffff', fontWeight: 700, fontSize: '24px', margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>
                Activa 90
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', margin: '4px 0 0', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Keller Williams · Programa Completado
              </Text>
            </Section>

            {/* ── Gold strip ── */}
            <Section style={{ backgroundColor: '#FEF3C7', padding: '14px 48px', textAlign: 'center' }}>
              <Text style={{ color: '#B45309', fontWeight: 700, fontSize: '13px', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>
                ★  &nbsp;Productor de Alto Rendimiento&nbsp;  ★
              </Text>
            </Section>

            {/* ── Body ── */}
            <Section style={{ backgroundColor: '#ffffff', padding: '40px 48px' }}>
              <Heading style={{ color: '#0D0D0D', fontSize: '30px', fontWeight: 700, margin: '0 0 8px', textAlign: 'center', lineHeight: 1.15 }}>
                ¡Felicidades, {name}!
              </Heading>
              <Text style={{ color: '#A8001C', fontWeight: 700, fontSize: '17px', margin: '0 0 28px', textAlign: 'center', lineHeight: 1.4 }}>
                Completaste los {totalModules} módulos de Activa 90
              </Text>

              <Text style={{ color: '#5C5C5C', fontSize: '15px', lineHeight: 1.7, margin: '0 0 16px' }}>
                En 90 días demostraste lo más importante:{' '}
                <strong>consistencia, disciplina y compromiso con tu crecimiento profesional</strong>.
                Eso es lo que separa a los asesores promedio de los productores de alto rendimiento.
              </Text>
              <Text style={{ color: '#5C5C5C', fontSize: '15px', lineHeight: 1.7, margin: '0 0 36px' }}>
                Keller Williams está orgulloso de acompañarte en este camino. Lo que aprendiste aquí
                no es teoría — es el sistema que usan los mejores agentes del mundo para construir
                negocios inmobiliarios sólidos y duraderos.
              </Text>

              <Hr style={{ border: 'none', borderTop: '1px solid #E4DDD6', margin: '0 0 32px' }} />

              {/* Stats */}
              <Row style={{ marginBottom: '36px' }}>
                <Column style={{ width: '33%', textAlign: 'center' }}>
                  <Text style={{ color: '#A8001C', fontWeight: 700, fontSize: '36px', margin: '0 0 4px' }}>{totalModules}</Text>
                  <Text style={{ color: '#9B9B9B', fontSize: '11px', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Módulos</Text>
                </Column>
                <Column style={{ width: '33%', textAlign: 'center', borderLeft: '1px solid #E4DDD6', borderRight: '1px solid #E4DDD6' }}>
                  <Text style={{ color: '#A8001C', fontWeight: 700, fontSize: '36px', margin: '0 0 4px' }}>90</Text>
                  <Text style={{ color: '#9B9B9B', fontSize: '11px', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Días</Text>
                </Column>
                <Column style={{ width: '33%', textAlign: 'center' }}>
                  <Text style={{ color: '#A8001C', fontWeight: 700, fontSize: '36px', margin: '0 0 4px' }}>100%</Text>
                  <Text style={{ color: '#9B9B9B', fontSize: '11px', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Completado</Text>
                </Column>
              </Row>

              <Hr style={{ border: 'none', borderTop: '1px solid #E4DDD6', margin: '0 0 32px' }} />

              {/* CTA */}
              {certificateUrl ? (
                <Section>
                  <Text style={{ color: '#5C5C5C', fontSize: '15px', lineHeight: 1.6, margin: '0 0 24px', textAlign: 'center' }}>
                    Tu certificado de finalización ya está disponible. Descárgalo y compártelo.
                  </Text>
                  <Button
                    href={certificateUrl}
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
                      marginBottom: '12px',
                    }}
                  >
                    Descargar mi certificado
                  </Button>
                  <Button
                    href={dashboardUrl}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#A8001C',
                      fontWeight: 700,
                      fontSize: '15px',
                      padding: '13px 40px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      display: 'block',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      border: '2px solid #A8001C',
                    }}
                  >
                    Ver mi progreso
                  </Button>
                </Section>
              ) : (
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
                  Ver mi progreso completo
                </Button>
              )}
            </Section>

            {/* ── Motivational closing ── */}
            <Section style={{ backgroundColor: 'rgba(168,0,28,0.07)', padding: '24px 48px' }}>
              <Text style={{ color: '#A8001C', fontWeight: 700, fontSize: '12px', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                El siguiente paso es tuyo
              </Text>
              <Text style={{ color: '#5C5C5C', fontSize: '14px', margin: 0, lineHeight: 1.7 }}>
                El programa terminó, pero tu carrera acaba de comenzar. Usa cada herramienta,
                cada técnica y cada hábito que construiste aquí para crear resultados reales.
                Keller Williams estará aquí para apoyarte.
              </Text>
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

CourseCompleteEmail.PreviewProps = {
  name: 'Leticia Galindez',
  totalModules: 10,
  certificateUrl: 'https://www.activa90.com/index.html',
  dashboardUrl: 'https://www.activa90.com/dashboard.html',
} satisfies CourseCompleteEmailProps;

export { CourseCompleteEmail };
