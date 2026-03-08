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

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://activa90.com'
    : '';

export default function CourseCompleteEmail({
  name,
  totalModules,
  certificateUrl,
  dashboardUrl,
}: CourseCompleteEmailProps) {
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
                gold: '#B45309',
                'gold-bg': '#FEF3C7',
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
        <Preview>¡Felicidades! Completaste Activa 90 — Eres un Productor de Alto Rendimiento</Preview>
        <Body className="bg-[#f2f2f2] font-[Montserrat,Arial,sans-serif] py-40">

          <Container className="max-w-[600px] mx-auto">

            {/* Hero Header — celebración */}
            <Section className="bg-brand px-40 py-32 rounded-t-[8px] text-center">
              <Text className="text-[48px] m-0 mb-8">🏆</Text>
              <Img
                src={`${baseURL}/static/KWLogo.png`}
                alt="Keller Williams"
                width="48"
                height="48"
                className="mx-auto mb-8"
              />
              <Text className="text-white font-bold text-[26px] m-0 tracking-[2px] uppercase">
                Activa 90
              </Text>
              <Text className="text-[rgba(255,255,255,0.75)] text-[11px] m-0 tracking-[1px] uppercase">
                Keller Williams · Programa Completado
              </Text>
            </Section>

            {/* Gold achievement strip */}
            <Section className="bg-gold-bg px-48 py-20 text-center">
              <Text className="text-gold font-bold text-[14px] m-0 uppercase tracking-[2px]">
                ★ &nbsp; Productor de Alto Rendimiento &nbsp; ★
              </Text>
            </Section>

            {/* Body */}
            <Section className="bg-white px-48 py-40">
              <Heading className="text-[#0D0D0D] text-[30px] font-bold m-0 mb-8 leading-[1.15] text-center">
                ¡Felicidades, {name}!
              </Heading>
              <Text className="text-brand font-bold text-[18px] m-0 mb-24 text-center leading-[1.4]">
                Completaste los {totalModules} módulos de Activa 90
              </Text>

              <Text className="text-[#5C5C5C] text-[15px] m-0 mb-16 leading-[1.7]">
                En 90 días demostraste lo más importante: <strong>consistencia, disciplina y
                compromiso con tu crecimiento profesional</strong>. Eso es lo que separa a los
                asesores promedio de los productores de alto rendimiento.
              </Text>
              <Text className="text-[#5C5C5C] text-[15px] m-0 mb-32 leading-[1.7]">
                Keller Williams está orgulloso de acompañarte en este camino. Lo que aprendiste
                aquí no es teoría — es el sistema que usan los mejores agentes del mundo para
                construir negocios inmobiliarios sólidos y duraderos.
              </Text>

              <Hr className="border-none border-t border-solid border-[#E4DDD6] my-32" />

              {/* Stats */}
              <Row className="mb-32">
                <Column className="w-[33%] text-center">
                  <Text className="text-brand font-bold text-[32px] m-0">{totalModules}</Text>
                  <Text className="text-[#9B9B9B] text-[12px] m-0 uppercase tracking-[1px]">Módulos</Text>
                </Column>
                <Column className="w-[33%] text-center">
                  <Text className="text-brand font-bold text-[32px] m-0">90</Text>
                  <Text className="text-[#9B9B9B] text-[12px] m-0 uppercase tracking-[1px]">Días</Text>
                </Column>
                <Column className="w-[33%] text-center">
                  <Text className="text-brand font-bold text-[32px] m-0">100%</Text>
                  <Text className="text-[#9B9B9B] text-[12px] m-0 uppercase tracking-[1px]">Completado</Text>
                </Column>
              </Row>

              <Hr className="border-none border-t border-solid border-[#E4DDD6] my-32" />

              {/* CTA */}
              {certificateUrl ? (
                <>
                  <Text className="text-[#5C5C5C] text-[15px] m-0 mb-24 text-center leading-[1.6]">
                    Tu certificado de finalización ya está disponible. Descárgalo y compártelo.
                  </Text>
                  <Button
                    href={certificateUrl}
                    className="bg-brand text-white font-bold text-[15px] px-40 py-16 rounded-[6px] no-underline box-border block text-center mb-16"
                  >
                    Descargar mi certificado
                  </Button>
                  <Button
                    href={dashboardUrl}
                    className="bg-white text-brand font-bold text-[15px] px-40 py-16 rounded-[6px] no-underline box-border block text-center border-solid border border-brand"
                  >
                    Ver mi progreso
                  </Button>
                </>
              ) : (
                <Button
                  href={dashboardUrl}
                  className="bg-brand text-white font-bold text-[15px] px-40 py-16 rounded-[6px] no-underline box-border block text-center"
                >
                  Ver mi progreso completo
                </Button>
              )}
            </Section>

            {/* Motivational closing */}
            <Section className="bg-[rgba(168,0,28,0.08)] px-48 py-24">
              <Text className="text-brand font-bold text-[14px] m-0 mb-8 uppercase tracking-[1px]">
                El siguiente paso es tuyo
              </Text>
              <Text className="text-[#5C5C5C] text-[14px] m-0 leading-[1.6]">
                El programa terminó, pero tu carrera acaba de comenzar. Usa cada herramienta,
                cada técnica y cada hábito que construiste aquí para crear resultados reales.
                Keller Williams estará aquí para apoyarte.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="bg-[#F5F0EB] px-48 py-24 rounded-b-[8px]">
              <Text className="text-[#9B9B9B] text-[12px] text-center m-0 leading-[1.6]">
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
  name: 'Carlos Ramírez',
  totalModules: 10,
  certificateUrl: 'https://activa90.com/certificate/abc123',
  dashboardUrl: 'https://activa90.com/dashboard',
} satisfies CourseCompleteEmailProps;

export { CourseCompleteEmail };
