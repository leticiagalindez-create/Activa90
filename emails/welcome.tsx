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

interface WelcomeEmailProps {
  name: string;
  loginUrl: string;
}

const logoUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://www.activa90.com/KWLogo.png'
    : '/static/KWLogo.png';

export default function WelcomeEmail({ name, loginUrl }: WelcomeEmailProps) {
  return (
    <Html lang="es">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand:        '#A8001C',
                'brand-dark': '#7A0015',
                offwhite:     '#F5F0EB',
                ink:          '#0D0D0D',
                muted:        '#5C5C5C',
                subtle:       '#9B9B9B',
                border:       '#E4DDD6',
              },
            },
          },
        }}
      >
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
        <Preview>Bienvenido a Activa 90 — Tu transformación empieza hoy</Preview>

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

            {/* ── Body ── */}
            <Section style={{ backgroundColor: '#ffffff', padding: '40px 48px' }}>
              <Heading style={{ color: '#0D0D0D', fontSize: '28px', fontWeight: 700, margin: '0 0 16px', lineHeight: 1.2 }}>
                ¡Bienvenida, {name}!
              </Heading>
              <Text style={{ color: '#5C5C5C', fontSize: '15px', lineHeight: 1.7, margin: '0 0 16px' }}>
                Nos da mucho gusto tenerte en el programa. <strong>Activa 90</strong> es el programa
                de entrenamiento profesional de Keller Williams diseñado para transformar asesores
                en productores de alto rendimiento en <strong>90 días</strong>.
              </Text>
              <Text style={{ color: '#5C5C5C', fontSize: '15px', lineHeight: 1.7, margin: '0 0 32px' }}>
                Tu acceso ya está activo. Entra a la plataforma y comienza tu primer módulo hoy mismo.
              </Text>

              <Button
                href={loginUrl}
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
                Comenzar mi entrenamiento
              </Button>

              <Hr style={{ border: 'none', borderTop: '1px solid #E4DDD6', margin: '36px 0' }} />

              {/* What's included */}
              <Text style={{ color: '#0D0D0D', fontWeight: 700, fontSize: '12px', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Qué encontrarás en Activa 90
              </Text>
              <Row>
                <Column style={{ width: '33%', paddingRight: '12px', verticalAlign: 'top' }}>
                  <Text style={{ fontSize: '24px', margin: '0 0 6px' }}>📋</Text>
                  <Text style={{ color: '#0D0D0D', fontWeight: 700, fontSize: '13px', margin: '0 0 4px' }}>Clínicas</Text>
                  <Text style={{ color: '#5C5C5C', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>Sesiones de práctica y refuerzo</Text>
                </Column>
                <Column style={{ width: '33%', paddingLeft: '6px', paddingRight: '6px', verticalAlign: 'top' }}>
                  <Text style={{ fontSize: '24px', margin: '0 0 6px' }}>🎯</Text>
                  <Text style={{ color: '#0D0D0D', fontWeight: 700, fontSize: '13px', margin: '0 0 4px' }}>Presentaciones</Text>
                  <Text style={{ color: '#5C5C5C', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>Material de apoyo profesional</Text>
                </Column>
                <Column style={{ width: '33%', paddingLeft: '12px', verticalAlign: 'top' }}>
                  <Text style={{ fontSize: '24px', margin: '0 0 6px' }}>📓</Text>
                  <Text style={{ color: '#0D0D0D', fontWeight: 700, fontSize: '13px', margin: '0 0 4px' }}>Workbooks</Text>
                  <Text style={{ color: '#5C5C5C', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>Ejercicios y seguimiento</Text>
                </Column>
              </Row>
            </Section>

            {/* ── Footer ── */}
            <Section style={{ backgroundColor: '#F5F0EB', padding: '24px 48px', borderRadius: '0 0 8px 8px' }}>
              <Text style={{ color: '#9B9B9B', fontSize: '12px', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
                Activa 90 — Programa de Entrenamiento Inmobiliario · Keller Williams 2026
                <br />Si no creaste esta cuenta, ignora este mensaje.
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

WelcomeEmail.PreviewProps = {
  name: 'Leticia Galindez',
  loginUrl: 'https://www.activa90.com/dashboard.html',
} satisfies WelcomeEmailProps;

export { WelcomeEmail };
