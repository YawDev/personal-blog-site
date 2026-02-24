import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test",
  description: "Test Desc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div>Test Header</div>
        {children}
        <div>Test Footer</div>
      </body>
    </html>
  );
}
