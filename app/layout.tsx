import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollToTopButton from "./components/layout/ScrollToTopButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fixnex.ae"),
  applicationName: "FixNex",
  title: {
    default: "FixNex | AI-Powered Property Maintenance",
    template: "%s | FixNex",
  },
  description:
    "FixNex delivers proactive, AI-powered property maintenance for villas, apartments, and commercial buildings across the UAE.",
  keywords: [
    "FixNex",
    "property maintenance",
    "facility management",
    "smart maintenance",
    "AI monitoring",
    "UAE home services",
    "building maintenance",
    "predictive maintenance",
    "repair services UAE",
  ],
  authors: [{ name: "FixNex" }],
  category: "Property Maintenance",
  creator: "FixNex",
  publisher: "FixNex",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fixnex.ae",
    siteName: "FixNex",
    title: "FixNex | AI-Powered Property Maintenance",
    description:
      "Predict, prevent, and resolve property issues with FixNex. We combine AI monitoring, smart sensors, and expert technicians to keep your spaces running flawlessly.",
    images: [
      {
        url: "/fixlogo.png",
        width: 1024,
        height: 1024,
        alt: "FixNex logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FixNex | AI-Powered Property Maintenance",
    description:
      "Experience proactive property maintenance with FixNex’s AI-powered monitoring and skilled technicians across the UAE.",
    site: "@FixNex",
    creator: "@FixNex",
    images: ["/fixlogo.png"],
  },
  icons: {
    icon: "/fixlogo.png",
    shortcut: "/fixlogo.png",
    apple: "/fixlogo.png",
    other: [
      {
        rel: "mask-icon",
        url: "/fixlogo.png",
        color: "#0b1c3f",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  themeColor: "#050815",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-black `}
      >
        {/* <Header /> */}
        {children}
        {/* <Footer/> */}
        <ScrollToTopButton />
      </body>
    </html>
  );
}
