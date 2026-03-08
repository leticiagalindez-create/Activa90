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

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://activa90.com'
    : '';

export default function WelcomeEmail({ name, loginUrl }: WelcomeEmailProps) {
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
                surface: '#FDFBF9',
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
                    Activa <span>90</span>
                  </Text>
                  <Text className="text-[rgba(255,255,255,0.75)] text-[11px] m-0 tracking-[1px] uppercase">
                    Keller Williams
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Body */}
            <Section className="bg-white px-48 py-40">
              <Heading className="text-[#0D0D0D] text-[28px] font-bold m-0 mb-16 leading-[1.2]">
                ¡Bienvenido a Activa 90, {name}!
              </Heading>
              <Text className="text-[#5C5C5C] text-[15px] m-0 mb-16 leading-[1.6]">
                Nos da mucho gusto tenerte en el programa. Activa 90 es el programa de entrenamiento
                profesional de Keller Williams diseñado para transformar asesores en productores de
                alto rendimiento en <strong>90 días</strong>.
              </Text>
              <Text className="text-[#5C5C5C] text-[15px] m-0 mb-32 leading-[1.6]">
                Tu acceso ya está activo. Entra a la plataforma y comienza tu primer módulo hoy mismo.
              </Text>

              <Button
                href={loginUrl}
                className="bg-brand text-white font-bold text-[15px] px-40 py-16 rounded-[6px] no-underline box-border block text-center"
              >
                Comenzar mi entrenamiento
              </Button>

              <Hr className="border-none border-t border-solid border-[#E4DDD6] my-32" />

              {/* What to expect */}
              <Text className="text-[#0D0D0D] font-bold text-[13px] m-0 mb-16 uppercase tracking-[1px]">
                Qué encontrarás en Activa 90
              </Text>
              <Row>
                <Column className="w-[33%] pr-12">
                  <Text className="text-brand text-[24px] font-bold m-0">📋</Text>
                  <Text className="text-[#0D0D0D] font-bold text-[13px] m-0 mb-4">Clínicas</Text>
                  <Text className="text-[#5C5C5C] text-[12px] m-0 leading-[1.5]">
                    Sesiones de práctica y refuerzo
                  </Text>
                </Column>
                <Column className="w-[33%] px-6">
                  <Text className="text-brand text-[24px] font-bold m-0">🎯</Text>
                  <Text className="text-[#0D0D0D] font-bold text-[13px] m-0 mb-4">Presentaciones</Text>
                  <Text className="text-[#5C5C5C] text-[12px] m-0 leading-[1.5]">
                    Material de apoyo profesional
                  </Text>
                </Column>
                <Column className="w-[33%] pl-12">
                  <Text className="text-brand text-[24px] font-bold m-0">📓</Text>
                  <Text className="text-[#0D0D0D] font-bold text-[13px] m-0 mb-4">Workbooks</Text>
                  <Text className="text-[#5C5C5C] text-[12px] m-0 leading-[1.5]">
                    Ejercicios y seguimiento
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Footer */}
            <Section className="bg-[#F5F0EB] px-48 py-24 rounded-b-[8px]">
              <Text className="text-[#9B9B9B] text-[12px] text-center m-0 leading-[1.6]">
                Activa 90 — Programa de Entrenamiento Inmobiliario · Keller Williams 2026<br />
                Si no creaste esta cuenta, ignora este mensaje.
              </Text>
            </Section>
          </Container>

        </Body>
      </Tailwind>
    </Html>
  );
}

WelcomeEmail.PreviewProps = {
  name: 'Carlos Ramírez',
  loginUrl: 'https://activa90.com/dashboard',
} satisfies WelcomeEmailProps;

export { WelcomeEmail };
