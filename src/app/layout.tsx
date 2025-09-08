import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CTAWindow from "@/components/CTAWindow";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Million Properties | Propiedades que elevan tu vida",
  description:
    "Million Properties es una agencia inmobiliaria moderna que conecta a personas e inversionistas con propiedades únicas en venta y arriendo. Explora casas, apartamentos y proyectos de alto valor con fotos, tours y detalles claros.",
  keywords: [
    "Million Properties",
    "bienes raíces",
    "real estate",
    "venta de casas",
    "arriendo",
    "apartamentos en venta",
    "propiedades de lujo",
    "inversión inmobiliaria",
    "finca raíz",
    "Bogotá",
    "Medellín",
    "Cartagena",
    "Colombia"
  ],
  authors: [{ name: "Million Properties", url: "https://aureliaestates.vercel.app" }],
  openGraph: {
    title: "Million Properties | Propiedades que elevan tu vida",
    description:
      "Encuentra tu próxima propiedad: casas, apartamentos y proyectos con alto potencial de valorización.",
    url: "https://aureliaestates.vercel.app",
    siteName: "Million Properties",
    images: [
      {
        url: "https://aureliaestates.vercel.app/og/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Million Properties — Catálogo inmobiliario",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Million Properties | Propiedades que elevan tu vida",
    description:
      "Explora propiedades destacadas para vivir o invertir, con información clara y fotos de alta calidad.",
    site: "@aurelia_estates",
    images: ["https://aureliaestates.vercel.app/og/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://aureliaestates.vercel.app",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
         <CTAWindow
        img="/home/home-cta-window.jpg"
        header="Million Properties"
        callout="Espacios que respiran con el tiempo"
        description="Nuestro enfoque se guía por el ritmo, la proporción y la luz, permitiendo que cada ambiente gane significado a medida que se vive."
      />
      </body>
    </html>
  );
}
