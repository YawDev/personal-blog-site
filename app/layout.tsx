import NavBar from "@/components/shared/NavBar";
import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/shared/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { MainWrapper } from "@/components/providers/MainWrapper";

export const metadata: Metadata = {
  title: "Personal Blog",
  description: "Personal Blog Site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* min-h-screen ensures the body takes up at least the full height of the viewport */}
      <ThemeProvider>
        <body className="flex flex-col min-h-screen">
          <NavBar />
          {/* flex-grow pushes the footer down by taking up all available space */}
          <MainWrapper>{children}</MainWrapper>
          <Footer />
        </body>
      </ThemeProvider>
    </html>
  );
}
