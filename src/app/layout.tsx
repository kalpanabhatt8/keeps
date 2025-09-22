import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Bricolage_Grotesque, Manrope, Caveat, Space_Grotesk, Patrick_Hand, Poppins, Plaster, Lato } from "next/font/google";

// Local font (Minecraftia)
const minecraftia = localFont({
  src: "../../public/fonts/Minecraftia-Regular.ttf",
  variable: "--font-minecraftia",
});

const caress = localFont({
  src: "../../public/fonts/caress.otf",
  variable: "--font-caress",
});

const vensfolk = localFont({
  src: "../../public/fonts/Vensfolk.otf",
  variable: "--font-vensfolk",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-bricolage",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  display: "swap",
  variable: "--font-lato",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-caveat",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700","800" ],
  display: "swap",
  variable: "--font-Poppins",
});

const plaster = Plaster({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-plaster",
});

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-patrik-hand",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", ],
  display: "swap",
  variable: "--font-space-grotesk",
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
        theme: "simple",
        variables: {
          colorPrimary: "#6370e3",
          fontFamily: `var(${manrope.variable}), sans-serif`,
        },
        elements: {
          componentContainer: {
            border: "1px solid #e5e5e5",
            fontFamily: `var(${manrope.variable}), sans-serif !important`,
          },
          developmentOrTestModeBox: {
            background: `repeating-linear-gradient(-45deg, transparent, transparent 6px, #7c8bff20 6px, #7c8bff20 12px)`,
            border: "1px solid #7c8bff",
          },
          headerTitle: {
            fontFamily: `var(${manrope.variable}), sans-serif !important`,
          },
        },
      }}
    >
      <html
        lang="en"
        className={`${minecraftia.variable} ${caress.variable} ${vensfolk.variable} ${bricolageGrotesque.variable} ${manrope.variable} ${caveat.variable} ${patrickHand.variable} ${spaceGrotesk.variable} ${poppins.variable}  ${plaster.variable} ${lato.variable}  `}
      >
        <body className={`${manrope.className} font-sans`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
