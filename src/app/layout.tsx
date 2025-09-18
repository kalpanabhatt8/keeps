import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { neobrutalism } from "@clerk/themes";
import { Epilogue } from "next/font/google";

// Local font (Minecraftia)
const minecraftia = localFont({
  src: "/fonts/Minecraftia-Regular.ttf",
  variable: "--font-minecraftia",
});

const epilogue = Epilogue({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-epilogue', // Assign a CSS variable name
});

const epundaSlab = localFont({
  src: [
    {
      path: "../../public/fonts/Epunda_Slab/static/EpundaSlab-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Epunda_Slab/static/EpundaSlab-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Epunda_Slab/static/EpundaSlab-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Epunda_Slab/static/EpundaSlab-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Epunda_Slab/static/EpundaSlab-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-epunda-slab",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Keeps",
  description: "A private, playful scrapbook to plan, rant, dream, and collect pretty things.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        theme: 'simple',
        variables: {
          colorPrimary: '#6370e3',
          fontFamily: `var(${epilogue.variable}), sans-serif`,
          // You might also find a 'colorTextSecondary' variable that influences this,
          // but targeting the element directly is more precise for this specific link.
        },
        elements: {
          componentContainer: {
            border: '1px solid #e5e5e5',
            fontFamily: `var(${epilogue.variable}), sans-serif !important`,

          },
          developmentOrTestModeBox: {
            // Create a new striped gradient with your purple color
            background: `repeating-linear-gradient(-45deg, transparent, transparent 6px, #7c8bff20 6px, #7c8bff20 12px)`,
            border: '1px solid #7c8bff',
          },
          headerTitle: {
            fontFamily: `var(${epilogue.variable}), sans-serif !important`,
          },

        }
      }}
    >
      <html
        lang="en"
        className={`${minecraftia.variable} ${epilogue.variable} ${epundaSlab.variable}`}
      >
        <body className={`${epundaSlab.className} font-serif`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
