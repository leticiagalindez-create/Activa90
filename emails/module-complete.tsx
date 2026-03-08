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

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://activa90.com'
    : '';

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
                success: '#1A7A40',
                'success-bg': '#EAF5EE',
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
        <Preview>¡Módulo {moduleNumber} completado! Sigue avanzando en Activa 90</Preview>
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

            {/* Achievement banner */}
            <Section className="bg-success-bg px-48 py-20">
              <Row>
                <Column className="w-[40px] pr-12">
                  <Text className="text-[28px] m-0">✅</Text>
                </Column>
                <Column>
                  <Text className="text-success font-bold text-[14px] m-0">
                    ¡Módulo {moduleNumber} de {totalModules} completado!
                  </Text>
                  <Text className="text-success text-[13px] m-0">
                    {progressPercent}% del programa completado
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Body */}
            <Section className="bg-white px-48 py-40">
              <Heading className="text-[#0D0D0D] text-[26px] font-bold m-0 mb-16 leading-[1.2]">
                ¡Lo lograste, {name}!
              </Heading>
              <Text className="text-[#5C5C5C] text-[15px] m-0 mb-8 leading-[1.6]">
                Completaste el módulo:
              </Text>
              <Section className="bg-[rgba(168,0,28,0.08)] border-solid border-l-[4px] border-none border-l border-brand rounded-[4px] px-20 py-14 mb-24">
                <Text className="text-brand font-bold text-[16px] m-0">
                  Módulo {moduleNumber}: {moduleName}
                </Text>
              </Section>

              <Text className="text-[#5C5C5C] text-[15px] m-0 mb-32 leading-[1.6]">
                Cada módulo que terminas te acerca más a convertirte en un productor de alto
                rendimiento. Tu consistencia y dedicación marcan la diferencia.
              </Text>

              {/* Progress bar */}
              <Text className="text-[#0D0D0D] font-bold text-[13px] m-0 mb-8 uppercase tracking-[1px]">
                Tu progreso
              </Text>
              <Section className="bg-[#E4DDD6] rounded-[4px] h-[8px] mb-8">
                <Section
                  className="bg-brand rounded-[4px] h-[8px]"
                  style={{ width: `${progressPercent}%` }}
                />
              </Section>
              <Text className="text-[#9B9B9B] text-[12px] m-0 mb-32">
                {moduleNumber} de {totalModules} módulos · {progressPercent}% completado
              </Text>

              <Hr className="border-none border-t border-solid border-[#E4DDD6] my-32" />

              {/* Next step */}
              {isLastModule ? (
                <Section className="text-center">
                  <Text className="text-[#5C5C5C] text-[15px] m-0 mb-24 leading-[1.6]">
                    Este fue tu último módulo. ¡Estás a un paso de completar todo el programa!
                  </Text>
                  <Button
                    href={dashboardUrl}
                    className="bg-brand text-white font-bold text-[15px] px-40 py-16 rounded-[6px] no-underline box-border block text-center"
                  >
                    Ver mi progreso final
                  </Button>
                </Section>
              ) : (
                <Section>
                  <Text className="text-[#0D0D0D] font-bold text-[14px] m-0 mb-8">
                    Siguiente módulo:
                  </Text>
                  <Text className="text-[#5C5C5C] text-[15px] m-0 mb-24 leading-[1.6]">
                    {nextModuleName
                      ? `Módulo ${moduleNumber + 1}: ${nextModuleName}`
                      : `Módulo ${moduleNumber + 1}`}
                  </Text>
                  <Button
                    href={nextModuleUrl || dashboardUrl}
                    className="bg-brand text-white font-bold text-[15px] px-40 py-16 rounded-[6px] no-underline box-border block text-center"
                  >
                    Continuar con el siguiente módulo →
                  </Button>
                </Section>
              )}
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

ModuleCompleteEmail.PreviewProps = {
  name: 'Carlos Ramírez',
  moduleName: 'Fundamentos del Agente Productivo',
  moduleNumber: 3,
  totalModules: 10,
  nextModuleName: 'Prospección y Generación de Leads',
  nextModuleUrl: 'https://activa90.com/module/4',
  dashboardUrl: 'https://activa90.com/dashboard',
} satisfies ModuleCompleteEmailProps;

export { ModuleCompleteEmail };
