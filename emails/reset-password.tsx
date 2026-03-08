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

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://activa90.com'
    : '';

export default function ResetPasswordEmail({
  name,
  resetUrl,
  expiresInHours = 1,
}: ResetPasswordEmailProps) {
  return (
    <Html lang="es">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: '#A8001C',
                'brand-dark': '#7A0015',
                offwhite: '#F5F0EB',
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
        <Preview>Restablecer contraseña de Activa 90</Preview>
        <Body className="bg-[#f2f2f2] font-[Montserrat,Arial,sans-serif] py-40">

          {/* Header */}
          <Container className="max-w-[600px] mx-auto">
            <Section className="bg-brand px-40 py-24 rounded-t-[8px]">
              <Row>
                <Column className="text-center">
                  <Img
                    src={`${baseURL}/static/KWLogo.png`}
                    alt="Keller Williams"
                    width="48"
                    height="48"
                    className="mx-auto mb-8"
                  />
                  <Text className="text-white font-bold text-[22px] m-0 tracking-[2px] uppercase">
                    Activa 90
                  </Text>
                  <Text className="text-[rgba(255,255,255,0.75)] text-[11px] m-0 tracking-[1px] uppercase">
                    Keller Williams
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Body */}
            <Section className="bg-white px-48 py-40">
              {/* Lock icon */}
              <Section className="bg-[rgba(168,0,28,0.08)] rounded-[50%] w-[64px] h-[64px] mx-auto mb-24 text-center">
                <Text className="text-[32px] m-0 leading-[64px]">🔒</Text>
              </Section>

              <Heading className="text-[#0D0D0D] text-[24px] font-bold m-0 mb-16 text-center leading-[1.2]">
                Restablecer contraseña
              </Heading>
              <Text className="text-[#5C5C5C] text-[15px] m-0 mb-16 leading-[1.6]">
                Hola {name}, recibimos una solicitud para restablecer la contraseña de tu cuenta
                en Activa 90.
              </Text>
              <Text className="text-[#5C5C5C] text-[15px] m-0 mb-32 leading-[1.6]">
                Haz clic en el botón de abajo para crear una nueva contraseña. Este enlace
                expira en <strong>{expiresInHours} hora{expiresInHours !== 1 ? 's' : ''}</strong>.
              </Text>

              <Button
                href={resetUrl}
                className="bg-brand text-white font-bold text-[15px] px-40 py-16 rounded-[6px] no-underline box-border block text-center"
              >
                Restablecer mi contraseña
              </Button>

              <Hr className="border-none border-t border-solid border-[#E4DDD6] my-32" />

              {/* Security note */}
              <Section className="bg-[#FEF3C7] border-solid border border-[#B45309] rounded-[6px] px-20 py-16">
                <Text className="text-[#B45309] text-[13px] m-0 leading-[1.5]">
                  <strong>Aviso de seguridad:</strong> Si no solicitaste este cambio,
                  ignora este mensaje. Tu contraseña actual seguirá siendo la misma y nadie
                  más tiene acceso a tu cuenta.
                </Text>
              </Section>

              <Text className="text-[#9B9B9B] text-[12px] m-0 mt-24 leading-[1.5]">
                Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:<br />
                <span className="text-brand">{resetUrl}</span>
              </Text>
            </Section>

            {/* Footer */}
            <Section className="bg-[#F5F0EB] px-48 py-24 rounded-b-[8px]">
              <Text className="text-[#9B9B9B] text-[12px] text-center m-0 leading-[1.6]">
                Activa 90 — Programa de Entrenamiento Inmobiliario · Keller Williams 2026<br />
                Este enlace es de uso único y expira en {expiresInHours} hora{expiresInHours !== 1 ? 's' : ''}.
              </Text>
            </Section>
          </Container>

        </Body>
      </Tailwind>
    </Html>
  );
}

ResetPasswordEmail.PreviewProps = {
  name: 'Carlos Ramírez',
  resetUrl: 'https://activa90.com/reset-password?token=abc123',
  expiresInHours: 1,
} satisfies ResetPasswordEmailProps;

export { ResetPasswordEmail };
