import type { Metadata, Viewport } from "next";
import { Frank_Ruhl_Libre, Heebo } from "next/font/google";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

const frank = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["500", "700"],
  variable: "--font-frank",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Atlitim — כל עתלית במקום אחד",
    template: "%s · Atlitim",
  },
  description: "Atlitim עוזרת לתושבי עתלית לגלות עסקים, שירותים ובעלי מקצוע מקומיים במקום אחד.",
  applicationName: "Atlitim",
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "Atlitim",
    title: "Atlitim — כל עתלית במקום אחד",
    description: "המקום לגלות עסקים, שירותים ובעלי מקצוע בעתלית.",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e4636",
  width: "device-width",
  initialScale: 1,
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${frank.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">{children}</body>
    </html>
  );
}
