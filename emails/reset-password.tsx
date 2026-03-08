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

interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
  expiresInHours?: number;
}

const logoUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://leticiagalindez-create.github.io/Activa90/KWLogo.png'
    : '/static/KWLogo.png';

export default function ResetPasswordEmail({
  name,
  resetUrl,
  expiresInHours = 1,
}: ResetPasswordEmailProps) {
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
        <Preview>Restablecer contraseña — Activa 90</Preview>

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

              {/* Lock icon */}
              <Section style={{ backgroundColor: 'rgba(168,0,28,0.08)', borderRadius: '50%', width: '64px', height: '64px', margin: '0 auto 24px', textAlign: 'center' }}>
                <Text style={{ fontSize: '30px', margin: 0, lineHeight: '64px' }}>🔒</Text>
              </Section>

              <Heading style={{ color: '#0D0D0D', fontSize: '24px', fontWeight: 700, margin: '0 0 16px', textAlign: 'center', lineHeight: 1.2 }}>
                Restablecer contraseña
              </Heading>
              <Text style={{ color: '#5C5C5C', fontSize: '15px', lineHeight: 1.7, margin: '0 0 16px' }}>
                Hola {name}, recibimos una solicitud para restablecer la contraseña de tu cuenta en Activa 90.
              </Text>
              <Text style={{ color: '#5C5C5C', fontSize: '15px', lineHeight: 1.7, margin: '0 0 32px' }}>
                Haz clic en el botón para crear una nueva contraseña. Este enlace expira en{' '}
                <strong>{expiresInHours} hora{expiresInHours !== 1 ? 's' : ''}</strong>.
              </Text>

              <Button
                href={resetUrl}
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
                Restablecer mi contraseña
              </Button>

              <Hr style={{ border: 'none', borderTop: '1px solid #E4DDD6', margin: '36px 0' }} />

              {/* Security note */}
              <Row>
                <Column style={{ backgroundColor: '#FEF3C7', border: '1px solid #B45309', borderRadius: '6px', padding: '14px 18px' }}>
                  <Text style={{ color: '#B45309', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
                    <strong>Aviso de seguridad:</strong> Si no solicitaste este cambio, ignora este
                    mensaje. Tu contraseña actual no se verá afectada.
                  </Text>
                </Column>
              </Row>

              <Text style={{ color: '#9B9B9B', fontSize: '12px', margin: '24px 0 0', lineHeight: 1.5 }}>
                Si el botón no funciona, copia este enlace en tu navegador:
                <br />
                <span style={{ color: '#A8001C' }}>{resetUrl}</span>
              </Text>
            </Section>

            {/* ── Footer ── */}
            <Section style={{ backgroundColor: '#F5F0EB', padding: '24px 48px', borderRadius: '0 0 8px 8px' }}>
              <Text style={{ color: '#9B9B9B', fontSize: '12px', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
                Activa 90 — Programa de Entrenamiento Inmobiliario · Keller Williams 2026
                <br />Este enlace es de uso único y expira en {expiresInHours} hora{expiresInHours !== 1 ? 's' : ''}.
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

ResetPasswordEmail.PreviewProps = {
  name: 'Leticia Galindez',
  resetUrl: 'https://leticiagalindez-create.github.io/Activa90/index.html?reset=abc123',
  expiresInHours: 1,
} satisfies ResetPasswordEmailProps;

export { ResetPasswordEmail };
